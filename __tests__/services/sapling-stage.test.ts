import { saplingStageFor, saplingVitality } from '@/services/sapling-stage';

describe('saplingStageFor', () => {
  it.each([
    [-5, 0],
    [0, 0],
    [1, 1],
    [6, 1],
    [7, 2],
    [13, 2],
    [14, 3],
    [20, 3],
    [21, 4],
    [29, 4],
    [30, 5],
    [39, 5],
    [40, 6],
    [99, 6],
  ])('day %i → stage %i', (day, expected) => {
    expect(saplingStageFor(day)).toBe(expected);
  });
});

describe('saplingVitality', () => {
  it('clamps to [0, 1]', () => {
    expect(saplingVitality(0)).toBe(0);
    expect(saplingVitality(50)).toBeCloseTo(0.5);
    expect(saplingVitality(100)).toBe(1);
    expect(saplingVitality(-10)).toBe(0);
    expect(saplingVitality(150)).toBe(1);
  });

  it('returns 0 for NaN', () => {
    expect(saplingVitality(Number.NaN)).toBe(0);
  });
});
