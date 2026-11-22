import { matchDateLabel } from '@/lib/summary';
import type { MatchInPlay } from '@/types/match';

// The match year, from the ISO date the backend sends
function matchYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

// The one-line strip: "NGU 3–3 RSO" and "Continental Cup 2005"
export function compactScoreParts(match: MatchInPlay): {
  score: string;
  context: string;
} {
  return {
    score: `${match.home.shortName} ${match.score.home}–${match.score.away} ${match.away.shortName}`,
    context: `${match.competition.name} ${matchYear(match.date)}`,
  };
}

// What a screen reader says for either layout: "3 to 3", in full
export function scoreboardLabel(match: MatchInPlay): string {
  const named = match[match.side].name;
  return [
    `${match.home.name} ${match.score.home} to ${match.score.away} ${match.away.name}`,
    `${match.competition.name}, ${matchDateLabel(match.date)}`,
    `You're naming ${named}'s starting XI`,
  ].join('. ');
}
