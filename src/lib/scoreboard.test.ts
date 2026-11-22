import { describe, expect, it } from 'vitest';
import { SAMPLE_MATCH } from '@/lib/dev/samples';
import { compactScoreParts, scoreboardLabel } from '@/lib/scoreboard';

describe('compactScoreParts', () => {
  it('packs the short names, the score and the context', () => {
    expect(compactScoreParts(SAMPLE_MATCH)).toEqual({
      score: 'NGU 3–3 RSO',
      context: 'Continental Cup 2005',
    });
  });
});

describe('scoreboardLabel', () => {
  it('reads the score as words and names the XI', () => {
    expect(scoreboardLabel(SAMPLE_MATCH)).toBe(
      "Northgate United 3 to 3 Real Solvara. Continental Cup, 25 May 2005. You're naming Northgate United's starting XI",
    );
  });

  it('names the away XI when the away side is named', () => {
    expect(scoreboardLabel({ ...SAMPLE_MATCH, side: 'away' })).toContain(
      "naming Real Solvara's starting XI",
    );
  });
});
