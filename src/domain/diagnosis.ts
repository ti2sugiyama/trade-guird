import type { DangerLevel, DiagnosisInput, DiagnosisResult, WarningItem } from './types';

type MarketPriceRow = {
  symbol: string;
  date: string;
  close: number;
  volume: number;
};

type MarketDiagnosisParams = {
  csvText: string;
  tickerName: string;
  plannedShares: number;
  memo: string;
};

export function buildDiagnosisInputFromMarketCsv(params: MarketDiagnosisParams): DiagnosisInput {
  const ticker = params.tickerName.trim();
  if (!ticker) {
    throw new Error('実データ診断には銘柄コードの入力が必要です。');
  }

  const rows = parseMarketCsv(params.csvText).filter((row) => row.symbol === ticker);
  if (rows.length === 0) {
    throw new Error(`実データ診断不可: ${ticker} の価格データが見つかりません。`);
  }

  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) {
    throw new Error(`実データ診断不可: ${ticker} の比較用データが不足しています。`);
  }

  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const priceChangeRate = (latest.close - previous.close) / previous.close;
  const volumeChangeRate = previous.volume > 0 ? (latest.volume - previous.volume) / previous.volume : 0;

  return {
    tickerName: ticker,
    plannedShares: Math.max(0, Math.trunc(params.plannedShares)),
    isSurging: priceChangeRate >= 0.05,
    isFalling: priceChangeRate <= -0.03,
    isAveragingDown: priceChangeRate <= -0.05,
    isEarningsNear: false,
    influencedByBoard: volumeChangeRate >= 1.0,
    revengeTrade: false,
    memo: params.memo,
  };
}

function parseMarketCsv(csvText: string): MarketPriceRow[] {
  const lines = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const rows: MarketPriceRow[] = [];
  for (const line of lines.slice(1)) {
    const columns = line.split(',');
    if (columns.length < 7) continue;

    const close = Number(columns[5]);
    const volume = Number(columns[6]);
    if (!Number.isFinite(close) || !Number.isFinite(volume)) continue;

    rows.push({
      symbol: columns[0],
      date: columns[1],
      close,
      volume,
    });
  }

  return rows;
}

function toDangerLevel(score: number): DangerLevel {
  if (score >= 70) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

function summaryFor(level: DangerLevel): string {
  switch (level) {
    case 'high':
      return '危険サインが強いです。今日は買わずに一晩置くことを強く推奨します。';
    case 'medium':
      return 'いくつかの危険サインがあります。購入理由と撤退条件を整理してから再検討してください。';
    case 'low':
      return '重大な危険サインは少なめです。ただし購入理由は必ず明文化してください。';
  }
}

export function evaluateDiagnosis(input: DiagnosisInput): DiagnosisResult {
  let score = 0;
  const warnings: WarningItem[] = [];

  if (input.isSurging) {
    score += 25;
    warnings.push({
      code: 'surging',
      message: '急騰中の銘柄への飛びつき買いは、高値掴みになりやすいです。',
    });
  }

  if (input.isFalling) {
    score += 15;
    warnings.push({
      code: 'falling',
      message: '下落中の銘柄を「安い」とだけ見て買うと、さらに下がる可能性があります。',
    });
  }

  if (input.isAveragingDown) {
    score += 30;
    warnings.push({
      code: 'averaging-down',
      message: 'ナンピンは損失拡大につながりやすいため、理由と上限を明確にしてください。',
    });
  }

  if (input.isEarningsNear) {
    score += 25;
    warnings.push({
      code: 'earnings',
      message: '決算前後の売買は値動きが大きく、ギャンブル化しやすいです。',
    });
  }

  if (input.influencedByBoard) {
    score += 20;
    warnings.push({
      code: 'board',
      message: '掲示板の雰囲気に影響された買いは、冷静な判断を失いやすいです。',
    });
  }

  if (input.revengeTrade) {
    score += 30;
    warnings.push({
      code: 'revenge',
      message: '損を取り返したい気持ちが強い時は、一発逆転狙いになりがちです。',
    });
  }

  const dangerLevel = toDangerLevel(score);

  return {
    score,
    dangerLevel,
    summaryMessage: summaryFor(dangerLevel),
    warnings,
  };
}
