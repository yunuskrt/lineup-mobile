import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { SOUND_CUES } from '@/styles/sound';

type Engine = typeof import('@/lib/sound/engine');

class FakeParam {
  value = 0;
  setValueAtTime() {}
  linearRampToValueAtTime() {}
  exponentialRampToValueAtTime() {}
}

class FakeNode {
  connect() {}
}

class FakeOscillator extends FakeNode {
  type = 'sine';
  frequency = new FakeParam();
  start() {}
  stop() {}
}

class FakeContext {
  static made: FakeContext[] = [];
  static failRender = false;
  state: AudioContextState = 'suspended';
  currentTime = 0;
  sampleRate = 100;
  destination = new FakeNode();
  oscillators = 0;
  // A real resume settles later, not inside the call
  resume = vi.fn(async () => {
    await Promise.resolve();
    this.state = 'running';
  });

  constructor() {
    FakeContext.made.push(this);
  }

  createGain() {
    return Object.assign(new FakeNode(), { gain: new FakeParam() });
  }

  createOscillator() {
    if (FakeContext.failRender) throw new Error('InvalidStateError');
    this.oscillators += 1;
    return new FakeOscillator();
  }
}

type FakeRuntime = {
  createContext: () => AudioContext;
  prepareSession: Mock<() => void>;
  onForeground: Mock<(listener: () => void) => void>;
};

// The library mirrors Web Audio; the fake stands in for its context
function fakeRuntime(): FakeRuntime {
  return {
    createContext: () => new FakeContext() as unknown as AudioContext,
    prepareSession: vi.fn<() => void>(),
    onForeground: vi.fn<(listener: () => void) => void>(),
  };
}

// Fresh module state per test: the engine is a singleton
async function loadEngine(runtime: FakeRuntime | null): Promise<Engine> {
  vi.resetModules();
  const engine = await import('@/lib/sound/engine');
  engine.registerAudioRuntime(runtime);
  return engine;
}

describe('engine without a runtime', () => {
  it('turns every call into a no-op', async () => {
    const { listenForUnlock, playCue, unlockSound } = await loadEngine(null);
    expect(() => listenForUnlock()).not.toThrow();
    expect(() => unlockSound()).not.toThrow();
    expect(() => playCue(SOUND_CUES.correctNew)).not.toThrow();
    expect(() => playCue(SOUND_CUES.tick, 0.5)).not.toThrow();
  });
});

describe('engine with a runtime', () => {
  let runtime: FakeRuntime;

  beforeEach(() => {
    FakeContext.made = [];
    FakeContext.failRender = false;
    runtime = fakeRuntime();
  });

  it('creates no context until something asks for sound', async () => {
    await loadEngine(runtime);
    expect(FakeContext.made).toHaveLength(0);
  });

  it('creates one context on unlock and resumes it', async () => {
    const { unlockSound } = await loadEngine(runtime);
    unlockSound();
    await Promise.resolve();
    unlockSound();
    expect(FakeContext.made).toHaveLength(1);
    expect(FakeContext.made[0].resume).toHaveBeenCalledOnce();
  });

  it('sets the audio session once, before the context', async () => {
    const { unlockSound } = await loadEngine(runtime);
    unlockSound();
    unlockSound();
    expect(runtime.prepareSession).toHaveBeenCalledOnce();
  });

  it('wakes the context on the first cue, and plays once it runs', async () => {
    const { playCue } = await loadEngine(runtime);
    playCue(SOUND_CUES.correctNew);
    const [context] = FakeContext.made;
    expect(context.oscillators).toBe(0);
    await Promise.resolve();
    playCue(SOUND_CUES.correctNew);
    expect(context.oscillators).toBe(2);
  });

  it('plays the first cue at once when the context starts running', async () => {
    const running = {
      ...runtime,
      createContext: () => {
        const context = new FakeContext();
        context.state = 'running';
        return context as unknown as AudioContext;
      },
    };
    const { playCue } = await loadEngine(running);
    playCue(SOUND_CUES.correctNew);
    expect(FakeContext.made[0].oscillators).toBe(2);
  });

  it('plays nothing while the context is still suspended', async () => {
    const { playCue, unlockSound } = await loadEngine(runtime);
    unlockSound();
    const [context] = FakeContext.made;
    context.state = 'suspended';
    playCue(SOUND_CUES.correctNew);
    expect(context.oscillators).toBe(0);
  });

  // The OS can suspend a running context in the background
  it('resumes again after a later suspend', async () => {
    const { unlockSound } = await loadEngine(runtime);
    unlockSound();
    await Promise.resolve();
    const [context] = FakeContext.made;
    context.state = 'suspended';
    unlockSound();
    expect(context.resume).toHaveBeenCalledTimes(2);
  });

  it('never resumes a closed context', async () => {
    const { unlockSound } = await loadEngine(runtime);
    unlockSound();
    const [context] = FakeContext.made;
    context.state = 'closed';
    unlockSound();
    expect(context.resume).toHaveBeenCalledOnce();
  });

  it('swallows a render error', async () => {
    const { playCue, unlockSound } = await loadEngine(runtime);
    unlockSound();
    await Promise.resolve();
    FakeContext.failRender = true;
    expect(() => playCue(SOUND_CUES.correctNew)).not.toThrow();
  });

  it('gives up for good when the context throws', async () => {
    const createContext = vi.fn(() => {
      throw new Error('NotSupportedError');
    });
    const { unlockSound } = await loadEngine({ ...runtime, createContext });
    expect(() => unlockSound()).not.toThrow();
    expect(() => unlockSound()).not.toThrow();
    expect(createContext).toHaveBeenCalledOnce();
  });

  it('wakes now and on every return to the foreground, set up once', async () => {
    const { listenForUnlock, unlockSound } = await loadEngine(runtime);
    listenForUnlock();
    listenForUnlock();
    expect(FakeContext.made).toHaveLength(1);
    expect(runtime.onForeground).toHaveBeenCalledOnce();
    expect(runtime.onForeground.mock.calls[0][0]).toBe(unlockSound);
  });
});
