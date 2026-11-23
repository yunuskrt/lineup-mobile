import type { PlayStep } from '@/lib/play-steps';
import type { SoloRunState } from '@/types/solo-run';

// An empty pool's Change filters opens Filters; every other exit, Start
export function soloExitStep(state: SoloRunState): PlayStep {
  return state.failure?.error.code === 'empty_pool' ? 'filters' : 'start';
}
