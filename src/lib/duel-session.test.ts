import { describe, expect, it } from 'vitest';
import { ROUND_MS } from '@/lib/api/schemas/common';
import {
  SAMPLE_FILTER_OPTIONS,
  SAMPLE_FILTERS,
  SAMPLE_IDENTITY,
  SAMPLE_MATCH,
  SAMPLE_OPPONENT,
  SAMPLE_YOU,
  samplePlayer,
} from '@/lib/dev/samples';
import {
  canGuess,
  canResume,
  DUEL_GATE_COPY,
  duelCanvasView,
  duelGateAction,
  duelSessionReducer,
  INITIAL_DUEL_SESSION,
  keepsJoinCode,
} from '@/lib/duel-session';
import { FEEDBACK_MESSAGES } from '@/lib/feedback';
import { RECONNECTING_TITLE } from '@/lib/system-states';
import type { ApiError } from '@/types/api';
import type {
  DuelActor,
  DuelFoundPlayer,
  DuelNamedPlayer,
  DuelResult,
  DuelSession,
} from '@/types/duel';
import type { DuelSessionEvent, DuelSessionState } from '@/types/duel-session';

// This repo's own: plain events as the server sends them, never a mock
const NOW = 1_700_000_000_000;
const DEADLINE = NOW + 20_000;
const ROOM_CODE = 'K7QM2X';

function apiError(code: ApiError['code'], message = 'Server said no.') {
  return { code, message, retryAfterMs: null } satisfies ApiError;
}

function found(finders: [number, DuelActor][]): DuelFoundPlayer[] {
  return finders.map(([slot, foundBy]) => ({
    ...samplePlayer(SAMPLE_MATCH.formation, slot),
    foundBy,
  }));
}

function named(finders: [number, DuelActor][]): DuelNamedPlayer[] {
  return found(finders).map((player, index) => ({
    ...player,
    order: index + 1,
    elapsedMs: 3_000,
  }));
}

function sessionOf(patch: Partial<DuelSession> = {}): DuelSession {
  return {
    sessionId: 'duel-1',
    match: SAMPLE_MATCH,
    you: { ...SAMPLE_YOU, lives: 3 },
    opponent: SAMPLE_OPPONENT,
    turn: 'you',
    round: { startedAt: NOW, endsAt: NOW + ROUND_MS },
    found: [],
    ...patch,
  };
}

function resultOf(
  outcome: DuelResult['outcome'],
  isForfeit = false,
): DuelResult {
  return {
    outcome,
    match: SAMPLE_IDENTITY,
    found: named([
      [0, 'you'],
      [4, 'opponent'],
    ]),
    you: { ...SAMPLE_YOU, lives: outcome === 'loss' ? 0 : 2 },
    opponent: { ...SAMPLE_OPPONENT, lives: outcome === 'win' ? 0 : 1 },
    isForfeit,
  };
}

function run(
  events: DuelSessionEvent[],
  from: DuelSessionState = INITIAL_DUEL_SESSION,
): DuelSessionState {
  return events.reduce(duelSessionReducer, from);
}

function viewOf(state: DuelSessionState) {
  return duelCanvasView(state, SAMPLE_YOU);
}

const PREPARED: DuelSessionEvent = {
  type: 'prepared',
  filters: SAMPLE_FILTERS,
  options: SAMPLE_FILTER_OPTIONS,
  isPrivate: false,
};

const LOBBY: DuelSessionEvent[] = [
  PREPARED,
  { type: 'queued' },
  { type: 'paired', opponent: SAMPLE_OPPONENT },
  { type: 'filtersOpened' },
];

const COIN_FLIP: DuelSessionEvent = {
  type: 'coinFlip',
  result: { winner: 'opponent', filters: SAMPLE_FILTERS, source: 'coin' },
};

function playing(turn: DuelActor = 'you'): DuelSessionState {
  return run([
    ...LOBBY,
    COIN_FLIP,
    { type: 'matchReady', session: sessionOf({ turn }) },
  ]);
}

