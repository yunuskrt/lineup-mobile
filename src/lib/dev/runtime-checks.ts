import { archiveDateLabel, archiveTotalLine } from '@/lib/archive';
import { withoutParams, withQuery } from '@/lib/filters';
import { formatCount } from '@/lib/landing';
import { normalizeName } from '@/lib/normalize';
import { modeOptionFrom } from '@/lib/play-steps';
import { isRoomCode, joinCodeFrom, roomLink, withRoom } from '@/lib/room-code';
import { resetTimeOf } from '@/lib/solo-allowance';
import { buildSuggestionIndex, suggest } from '@/lib/suggestions';
import { matchDateLabel } from '@/lib/summary';
import type { DirectoryPlayer } from '@/types/catalog';
import type { RuntimeCheck, RuntimeResult } from '@/types/runtime-check';

// A throw is a failure too: Hermes may lack the API
export function runCheck({
  label,
  expected,
  run,
}: RuntimeCheck): RuntimeResult {
  try {
    const actual = run();
    return { label, expected, actual, ok: actual === expected };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { label, expected, actual: `threw: ${message}`, ok: false };
  }
}

const SILVAS: DirectoryPlayer[] = [
  {
    key: 'aaaaaaaaaaaaaaaaaaaaa1',
    name: 'Thiago Silva',
    imageUrl: null,
    terms: ['silva'],
  },
  {
    key: 'aaaaaaaaaaaaaaaaaaaaa2',
    name: 'Édouard Silva',
    imageUrl: null,
    terms: ['silva'],
  },
  {
    key: 'aaaaaaaaaaaaaaaaaaaaa3',
    name: 'David Silva',
    imageUrl: null,
    terms: ['silva'],
  },
];

// The copied helpers that lean on URL, URLSearchParams, Intl and Zod
export const RUNTIME_CHECKS: readonly RuntimeCheck[] = [
  {
    label: 'URLSearchParams get: joinCodeFrom',
    expected: 'K7QM2X',
    run: () => joinCodeFrom(new URLSearchParams('room=k7qm2x')),
  },
  {
    label: 'URLSearchParams set, toString: withRoom',
    expected: '/play/duel?mode=duel&room=K7QM2X',
    run: () =>
      withQuery(
        '/play/duel',
        withRoom(new URLSearchParams('mode=duel'), 'K7QM2X'),
      ),
  },
  {
    label: 'URLSearchParams delete: withoutParams',
    expected: 'a=1&c=4',
    run: () =>
      withoutParams(new URLSearchParams('a=1&b=2&b=3&c=4'), ['b']).toString(),
  },
  {
    label: 'URLSearchParams in play-steps: modeOptionFrom',
    expected: 'practice',
    run: () => String(modeOptionFrom(new URLSearchParams('practice=1'))),
  },
  {
    label: 'URL parse: roomLink',
    expected: '/play/duel K7QM2X',
    run: () => {
      const url = new URL(roomLink('https://app.lineup.gg', 'K7QM2X'));
      return `${url.pathname} ${url.searchParams.get('room')}`;
    },
  },
  {
    label: 'Intl.DateTimeFormat en-GB short: archiveDateLabel',
    expected: '3 Nov 2005',
    run: () => archiveDateLabel('2005-11-03'),
  },
  {
    label: 'Intl.DateTimeFormat en-GB long: matchDateLabel',
    expected: '13 September 2006',
    run: () => matchDateLabel('2006-09-13'),
  },
  {
    label: 'Intl.DateTimeFormat time zone: resetTimeOf',
    expected: '03:00',
    run: () => resetTimeOf(Date.UTC(2026, 0, 1), 'Europe/Istanbul'),
  },
  {
    label: 'Intl.NumberFormat en-GB: archiveTotalLine',
    expected: '12,345 matches. Search by club, competition or season.',
    run: () => archiveTotalLine(12345),
  },
  {
    label: 'Intl.NumberFormat en: formatCount',
    expected: '1,234,567',
    run: () => formatCount(1234567),
  },
  {
    label: 'Intl.Collator en: suggest order',
    expected: 'David Silva, Édouard Silva, Thiago Silva',
    run: () =>
      suggest(buildSuggestionIndex(SILVAS), 'silva', new Set())
        .map(({ player }) => player.name)
        .join(', '),
  },
  {
    label: 'String normalize: normalizeName',
    expected: 'ibrahimovic',
    run: () => normalizeName('İbrahimović'),
  },
  {
    label: 'Zod safeParse: isRoomCode',
    expected: 'true false',
    run: () => `${isRoomCode('K7QM2X')} ${isRoomCode('K7QM0X')}`,
  },
];
