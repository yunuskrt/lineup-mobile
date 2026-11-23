import { describe, expect, it } from 'vitest';
import {
  SOCKET_LOG_SIZE,
  socketEventSummary,
  socketStatusLabel,
  withEntry,
} from '@/lib/dev/socket-log';
import type { SocketLogEntry } from '@/types/socket-log';

function entry(id: number): SocketLogEntry {
  return { id, label: 'queued', summary: 'in the queue' };
}

describe('socketEventSummary', () => {
  it('names the opponent on a pairing', () => {
    expect(
      socketEventSummary('paired', {
        phase: 'paired',
        opponent: { id: 'a', handle: 'guest-abc', lives: 3 },
      }),
    ).toBe('against guest-abc');
  });

  it('reads a round by whose turn it is and both lives', () => {
    expect(
      socketEventSummary('roundStarted', {
        turn: 'you',
        you: { id: 'a', handle: 'm16-test', lives: 3 },
        opponent: { id: 'b', handle: 'guest-abc', lives: 2 },
      } as Parameters<typeof socketEventSummary<'roundStarted'>>[1]),
    ).toBe('turn yours, 3–2 lives');
  });

  it('rounds a queue timeout to whole seconds', () => {
    expect(
      socketEventSummary('queueTimedOut', {
        phase: 'queued',
        waitedMs: 60_003,
      }),
    ).toBe('no opponent after 60s');
  });

  it('says whose filters won, from your side', () => {
    const filters = {
      competitionIds: [],
      clubIds: [],
      era: { from: 2000, to: 2025 },
    };
    expect(
      socketEventSummary('coinFlip', {
        winner: 'opponent',
        filters,
        source: 'coin',
      }),
    ).toBe('theirs won (coin)');
  });

  it('reads a life lost and a revealed player plainly', () => {
    expect(socketEventSummary('lifeLost', { who: 'you', lives: 1 })).toBe(
      'yours, 1 left',
    );
    expect(
      socketEventSummary('playerRevealed', {
        id: 'p',
        slot: 3,
        name: 'Andrea Pirlo',
        imageUrl: null,
        position: 'MF',
        foundBy: 'opponent',
      } as Parameters<typeof socketEventSummary<'playerRevealed'>>[1]),
    ).toBe('Andrea Pirlo, theirs');
  });

  it('passes a verdict without a player through', () => {
    expect(socketEventSummary('guessResolved', { outcome: 'not_in_xi' })).toBe(
      'not_in_xi',
    );
  });

  it('marks a forfeit on the result', () => {
    expect(
      socketEventSummary('finished', {
        outcome: 'forfeit_win',
        isForfeit: true,
      } as Parameters<typeof socketEventSummary<'finished'>>[1]),
    ).toBe('forfeit_win, forfeit');
  });

  it('keeps the server error code and message', () => {
    expect(
      socketEventSummary('error', {
        code: 'forbidden',
        message: "You're connected somewhere else.",
        retryAfterMs: null,
      }),
    ).toBe("forbidden: You're connected somewhere else.");
  });
});

describe('withEntry', () => {
  it('puts the newest first', () => {
    expect(withEntry([entry(1)], entry(2)).map((e) => e.id)).toEqual([2, 1]);
  });

  it('keeps only the newest few', () => {
    const full = Array.from({ length: SOCKET_LOG_SIZE }, (_, i) => entry(i));
    const next = withEntry(full, entry(99));
    expect(next).toHaveLength(SOCKET_LOG_SIZE);
    expect(next[0].id).toBe(99);
  });
});

describe('socketStatusLabel', () => {
  it('shows a closed connection with its reason', () => {
    expect(
      socketStatusLabel({
        kind: 'closed',
        code: 'protocol_refused',
        message: 'This version of Lineup is out of date.',
      }),
    ).toBe('closed, protocol_refused: This version of Lineup is out of date.');
  });

  it('names every other state by its kind', () => {
    expect(socketStatusLabel({ kind: 'restored' })).toBe('restored');
  });
});
