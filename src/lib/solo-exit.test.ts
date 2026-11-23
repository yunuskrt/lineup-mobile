import { describe, expect, it } from 'vitest';
import { soloExitStep } from '@/lib/solo-exit';
import { INITIAL_SOLO_RUN, soloRunReducer } from '@/lib/solo-run';
import type { ApiError } from '@/types/api';

function failedWith(code: ApiError['code']) {
  const finding = soloRunReducer(INITIAL_SOLO_RUN, {
    type: 'finding',
    matchId: null,
    practice: false,
  });
  return soloRunReducer(finding, {
    type: 'failed',
    step: 'find',
    error: { code, message: 'sample', retryAfterMs: null },
  });
}

describe('soloExitStep', () => {
  it('opens the filters for an empty pool', () => {
    expect(soloExitStep(failedWith('empty_pool'))).toBe('filters');
  });

  it('opens Start for any other failure', () => {
    expect(soloExitStep(failedWith('not_found'))).toBe('start');
  });

  it('opens Start for a run with no failure', () => {
    expect(soloExitStep(INITIAL_SOLO_RUN)).toBe('start');
  });
});
