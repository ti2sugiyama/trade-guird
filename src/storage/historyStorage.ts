import type { DiagnosisHistoryItem } from '../domain/types';

const STORAGE_KEY = 'trade-helper-history-v1';

export function loadHistory(): DiagnosisHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: DiagnosisHistoryItem): void {
  const current = loadHistory();
  const next = [item, ...current].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
