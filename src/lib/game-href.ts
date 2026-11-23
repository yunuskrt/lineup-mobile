import type { Href } from 'expo-router';
import { type PlayStep, withStep } from '@/lib/play-steps';
import type { PlayMode } from '@/types/play';

const GAME_PATHS = { solo: '/play/solo', duel: '/play/duel' } as const;

// A query string, as withQuery builds: a params object would join clubs
export function gameHref(mode: PlayMode, params: URLSearchParams): Href {
  const query = params.toString();
  return query ? `${GAME_PATHS[mode]}?${query}` : GAME_PATHS[mode];
}

// The web's playPath, typed for the router; no hash on a phone
export function playHref(params: URLSearchParams, step: PlayStep): Href {
  const query = withStep(params, step).toString();
  return query ? `/play?${query}` : '/play';
}
