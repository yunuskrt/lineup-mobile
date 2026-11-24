import { FILTER_PARAMS } from '@/lib/filters';
import { ROOM_PARAM, roomIntentFrom } from '@/lib/room-code';
import type { RoomLinkRedirect } from '@/types/room-link';

const DUEL_PATH = '/play/duel';
const WEB_SCHEME = /^https?:\/\//i;
const ANY_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

// A web link's host is a domain; a custom scheme's host is the route
function routePathOf(head: string): string {
  let path = head;
  if (WEB_SCHEME.test(path)) {
    path = path.replace(WEB_SCHEME, '').replace(/^[^/]*/, '');
  } else if (ANY_SCHEME.test(path)) {
    path = path.replace(ANY_SCHEME, '');
  }
  return `/${path.split('/').filter(Boolean).join('/')}`;
}

// The route path and query of a link, whatever its scheme
function splitLink(link: string): { path: string; query: string } {
  const [beforeHash] = link.split('#');
  const queryAt = beforeHash.indexOf('?');
  if (queryAt < 0) return { path: routePathOf(beforeHash), query: '' };
  return {
    path: routePathOf(beforeHash.slice(0, queryAt)),
    query: beforeHash.slice(queryAt + 1),
  };
}

// Null: not a room link; '' a room link with nothing to join
export function roomLinkCode(link: string): string | null {
  const { path, query } = splitLink(link);
  if (path !== DUEL_PATH) return null;
  const intent = roomIntentFrom(new URLSearchParams(query));
  return intent?.kind === 'join' ? intent.code : '';
}

// Step 1 of /play with Duel picked and the code in the join box
export function joinRowPath(code: string): string {
  const params = new URLSearchParams({ [FILTER_PARAMS.mode]: 'duel' });
  if (code) params.set(ROOM_PARAM, code);
  return `/play?${params.toString()}`;
}

// A link never takes the player off a board: the code waits instead
export function redirectRoomLink(
  link: string,
  isGameOpen: boolean,
): RoomLinkRedirect {
  const code = roomLinkCode(link);
  if (code === null) return { path: link, heldCode: null };
  if (isGameOpen) return { path: null, heldCode: code || null };
  return { path: joinRowPath(code), heldCode: null };
}
