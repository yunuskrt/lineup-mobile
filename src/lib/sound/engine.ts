import { renderCue } from '@/lib/sound/render';
import { MASTER_GAIN } from '@/styles/sound';
import type { CueSpec } from '@/types/sound';

type Engine = { context: AudioContext; master: GainNode };

// The native Web Audio pieces, set at startup; tests pass fakes
export type AudioRuntime = {
  createContext: () => AudioContext;
  // The platform's audio session, set before the first context
  prepareSession?: () => void;
  onForeground?: (listener: () => void) => void;
};

let runtime: AudioRuntime | null = null;
let engine: Engine | null = null;
let isUnavailable = false;
let isListening = false;

export function registerAudioRuntime(next: AudioRuntime | null): void {
  runtime = next;
}

function createEngine(): Engine | null {
  if (isUnavailable || !runtime) return null;

  try {
    runtime.prepareSession?.();
    const context = runtime.createContext();
    const master = context.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(context.destination);
    return { context, master };
  } catch {
    isUnavailable = true;
    return null;
  }
}

// No gesture rule on a phone: this just wakes the context
export function unlockSound(): void {
  engine ??= createEngine();
  const state = engine?.context.state;
  if (!engine || state === 'running' || state === 'closed') return;
  engine.context.resume().catch(() => {});
}

// Kept for good: the OS can suspend the context in the background
export function listenForUnlock(): void {
  if (isListening || !runtime) return;
  isListening = true;
  unlockSound();
  runtime.onForeground?.(unlockSound);
}

export function playCue(spec: CueSpec, gainScale?: number): void {
  // A native context usually starts running, so the first cue plays
  if (engine?.context.state !== 'running') unlockSound();
  if (!engine || engine.context.state !== 'running') return;

  try {
    const { context, master } = engine;
    renderCue(context, master, spec, context.currentTime, gainScale);
  } catch {
    // A sound never breaks a round
  }
}