describe('duelSessionReducer, the lobby path', () => {
  it('searches once queued, with no gate action', () => {
    const state = run([PREPARED, { type: 'queued' }]);
    expect(state.phase).toBe('searching');
    expect(state.filters).toEqual(SAMPLE_FILTERS);
    expect(viewOf(state).lobby).toEqual({ step: 'searching' });
    expect(duelGateAction(state)).toBeNull();
  });

  it('holds both handles once paired, then opens the filters', () => {
    const paired = run(LOBBY.slice(0, 3));
    expect(viewOf(paired).lobby).toEqual({
      step: 'paired',
      opponent: SAMPLE_OPPONENT,
    });
    expect(viewOf(run(LOBBY)).lobby?.step).toBe('filters');
  });

  it('locks, then shows both submissions as the server reports them', () => {
    const locking = run([...LOBBY, { type: 'locking' }]);
    expect(locking.isLocking).toBe(true);
    const locked = run(
      [
        {
          type: 'filtersUpdated',
          submission: { yours: 'submitted', theirs: 'pending' },
        },
      ],
      locking,
    );
    expect(locked.isLocking).toBe(false);
    const lobby = viewOf(locked).lobby;
    expect(lobby?.step === 'filters' && lobby.submission.yours).toBe(
      'submitted',
    );
  });

  it('names whose filters won at the coin flip', () => {
    const lobby = viewOf(run([...LOBBY, COIN_FLIP])).lobby;
    expect(lobby?.step).toBe('coinFlip');
    expect(lobby?.step === 'coinFlip' && lobby.winner).toBe('opponent');
  });

  it("marks a room's flip private", () => {
    const state = run([
      ...LOBBY,
      {
        type: 'coinFlip',
        result: { winner: 'you', filters: SAMPLE_FILTERS, source: 'room' },
      },
    ]);
    expect(state.isPrivate).toBe(true);
  });

  it('plays once the match is ready: no gate, the input live', () => {
    const state = playing();
    const view = viewOf(state);
    expect(state.phase).toBe('playing');
    expect(state.opponent).toEqual(SAMPLE_OPPONENT);
    expect(view.lobby).toBeNull();
    expect(view.gate).toBeNull();
    expect(view.match).toEqual(SAMPLE_MATCH);
    expect(view.turn).toBe('you');
    expect(view.input).toBe('live');
  });

  it('offers solo when the queue times out', () => {
    const state = run([
      PREPARED,
      { type: 'queued' },
      { type: 'queueTimedOut' },
    ]);
    expect(viewOf(state).lobby).toEqual({ step: 'noOpponent' });
  });

  it('waits in a room, which expires only while hosting', () => {
    const room = { code: ROOM_CODE, filters: SAMPLE_FILTERS, expiresAt: NOW };
    const hosting = run([PREPARED, { type: 'roomCreated', room }]);
    const lobby = viewOf(hosting).lobby;
    expect(lobby?.step === 'roomWaiting' && lobby.code).toBe(ROOM_CODE);
    expect(run([{ type: 'roomExpired' }], hosting).phase).toBe('roomExpired');
    expect(run([{ type: 'roomExpired' }], playing()).phase).toBe('playing');
  });

  it('shows the code it is joining', () => {
    const state = run([{ type: 'joining', code: ROOM_CODE }]);
    expect(viewOf(state).lobby).toEqual({ step: 'joining', code: ROOM_CODE });
  });
});

