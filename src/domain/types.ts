export type DangerLevel = 'low' | 'medium' | 'high';

export type DiagnosisInput = {
  tickerName: string;
  plannedAmount: string;
  isSurging: boolean;
  isFalling: boolean;
  isAveragingDown: boolean;
  isEarningsNear: boolean;
  influencedByBoard: boolean;
  revengeTrade: boolean;
  memo: string;
};

export type WarningItem = {
  code: string;
  message: string;
};

export type DiagnosisResult = {
  score: number;
  dangerLevel: DangerLevel;
  summaryMessage: string;
  warnings: WarningItem[];
};

export type DiagnosisHistoryItem = {
  input: DiagnosisInput;
  result: DiagnosisResult;
  createdAt: string;
};
