import { useReducedMotion } from 'react-native-reanimated';
import { type AnyMotionEffect, policyFor } from '@/lib/motion-policy';

// The one place a component learns about reduced motion
export function useMotionPolicy(): (effect: AnyMotionEffect) => boolean {
  return policyFor(useReducedMotion());
}