describe('duelSessionReducer, a round', () => {
  it('takes the turn and the lives from each session the server sends', () => {
    const session = sessionOf({
      turn: 'opponent',
      you: { ...SAMPLE_YOU, lives: 1 },
      found: found([[0, 'you']]),
    });
    const view = viewOf(run([{ type: 'turnChanged', session }], playing()));
    expect(view.turn).toBe('opponent');
    expect(view.you.lives).toBe(1);
    expect(view.found).toHaveLength(1);
    expect(view.input).toBe('locked');
  });

  it('shows a guess pending until the verdict', () => {
    const state = run([{ type: 'guessSubmitted' }], playing());
    expect(viewOf(state).input).toBe('pending');
    expect(canGuess(state)).toBe(false);
  });

  it('clears the input on a new player, with no toast', () => {
    const before = run([{ type: 'guessSubmitted' }], playing());
    const state = run(
      [
        {
          type: 'guessResolved',
          result: {
            outcome: 'correct_new',
            player: samplePlayer(SAMPLE_MATCH.formation, 2),
          },
        },
      ],
      before,
    );
    expect(state.isGuessing).toBe(false);
    expect(state.clearKey).toBe(before.clearKey + 1);
    expect(state.toast).toBeNull();
  });

  it('pulses the slot and clears the input when already named', () => {
    const player = samplePlayer(SAMPLE_MATCH.formation, 0);
    const state = run(
      [
        {
          type: 'guessResolved',
          result: { outcome: 'already_found', playerId: player.id },
        },
      ],
      playing(),
    );
    expect(state.toast?.message).toBe(FEEDBACK_MESSAGES.alreadyFound);
    expect(state.pulse?.playerId).toBe(player.id);
    expect(state.clearKey).toBe(1);
  });

  it('shakes and keeps the text when not in the XI', () => {
    const state = run(
      [{ type: 'guessResolved', result: { outcome: 'not_in_xi' } }],
      playing(),
    );
    expect(state.toast?.message).toBe(FEEDBACK_MESSAGES.notInXi);
    expect(state.shakeKey).toBe(1);
    expect(state.clearKey).toBe(0);
  });

  it('flashes only for your own life lost', () => {
    const yours = run(
      [{ type: 'lifeLost', cue: { who: 'you', lives: 2 } }],
      playing(),
    );
    const theirs = run(
      [{ type: 'lifeLost', cue: { who: 'opponent', lives: 2 } }],
      playing(),
    );
    expect(yours.lifeLostKey).toBe(1);
    expect(theirs.lifeLostKey).toBe(0);
  });

  it('ends a guess in flight at the handover', () => {
    const state = run(
      [
        { type: 'guessSubmitted' },
        { type: 'turnChanged', session: sessionOf({ turn: 'opponent' }) },
      ],
      playing(),
    );
    expect(state.isGuessing).toBe(false);
  });

  it('locks the input through a rate limit, and toasts other refusals', () => {
    const limited = run(
      [
        {
          type: 'guessFailed',
          error: { ...apiError('rate_limited'), retryAfterMs: 2_000 },
          at: NOW,
        },
      ],
      playing(),
    );
    expect(viewOf(limited).input).toBe('cooldown');
    const refused = run(
      [{ type: 'guessFailed', error: apiError('forbidden'), at: NOW }],
      playing(),
    );
    expect(refused.toast).not.toBeNull();
    expect(viewOf(refused).input).toBe('live');
  });
});

