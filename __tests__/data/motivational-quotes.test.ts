import { pickQuoteForDay, quotes } from '@/data/motivational-quotes';

describe('motivationalQuotes', () => {
  it('has at least 30 quotes', () => {
    expect(quotes.length).toBeGreaterThanOrEqual(30);
  });

  it('every quote has non-empty text', () => {
    for (const q of quotes) {
      expect(typeof q.text).toBe('string');
      expect(q.text.length).toBeGreaterThan(0);
    }
  });

  it('every quote has a source link', () => {
    for (const q of quotes) {
      expect(q.sourceTitle.length).toBeGreaterThan(0);
      expect(q.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  describe('pickQuoteForDay', () => {
    it('returns a quote', () => {
      const q = pickQuoteForDay('2026-05-18');
      expect(q.text).toBeTruthy();
    });

    it('is deterministic for the same date', () => {
      const a = pickQuoteForDay('2026-05-18');
      const b = pickQuoteForDay('2026-05-18');
      expect(a).toEqual(b);
    });

    it('changes across consecutive days (probabilistic spot check)', () => {
      // Across 30 consecutive days expect at least 5 distinct quotes
      const seen = new Set<string>();
      const base = new Date(2026, 0, 1);
      for (let i = 0; i < 30; i++) {
        const d = new Date(base);
        d.setDate(d.getDate() + i);
        const key = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
        seen.add(pickQuoteForDay(key).text);
      }
      expect(seen.size).toBeGreaterThanOrEqual(5);
    });

    it('hash never goes out of bounds', () => {
      for (let i = 0; i < 100; i++) {
        const key = `2026-01-${`${(i % 28) + 1}`.padStart(2, '0')}`;
        const q = pickQuoteForDay(key);
        expect(q).toBeDefined();
        expect(q.text).toBeTruthy();
      }
    });
  });
});
