import { useMemo, useState } from 'react';
import { embeddedMarketCsv } from './data/embeddedMarketCsv';
import { buildDiagnosisInputFromMarketCsv, evaluateDiagnosis } from './domain/diagnosis';
import type { DiagnosisInput, DiagnosisInputSource, DiagnosisResult } from './domain/types';
import { loadHistory, saveHistoryItem } from './storage/historyStorage';

type Screen = 'home' | 'diagnosis' | 'result' | 'history';

const initialInput: DiagnosisInput = {
  tickerName: '',
  plannedShares: 0,
  isSurging: false,
  isFalling: false,
  isAveragingDown: false,
  isEarningsNear: false,
  influencedByBoard: false,
  revengeTrade: false,
  memo: '',
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [input, setInput] = useState<DiagnosisInput>(initialInput);
  const [inputSource, setInputSource] = useState<DiagnosisInputSource>('manual');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisErrorMessage, setDiagnosisErrorMessage] = useState<string | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  const history = useMemo(() => loadHistory(), [historyVersion]);

  function runDiagnosis() {
    setDiagnosisErrorMessage(null);

    let diagnosisInput = input;
    if (inputSource === 'market-csv') {
      try {
        diagnosisInput = buildDiagnosisInputFromMarketCsv({
          csvText: embeddedMarketCsv,
          tickerName: input.tickerName,
          plannedShares: input.plannedShares,
          memo: input.memo,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : '実データ診断で不明なエラーが発生しました。';
        setDiagnosisErrorMessage(message);
        return;
      }
    }

    const nextResult = evaluateDiagnosis(diagnosisInput);
    setResult(nextResult);
    saveHistoryItem({ input: diagnosisInput, result: nextResult, createdAt: new Date().toISOString() });
    setHistoryVersion((version) => version + 1);
    setScreen('result');
  }

  return (
    <main className="app">
      <header className="header">
        <h1>株売買ヘルパーMVP Lite</h1>
        <p>買う前に、感情的な売買になっていないか確認します。</p>
      </header>

      <nav className="nav">
        <button onClick={() => setScreen('home')}>ホーム</button>
        <button onClick={() => setScreen('diagnosis')}>診断</button>
        <button onClick={() => setScreen('history')}>履歴</button>
      </nav>

      {screen === 'home' && (
        <section className="card">
          <h2>ホーム</h2>
          <p>
            急騰飛びつき、ナンピン、決算ギャンブル、掲示板の煽り買いをチェックするための
            小さなMVPです。
          </p>
          <button className="primary" onClick={() => setScreen('diagnosis')}>
            診断を始める
          </button>
        </section>
      )}

      {screen === 'diagnosis' && (
        <section className="card">
          <h2>診断入力</h2>
          <div className="checks">
            <label className="check">
              <input
                type="radio"
                checked={inputSource === 'manual'}
                onChange={() => setInputSource('manual')}
              />
              手入力で診断する
            </label>
            <label className="check">
              <input
                type="radio"
                checked={inputSource === 'market-csv'}
                onChange={() => setInputSource('market-csv')}
              />
              実データを使用する（CSV）
            </label>
          </div>
          <label>
            銘柄名{inputSource === 'market-csv' ? '（例: 8035.T）' : ''}
            <input
              value={input.tickerName}
              onChange={(event) => setInput({ ...input, tickerName: event.target.value })}
              placeholder="例：ABC株式会社"
            />
          </label>
          <label>
            購入予定株数
            <input
              type="number"
              min={0}
              step={1}
              value={input.plannedShares === 0 ? '' : input.plannedShares}
              onChange={(event) =>
                setInput({
                  ...input,
                  plannedShares:
                    event.target.value === '' ? 0 : Math.max(0, Math.trunc(Number(event.target.value))),
                })
              }
              placeholder="例：100"
            />
          </label>

          <div className="checks">
            {[
              ['isSurging', '急騰中の銘柄に飛びつこうとしている'],
              ['isFalling', '下落中の銘柄を安いと思っている'],
              ['isAveragingDown', 'ナンピン目的で買おうとしている'],
              ['isEarningsNear', '決算前後に買おうとしている'],
              ['influencedByBoard', '掲示板の投稿に影響されている'],
              ['revengeTrade', '損を取り返したい気持ちが強い'],
            ].map(([key, label]) => (
              <label className="check" key={key}>
                <input
                  type="checkbox"
                  checked={Boolean(input[key as keyof DiagnosisInput])}
                  onChange={(event) =>
                    setInput({ ...input, [key]: event.target.checked })
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <label>
            メモ
            <textarea
              value={input.memo}
              onChange={(event) => setInput({ ...input, memo: event.target.value })}
              placeholder="買いたい理由を一言で書いてください"
            />
          </label>

          <button className="primary" onClick={runDiagnosis}>
            診断する
          </button>
          {diagnosisErrorMessage && <p>{diagnosisErrorMessage}</p>}
        </section>
      )}

      {screen === 'result' && result && (
        <section className="card">
          <h2>診断結果</h2>
          <p className={`badge ${result.dangerLevel}`}>危険度: {result.dangerLevel}</p>
          <p>スコア: {result.score}</p>
          <p>{result.summaryMessage}</p>
          {result.warnings.length > 0 && (
            <ul>
              {result.warnings.map((warning) => (
                <li key={warning.code}>{warning.message}</li>
              ))}
            </ul>
          )}
          <button onClick={() => setScreen('diagnosis')}>もう一度診断</button>
        </section>
      )}

      {screen === 'history' && (
        <section className="card">
          <h2>履歴</h2>
          {history.length === 0 ? (
            <p>まだ履歴はありません。</p>
          ) : (
            <ul className="history">
              {history.map((item) => (
                <li key={item.createdAt}>
                  <strong>{item.input.tickerName || '銘柄名未入力'}</strong>
                  <span>{item.result.dangerLevel} / score {item.result.score}</span>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