describe('duelSessionReducer, your drop', () => {
  const dropped = () =>
    run([{ type: 'connectionDropped', deadline: DEADLINE }], playing());

  it('gates the board with a countdown to the forfeit, input locked', () => {
    const state = dropped();
    const view = viewOf(state);
    expect(view.gate?.title).toBe(RECONNECTING_TITLE);
    expect(view.gate?.notice).toBe('connection');
    expect(view.gate?.countdown?.deadline).toBe(DEADLINE);
    expect(view.yourConnection?.reconnectDeadline).toBe(DEADLINE);
    expect(view.input).toBe('locked');
    expect(canGuess(state)).toBe(false);
  });

  it("clears on return once the server's snapshot arrives", () => {
    const back = run([{ type: 'connectionRestored' }], dropped());
    expect(back.resume).toBe('waiting');
    expect(viewOf(back).gate?.title).toBe(RECONNECTING_TITLE);

    const snapshot = sessionOf({
      turn: 'opponent',
      you: { ...SAMPLE_YOU, lives: 2 },
    });
    const state = run([{ type: 'matchReady', session: snapshot }], back);
    const view = viewOf(state);
    expect(state.resume).toBeNull();
    expect(view.gate).toBeNull();
    expect(view.turn).toBe('opponent');
    expect(view.you.lives).toBe(2);
  });

  it('keeps the gate across a handover while the clock runs on', () => {
    const theirTurn = sessionOf({ turn: 'opponent' });
    const state = run(
      [
        { type: 'lifeLost', cue: { who: 'you', lives: 2 } },
        { type: 'turnChanged', session: theirTurn },
      ],
      dropped(),
    );
    const view = viewOf(state);
    expect(view.gate?.title).toBe(RECONNECTING_TITLE);
    expect(view.turn).toBe('opponent');
    expect(view.clock.round).toEqual(theirTurn.round);
  });

  it('stays gated and locked between the forfeit and the result', () => {
    const state = run(
      [
        {
          type: 'disconnected',
          connection: { status: 'forfeited', reconnectDeadline: null },
        },
      ],
      dropped(),
    );
    expect(state.phase).toBe('playing');
    expect(viewOf(state).gate?.title).toBe(RECONNECTING_TITLE);
    expect(viewOf(state).input).toBe('locked');
  });

  it('takes the server saying you reconnect, then you are back', () => {
    const away = run(
      [
        {
          type: 'disconnected',
          connection: { status: 'reconnecting', reconnectDeadline: DEADLINE },
        },
      ],
      playing(),
    );
    expect(viewOf(away).gate?.title).toBe(RECONNECTING_TITLE);
    const back = run(
      [
        {
          type: 'disconnected',
          connection: { status: 'connected', reconnectDeadline: null },
        },
      ],
      away,
    );
    expect(back.yourConnection).toBeNull();
  });

  it('ignores a drop outside a match', () => {
    const searching = run([PREPARED, { type: 'queued' }]);
    const state = run(
      [{ type: 'connectionDropped', deadline: DEADLINE }],
      searching,
    );
    expect(state.yourConnection).toBeNull();
  });
});

describe('duelSessionReducer, the opponent drops', () => {
  it('shows their countdown, then clears it on their return', () => {
    const away = run(
      [
        {
          type: 'opponentConnection',
          connection: { status: 'reconnecting', reconnectDeadline: DEADLINE },
        },
      ],
      playing('opponent'),
    );
    expect(viewOf(away).opponentConnection?.reconnectDeadline).toBe(DEADLINE);
    // Their clock runs on: the board stays, with no gate
    expect(viewOf(away).gate).toBeNull();

    const back = run(
      [
        {
          type: 'opponentConnection',
          connection: { status: 'connected', reconnectDeadline: null },
        },
      ],
      away,
    );
    expect(viewOf(back).opponentConnection).toBeNull();
  });

  it('ends on their forfeit with the chip gone', () => {
    const state = run(
      [
        {
          type: 'opponentConnection',
          connection: { status: 'reconnecting', reconnectDeadline: DEADLINE },
        },
        { type: 'finished', result: resultOf('forfeit_win', true) },
      ],
      playing(),
    );
    const view = viewOf(state);
    expect(view.end?.outcome).toBe('forfeit_win');
    expect(view.opponentConnection).toBeNull();
  });
});

