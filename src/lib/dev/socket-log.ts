import type { DuelEvent, DuelEventMap } from '@/lib/api/duel-client';
import { scoreline } from '@/lib/summary';
import type { SocketLogEntry, SocketStatus } from '@/types/socket-log';

// /dev/socket keeps the newest few
export const SOCKET_LOG_SIZE = 20;

type Summaries = {
  [E in DuelEvent]: (payload: DuelEventMap[E]) => string;
};

function whose(actor: 'you' | 'opponent'): string {
  return actor === 'you' ? 'yours' : 'theirs';
}

// One line each: what the server said, never a raw payload
const SUMMARIES: Summaries = {
  queued: () => 'in the queue',
  queueTimedOut: (p) => `no opponent after ${Math.round(p.waitedMs / 1000)}s`,
  roomCreated: (p) => `room ${p.code}`,
  roomExpired: (p) => `room ${p.code} expired`,
  paired: (p) => `against ${p.opponent.handle}`,
  filtersUpdated: (p) => `yours ${p.yours}, theirs ${p.theirs}`,
  coinFlip: (p) => `${whose(p.winner)} won (${p.source})`,
  matchReady: (p) => `${scoreline(p.match)}, turn ${whose(p.turn)}`,
  roundStarted: (p) =>
    `turn ${whose(p.turn)}, ${p.you.lives}–${p.opponent.lives} lives`,
  guessResolved: (p) =>
    p.outcome === 'correct_new' ? `correct: ${p.player.name}` : p.outcome,
  playerRevealed: (p) => `${p.name}, ${whose(p.foundBy)}`,
  lifeLost: (p) => `${whose(p.who)}, ${p.lives} left`,
  turnChanged: (p) => `turn ${whose(p.turn)}`,
  opponentConnection: (p) => p.status,
  finished: (p) => `${p.outcome}${p.isForfeit ? ', forfeit' : ''}`,
  disconnected: (p) => p.status,
  error: (p) => `${p.code}: ${p.message}`,
};

export function socketEventSummary<E extends DuelEvent>(
  event: E,
  payload: DuelEventMap[E],
): string {
  return SUMMARIES[event](payload);
}

// Newest first, capped
export function withEntry(
  log: SocketLogEntry[],
  entry: SocketLogEntry,
): SocketLogEntry[] {
  return [entry, ...log].slice(0, SOCKET_LOG_SIZE);
}

export function socketStatusLabel(status: SocketStatus): string {
  return status.kind === 'closed'
    ? `closed, ${status.code}: ${status.message}`
    : status.kind;
}
