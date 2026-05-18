import { habitSuggestions } from '@/data/habit-suggestions';
import { emojiOptions, identityExamples } from '@/data/identity-examples';

describe('habitSuggestions', () => {
  it('has at least 8 entries', () => {
    expect(habitSuggestions.length).toBeGreaterThanOrEqual(8);
  });

  it('every suggestion has required fields', () => {
    for (const s of habitSuggestions) {
      expect(s.emoji).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.identity).toBeTruthy();
      expect(s.whyExample).toBeTruthy();
      expect(s.minimalExample).toBeTruthy();
    }
  });

  it('names are unique', () => {
    const names = habitSuggestions.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('identityExamples', () => {
  it('has at least 5 examples', () => {
    expect(identityExamples.length).toBeGreaterThanOrEqual(5);
  });

  it('every example ends with "inson"', () => {
    for (const e of identityExamples) {
      expect(e).toMatch(/inson$/);
    }
  });
});

describe('emojiOptions', () => {
  it('has at least 20 emojis', () => {
    expect(emojiOptions.length).toBeGreaterThanOrEqual(20);
  });

  it('every emoji is non-empty', () => {
    for (const e of emojiOptions) {
      expect(e.length).toBeGreaterThan(0);
    }
  });
});