describe('duelSessionReducer, away too long', () => {
  const closed = () =>
    run(
      [
        { type: 'connectionDropped', deadline: DEADLINE },
        { type: 'closed', error: apiError('server_error'), at: NOW },
      ],
      playing(),
    );

  it('closes to a gate with Try again, which rejoins the duel', () => {
    const state = closed();
    const view = viewOf(state);
    expect(state.phase).toBe('failed');
    expect(view.gate?.title).toBe('Duel connection closed');
    expect(view.gate?.actionLabel).toBe(DUEL_GATE_COPY.tryAgain);
    expect(duelGateAction(state)).toBe('retry');
    expect(canResume(state)).toBe(true);
  });

  it('says the duel ended while you were away, then checks history', () => {
    const state = run(
      [
        { type: 'resuming' },
        { type: 'connectionRestored' },
        { type: 'resumeMissed' },
      ],
      closed(),
    );
    const view = viewOf(state);
    expect(state.phase).toBe('endedAway');
    expect(view.gate?.title).toBe(DUEL_GATE_COPY.away);
    expect(view.gate?.detail).toBe(DUEL_GATE_COPY.awayChecking);
    expect(view.gate?.actionLabel).toBeUndefined();
    expect(view.turn).toBeNull();
    expect(view.clock.round).toBeNull();
    expect(duelGateAction(state)).toBeNull();
  });

  it('reads the result from history, with Play again and View profile', () => {
    const state = run(
      [
        { type: 'resuming' },
        { type: 'connectionRestored' },
        { type: 'resumeMissed' },
        {
          type: 'awayResultRead',
          result: { status: 'found', outcome: 'loss', foundCount: 3 },
        },
      ],
      closed(),
    );
    const gate = viewOf(state).gate;
    expect(gate?.detail).toBe('You lost. 3 of 11 named.');
    expect(gate?.actionLabel).toBe(DUEL_GATE_COPY.playAgain);
    expect(gate?.secondaryActionLabel).toBe(DUEL_GATE_COPY.viewProfile);
    expect(duelGateAction(state)).toBe('playAgain');
  });

  it('says so when history has no result', () => {
    const state = run(
      [
        { type: 'resuming' },
        { type: 'connectionRestored' },
        { type: 'resumeMissed' },
        { type: 'awayResultRead', result: { status: 'unknown' } },
      ],
      closed(),
    );
    expect(viewOf(state).gate?.detail).toBe(DUEL_GATE_COPY.awayUnknown);
  });

  it('keeps playing when the snapshot does arrive', () => {
    const state = run(
      [
        { type: 'resuming' },
        { type: 'connectionRestored' },
        { type: 'matchReady', session: sessionOf() },
        { type: 'resumeMissed' },
      ],
      closed(),
    );
    expect(state.phase).toBe('playing');
    expect(viewOf(state).gate).toBeNull();
  });
});

describe('duelSessionReducer, drops in the lobby', () => {
  it('rejoins the queue after a drop while searching', () => {
    const state = run([
      PREPARED,
      { type: 'queued' },
      { type: 'connectionRestored' },
    ]);
    expect(state.phase).toBe('searching');
    expect(state.isRequeueing).toBe(true);
  });

  it('calls the match off after a drop during the filters', () => {
    const state = run([...LOBBY, { type: 'connectionRestored' }]);
    const gate = viewOf(state).gate;
    expect(gate?.title).toBe(DUEL_GATE_COPY.calledOff);
    expect(gate?.actionLabel).toBe(DUEL_GATE_COPY.searchAgain);
  });

  it('offers a new room when a room match is called off', () => {
    const state = run([
      { ...PREPARED, isPrivate: true },
      { type: 'joining', code: ROOM_CODE },
      { type: 'paired', opponent: SAMPLE_OPPONENT },
      { type: 'connectionRestored' },
    ]);
    expect(viewOf(state).gate?.actionLabel).toBe(DUEL_GATE_COPY.newRoom);
  });

  it("closes the host's room after a drop", () => {
    const room = { code: ROOM_CODE, filters: SAMPLE_FILTERS, expiresAt: NOW };
    const state = run([
      PREPARED,
      { type: 'roomCreated', room },
      { type: 'connectionRestored' },
    ]);
    expect(viewOf(state).gate?.title).toBe(DUEL_GATE_COPY.roomClosed);
  });
});

