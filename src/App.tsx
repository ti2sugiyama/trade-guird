import { useMemo, useState } from 'react';
import { embeddedMarketCsv } from './data/embeddedMarketCsv';
import { buildDiagnosisInputFromMarketCsv, evaluateDiagnosis } from './domain/diagnosis';
import type {
  DiagnosisInput,
  DiagnosisInputSource,
  DiagnosisResult,
} from './domain/types';
import { loadHistory, saveHistoryItem } from './storage/historyStorage';

type Screen = 'home' | 'diagnosis' | 'result' | 'history' | 'data-management';

type FetchPreparation = {
  targetLabel: string;
  symbols: string[];
  command: string;
  status: string;
};

type DataRowStatus = 'ok' | 'insufficient' | 'failed';

type DataManagementRow = {
  symbol: string;
  name: string;
  status: DataRowStatus;
  latestDate: string | null;
  latestFetchedAtUtc: string | null;
  staleDays: number | null;
  missingDays: number;
};

const registeredTickers: Array<{ symbol: string; name: string }> = [
  { symbol: '8035.T', name: '東京エレクトロン' },
  { symbol: '7203.T', name: 'トヨタ自動車' },
];

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

const REQUIRED_HISTORY_DAYS = 5;

function parseEmbeddedRows(csvText: string): Array<{ symbol: string; date: string; fetchedAtUtc: string }> {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) {
    return [];
  }

  return lines.slice(1).flatMap((line) => {
    const columns = line.split(',');
    if (columns.length < 8) {
      return [];
    }
    return [{ symbol: columns[0], date: columns[1], fetchedAtUtc: columns[7] }];
  });
}

