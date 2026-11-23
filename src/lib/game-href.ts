import type { Href } from 'expo-router';
import type { PlayMode } from '@/types/play';

const GAME_PATHS = { solo: '/play/solo', duel: '/play/duel' } as const;

// A query string, as withQuery builds: a params object would join clubs
export function gameHref(mode: PlayMode, params: URLSearchParams): Href {
  const query = params.toString();
  return query ? `${GAME_PATHS[mode]}?${query}` : GAME_PATHS[mode];
}
