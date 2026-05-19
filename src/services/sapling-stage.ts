export type SaplingStage = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const SAPLING_STAGE_COUNT = 7;

export function saplingStageFor(currentDay: number): SaplingStage {
  if (currentDay < 1) return 0;
  if (currentDay < 7) return 1;
  if (currentDay < 14) return 2;
  if (currentDay < 21) return 3;
  if (currentDay < 30) return 4;
  if (currentDay < 40) return 5;
  return 6;
}

export function saplingVitality(completionRate: number): number {
  if (Number.isNaN(completionRate)) return 0;
  return Math.max(0, Math.min(1, completionRate / 100));
}