function diffDays(fromIsoDate: string, to: Date): number {
  const from = new Date(`${fromIsoDate}T00:00:00Z`);
  if (Number.isNaN(from.getTime())) {
    return Number.POSITIVE_INFINITY;
  }
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function buildDataRows(csvText: string, now: Date): DataManagementRow[] {
  const parsedRows = parseEmbeddedRows(csvText);
  const knownTickerNames = new Map(registeredTickers.map((ticker) => [ticker.symbol, ticker.name] as const));
  const symbols = [...new Set(parsedRows.map((row) => row.symbol))].sort((a, b) => a.localeCompare(b));

  return symbols.map((symbol) => {
    const rows = parsedRows.filter((row) => row.symbol === symbol);

    const uniqueDates = [...new Set(rows.map((row) => row.date))].sort((a, b) => a.localeCompare(b));
    const latestDate = uniqueDates[uniqueDates.length - 1];
    const latestFetchedAtUtc = rows
      .map((row) => row.fetchedAtUtc)
      .sort((a, b) => a.localeCompare(b));
    const latestFetchedAtUtcValue =
      latestFetchedAtUtc.length > 0 ? latestFetchedAtUtc[latestFetchedAtUtc.length - 1] : null;
    const staleDays = diffDays(latestDate, now);
    const missingDays = Math.max(0, REQUIRED_HISTORY_DAYS - uniqueDates.length);

    const status: DataRowStatus = missingDays > 0 || staleDays > 1 ? 'insufficient' : 'ok';

    return {
      symbol,
      name: knownTickerNames.get(symbol) ?? symbol,
      status,
      latestDate,
      latestFetchedAtUtc: latestFetchedAtUtcValue,
      staleDays,
      missingDays,
    } satisfies DataManagementRow;
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function calculateRequestedDays(rows: DataManagementRow[]): number {
  if (rows.length === 0) {
    return REQUIRED_HISTORY_DAYS;
  }

  const neededBySymbol = rows.map((row) => {
    const stale = row.staleDays ?? 0;
    const needed = Math.max(row.missingDays, stale) + 2;
    return clamp(needed, 1, 60);
  });
  return Math.max(...neededBySymbol);
}

function buildRangeFromDays(days: number): string {
  if (days <= 7) {
    return '5d';
  }
  if (days <= 30) {
    return '1mo';
  }
  if (days <= 90) {
    return '3mo';
  }
  if (days <= 180) {
    return '6mo';
  }
  return '1y';
}

function buildRefetchCommand(symbols: string[], requestedDays: number): string {
  if (symbols.length === 0) {
    return '対象銘柄がありません。';
  }

  const days = clamp(Math.trunc(requestedDays), 1, 60);
  const range = buildRangeFromDays(days);

  return [
    `printf '%s\\n' ${symbols.join(' ')} > /tmp/refetch_symbols.txt`,
    `python3 src/collect_yahoo_prices_csv.py --symbols-file /tmp/refetch_symbols.txt --out-dir ./tmp --range ${range} --days ${days}`,
  ].join(' && ');
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [input, setInput] = useState<DiagnosisInput>(initialInput);
  const [inputSource, setInputSource] = useState<DiagnosisInputSource>('manual');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisErrorMessage, setDiagnosisErrorMessage] = useState<string | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | DataRowStatus>('all');
  const [queryFilter, setQueryFilter] = useState('');
  const [staleDaysFilter, setStaleDaysFilter] = useState(0);
  const [missingDaysFilter, setMissingDaysFilter] = useState(0);
  const [fetchPreparation, setFetchPreparation] = useState<FetchPreparation | null>(null);

  const history = useMemo(() => loadHistory(), [historyVersion]);
  const dataRows = useMemo(() => buildDataRows(embeddedMarketCsv, new Date()), []);

  const filteredDataRows = useMemo(() => {
    const query = queryFilter.trim().toLowerCase();

    return dataRows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false;
      }

      if (query) {
        const haystack = `${row.symbol} ${row.name}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (staleDaysFilter > 0) {
        if (row.staleDays === null || row.staleDays < staleDaysFilter) {
          return false;
        }
      }

      if (missingDaysFilter > 0 && row.missingDays < missingDaysFilter) {
        return false;
      }

      return true;
    });
  }, [dataRows, missingDaysFilter, queryFilter, staleDaysFilter, statusFilter]);

  const dataSummary = useMemo(() => {
    const latestFetchedAtUtc = dataRows
      .map((row) => row.latestFetchedAtUtc)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => a.localeCompare(b));
    const latestFetchedAtUtcValue =
      latestFetchedAtUtc.length > 0 ? latestFetchedAtUtc[latestFetchedAtUtc.length - 1] : null;

    const successCount = dataRows.filter((row) => row.status === 'ok').length;
    const failedCount = dataRows.filter((row) => row.status === 'failed').length;
    const insufficientCount = dataRows.filter((row) => row.status === 'insufficient').length;

    return {
      latestFetchedAtUtc: latestFetchedAtUtcValue ?? '不明',
      totalCount: dataRows.length,
      successCount,
      failedCount,
      insufficientCount,
    };
  }, [dataRows]);

  const insufficientRows = useMemo(() => dataRows.filter((row) => row.status === 'insufficient'), [dataRows]);
  const insufficientSymbols = useMemo(() => insufficientRows.map((row) => row.symbol), [insufficientRows]);

  const refetchCommand = useMemo(() => {
    const days = calculateRequestedDays(insufficientRows);
    return buildRefetchCommand(insufficientSymbols, days);
  }, [insufficientRows, insufficientSymbols]);

  function prepareFetch(targetLabel: string, rows: DataManagementRow[]) {
    const symbols = rows.map((row) => row.symbol);
    const days = calculateRequestedDays(rows);
    setFetchPreparation({
      targetLabel,
      symbols,
      command: buildRefetchCommand(symbols, days),
      status: symbols.length > 0 ? '実行準備完了（未実行）' : '対象なしのため実行不可',
    });
  }

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
        <button onClick={() => setScreen('data-management')}>データ管理</button>
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
                  onChange={(event) => setInput({ ...input, [key]: event.target.checked })}
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

      {screen === 'data-management' && (
        <section className="card">
          <h2>データ管理</h2>
          <div className="registered-tickers">
            <h3>登録銘柄一覧</h3>
            <ul>
              {registeredTickers.map((ticker) => (
                <li key={ticker.symbol}>
                  {ticker.symbol} / {ticker.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="summary-grid">
            <p>最終更新: {dataSummary.latestFetchedAtUtc}</p>
            <p>対象数: {dataSummary.totalCount}</p>
            <p>成功: {dataSummary.successCount}</p>
            <p>失敗: {dataSummary.failedCount}</p>
            <p>不足: {dataSummary.insufficientCount}</p>
          </div>

          <div className="filters">
            <label>
              状態
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | DataRowStatus)}>
                <option value="all">すべて</option>
                <option value="ok">正常</option>
                <option value="insufficient">不足</option>
                <option value="failed">失敗</option>
              </select>
            </label>
            <label>
              銘柄検索（コード/名称）
              <input value={queryFilter} onChange={(event) => setQueryFilter(event.target.value)} placeholder="例: 8035 or 東京" />
            </label>
            <label>
              鮮度（最新日がX日以上前）
              <input
                type="number"
                min={0}
                step={1}
                value={staleDaysFilter}
                onChange={(event) => setStaleDaysFilter(Math.max(0, Math.trunc(Number(event.target.value) || 0)))}
              />
            </label>
            <label>
              不足度（不足日数がN日以上）
              <input
                type="number"
                min={0}
                step={1}
                value={missingDaysFilter}
                onChange={(event) => setMissingDaysFilter(Math.max(0, Math.trunc(Number(event.target.value) || 0)))}
              />
            </label>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>銘柄</th>
                <th>状態</th>
                <th>最新日</th>
                <th>鮮度(日)</th>
                <th>不足日数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>表示対象がありません。フィルタ条件を見直してください。</td>
                </tr>
              ) : (
                filteredDataRows.map((row) => (
                  <tr key={row.symbol}>
                    <td>{row.symbol} / {row.name}</td>
                    <td>{row.status === 'ok' ? '正常' : row.status === 'insufficient' ? '不足' : '失敗'}</td>
                    <td>{row.latestDate ?? '-'}</td>
                    <td>{row.staleDays ?? '-'}</td>
                    <td>{row.missingDays}</td>
                    <td>
                      <button type="button" onClick={() => prepareFetch(`銘柄: ${row.symbol}`, [row])}>
                        データ取得
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="fetch-actions">
            <button type="button" onClick={() => prepareFetch('不足銘柄一括', insufficientRows)}>
              不足銘柄を一括取得
            </button>
          </div>

          {fetchPreparation && (
            <div className="fetch-preparation">
              <h3>実行内容（準備）</h3>
              <p>対象: {fetchPreparation.targetLabel}</p>
              <p>銘柄: {fetchPreparation.symbols.length > 0 ? fetchPreparation.symbols.join(', ') : 'なし'}</p>
              <p>状態: {fetchPreparation.status}</p>
              <label>
                実行コマンド
                <textarea readOnly value={fetchPreparation.command} />
              </label>
            </div>
          )}

          <label>
            不足銘柄向け再取得コマンド
            <textarea readOnly value={refetchCommand} />
          </label>
        </section>
      )}
    </main>
  );
}
