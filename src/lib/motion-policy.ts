import {
  type MotionEffect,
  motionFor,
  type ReducedMotion,
} from '@/styles/motion';

// Phone-only effects; motion.ts stays a word-for-word web copy
type NativeMotionEffect = 'pressShift';

const NATIVE_MOTION_POLICY: Record<NativeMotionEffect, ReducedMotion> = {
  pressShift: 'drop',
};

export type AnyMotionEffect = MotionEffect | NativeMotionEffect;

function isNative(effect: AnyMotionEffect): effect is NativeMotionEffect {
  return effect in NATIVE_MOTION_POLICY;
}

// True when the effect should run for this viewer
export function policyFor(
  isReduced: boolean | null,
): (effect: AnyMotionEffect) => boolean {
  return (effect) =>
    isNative(effect)
      ? NATIVE_MOTION_POLICY[effect] === 'keep' || !isReduced
      : motionFor(effect, isReduced);
}