describe('duelSessionReducer, endings', () => {
  it.each(['win', 'loss', 'draw', 'forfeit_win'] as const)(
    'renders a %s as it arrives, with no clock or turn',
    (outcome) => {
      const state = run(
        [{ type: 'finished', result: resultOf(outcome) }],
        playing(),
      );
      const view = viewOf(state);
      expect(state.phase).toBe('finished');
      expect(view.end?.outcome).toBe(outcome);
      expect(view.turn).toBeNull();
      expect(view.clock.round).toBeNull();
      expect(view.gate).toBeNull();
      expect(view.found).toEqual(state.result?.found);
    },
  );

  it('keeps the first result', () => {
    const state = run(
      [
        { type: 'finished', result: resultOf('win') },
        { type: 'finished', result: resultOf('loss') },
      ],
      playing(),
    );
    expect(state.result?.outcome).toBe('win');
  });

  it('marks your own forfeit as leaving, not a lost connection', () => {
    const state = run(
      [
        { type: 'forfeiting' },
        { type: 'finished', result: resultOf('loss', true) },
      ],
      playing(),
    );
    expect(viewOf(state).endReason).toBeUndefined();
  });

  it('marks a forfeit after a drop as a lost connection', () => {
    const state = run(
      [
        { type: 'connectionDropped', deadline: DEADLINE },
        { type: 'finished', result: resultOf('loss', true) },
      ],
      playing(),
    );
    expect(viewOf(state).endReason).toBe('connectionLost');
    expect(viewOf(state).yourConnection).toBeNull();
  });

  it('keeps the connection-lost mark once the server says forfeited', () => {
    const state = run(
      [
        {
          type: 'disconnected',
          connection: { status: 'forfeited', reconnectDeadline: null },
        },
        { type: 'finished', result: resultOf('loss', true) },
      ],
      playing(),
    );
    expect(viewOf(state).endReason).toBe('connectionLost');
  });

  it('never marks a result you did not forfeit', () => {
    const state = run(
      [
        { type: 'connectionDropped', deadline: DEADLINE },
        { type: 'finished', result: resultOf('win') },
      ],
      playing(),
    );
    expect(viewOf(state).endReason).toBeUndefined();
  });

  it('starts the next duel without the lost connection', () => {
    const lost = run(
      [
        {
          type: 'disconnected',
          connection: { status: 'forfeited', reconnectDeadline: null },
        },
        { type: 'finished', result: resultOf('loss', true) },
      ],
      playing(),
    );
    const next = run([{ type: 'started' }], lost);
    expect(next.isConnectionLost).toBe(false);
    expect(next.result).toBeNull();
    expect(next.filters).toEqual(SAMPLE_FILTERS);
  });

  it('keeps the result card when the socket closes afterwards', () => {
    const state = run(
      [
        { type: 'finished', result: resultOf('win') },
        { type: 'closed', error: apiError('server_error'), at: NOW },
      ],
      playing(),
    );
    expect(state.phase).toBe('finished');
    expect(viewOf(state).gate).toBeNull();
  });
});

describe('duelSessionReducer, refusals', () => {
  it('holds an old build on connect', () => {
    const state = run([
      {
        type: 'failed',
        step: 'connect',
        error: apiError('protocol_refused'),
        at: NOW,
      },
    ]);
    expect(state.phase).toBe('refused');
  });

  it('holds an old build when the socket closes on it', () => {
    const state = run(
      [{ type: 'closed', error: apiError('protocol_refused'), at: NOW }],
      playing(),
    );
    expect(state.phase).toBe('refused');
  });

  it('keeps a refused code for the box on /play', () => {
    const state = run([
      { type: 'joining', code: ROOM_CODE },
      {
        type: 'failed',
        step: 'joinRoom',
        error: apiError('not_found'),
        at: NOW,
      },
    ]);
    expect(keepsJoinCode(state)).toBe(true);
    expect(viewOf(state).gate?.notice).toBe('refused');
    expect(duelGateAction(state)).toBe('leave');
  });

  it('lets a resumed duel answer before a resent queue fails', () => {
    const state = run(
      [
        {
          type: 'failed',
          step: 'queue',
          error: apiError('forbidden'),
          at: NOW,
        },
      ],
      playing(),
    );
    expect(state.phase).toBe('playing');
  });
});
