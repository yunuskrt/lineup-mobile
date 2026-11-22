import { SQUAD_SIZE } from '@/lib/api/schemas/common';
import {
  SAMPLE_MATCH,
  sampleDirectoryKey,
  samplePlayer,
} from '@/lib/dev/samples';
import { demoTimeline } from '@/lib/landing-demo';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { CatalogOverview, Showcase } from '@/types/catalog';
import type { ShowcasePlayback } from '@/types/landing';

const MISS_NAME = 'Marco Bellandi';

// A sample, not a mock: the dev samples' XI and a fixed script
export const SAMPLE_SHOWCASE: Showcase = {
  match: SAMPLE_MATCH,
  players: Array.from({ length: SQUAD_SIZE }, (_, slot) =>
    samplePlayer(SAMPLE_MATCH.formation, slot),
  ),
  demo: {
    reveals: [9, 0, 6, 3, 10, 2, 7, 4],
    miss: {
      name: MISS_NAME,
      imageUrl: null,
      directoryKey: sampleDirectoryKey(MISS_NAME),
    },
  },
};

// The rest of an overview, for the copied landing tests; kinds mixed
export const SAMPLE_OVERVIEW: CatalogOverview = {
  counts: {
    matches: 1924,
    players: 6210,
    clubs: 84,
    nationalTeams: 32,
    seasons: 26,
  },
  era: { from: 2000, to: 2025 },
  highlights: { finals: 61, shootouts: 48, extraTime: 97, goals: 5873 },
  competitions: [
    { id: 'sample-euro', kind: 'euro', name: 'Nations Cup', logoUrl: null },
    SAMPLE_MATCH.competition,
    {
      id: 'sample-league',
      kind: 'league',
      name: 'Premier Division',
      logoUrl: null,
    },
    {
      id: 'sample-world',
      kind: 'world_cup',
      name: 'World Finals',
      logoUrl: null,
    },
    {
      id: 'sample-shield',
      kind: 'uel',
      name: 'Federation Shield',
      logoUrl: null,
    },
  ],
  topClubs: [SAMPLE_MATCH.home, SAMPLE_MATCH.away],
  showcase: SAMPLE_SHOWCASE,
};

// The first guess, its suggestion row highlighted
function highlightedMomentMs(): number {
  const [, first] = demoTimeline(SAMPLE_SHOWCASE).steps;
  const typed = first.kind === 'reveal' ? first.typed : '';
  const typingMs =
    MOTION_DURATION_MS.demoLead +
    Array.from(typed).length * MOTION_DURATION_MS.demoTypeStep;
  return first.startMs + typingMs + MOTION_DURATION_MS.demoSuggest * 0.75;
}

export type WelcomeState = {
  description: string;
  showcase: Showcase | null;
  isLoading: boolean;
  playback?: ShowcasePlayback;
};

export const WELCOME_STATES: Record<string, WelcomeState> = {
  ready: {
    description: 'The demo plays: types, suggests, reveals, one shake, loops.',
    showcase: SAMPLE_SHOWCASE,
    isLoading: false,
  },
  'demo-paused': {
    description: 'Paused before it starts: Play resumes it.',
    showcase: SAMPLE_SHOWCASE,
    isLoading: false,
    playback: { startsPaused: true },
  },
  still: {
    description: 'The reduced-motion frame: eight slots filled, nothing moves.',
    showcase: SAMPLE_SHOWCASE,
    isLoading: false,
    playback: { isStill: true },
  },
  frozen: {
    description: 'One moment: the first suggestion row highlighted.',
    showcase: SAMPLE_SHOWCASE,
    isLoading: false,
    playback: { frozenAtMs: highlightedMomentMs() },
  },
  loading: {
    description: 'The first fetch: the stage and caption as skeletons.',
    showcase: null,
    isLoading: true,
  },
  'no-showcase': {
    description: 'No showcase, or the catalog is down: no frame at all.',
    showcase: null,
    isLoading: false,
  },
};

export const DEFAULT_WELCOME_STATE = 'ready';
