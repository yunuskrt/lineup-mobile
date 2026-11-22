import type { CountdownStage } from '@/types/countdown';

// Weight carries the stage too, not colour alone
export const STAGE_WEIGHTS: Record<CountdownStage, number> = {
  calm: 6,
  warning: 9,
  critical: 12,
};
