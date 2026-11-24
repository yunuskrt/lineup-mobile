import { AUTH_ERROR_MESSAGES } from '@/lib/auth';
import type { ProPlan } from '@/types/pro-plan';

export const DEFAULT_PRO_STATE = 'free';

export type ProState =
  { status: 'ready'; plan: ProPlan } | { status: 'error'; message: string };

export const PRO_STATES: Record<string, ProState> = {
  free: { status: 'ready', plan: 'free' },
  pro: { status: 'ready', plan: 'pro' },
  pending: { status: 'ready', plan: 'pending' },
  error: { status: 'error', message: AUTH_ERROR_MESSAGES.network },
};

export function resolveProState(
  param: string | string[] | undefined,
): ProState {
  const name =
    typeof param === 'string' && Object.hasOwn(PRO_STATES, param)
      ? param
      : DEFAULT_PRO_STATE;

  return PRO_STATES[name];
}
