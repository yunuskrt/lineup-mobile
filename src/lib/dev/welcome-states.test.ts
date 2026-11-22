import { describe, expect, it } from 'vitest';
import {
  catalogOverviewSchema,
  showcaseSchema,
} from '@/lib/api/schemas/catalog';
import {
  SAMPLE_OVERVIEW,
  SAMPLE_SHOWCASE,
  WELCOME_STATES,
} from '@/lib/dev/welcome-states';
import { demoFrameAt, demoTimeline } from '@/lib/landing-demo';

describe('SAMPLE_SHOWCASE', () => {
  it('is a showcase the backend could send', () => {
    expect(showcaseSchema.safeParse(SAMPLE_SHOWCASE).success).toBe(true);
  });
});

describe('SAMPLE_OVERVIEW', () => {
  it('is an overview the backend could send', () => {
    expect(catalogOverviewSchema.safeParse(SAMPLE_OVERVIEW).success).toBe(true);
  });
});

describe('WELCOME_STATES', () => {
  it('freezes on a highlighted suggestion row', () => {
    const at = WELCOME_STATES.frozen.playback?.frozenAtMs ?? -1;
    const frame = demoFrameAt(demoTimeline(SAMPLE_SHOWCASE), at);
    expect(frame.suggestion).not.toBeNull();
    expect(frame.isHighlighted).toBe(true);
  });

  it('gives a frame only to the states that have a showcase or load', () => {
    expect(WELCOME_STATES['no-showcase'].showcase).toBeNull();
    expect(WELCOME_STATES['no-showcase'].isLoading).toBe(false);
    expect(WELCOME_STATES.loading.isLoading).toBe(true);
  });
});
