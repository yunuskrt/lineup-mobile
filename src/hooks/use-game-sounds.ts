import { useEffect, useRef } from 'react';
import { useSound } from '@/hooks/use-sound';
import { activeRing } from '@/lib/canvas';
import { displaySeconds, remainingMs } from '@/lib/countdown';
import { cueHaptic } from '@/lib/haptics';
import { serverClock } from '@/lib/server-clock';
import {
  heardClockCue,
  isLateCue,
  scheduleCues,
  soundCuesFor,
} from '@/lib/sound-cues';
import type { CanvasView } from '@/types/canvas';
import type { HeardSecond, SoundCue } from '@/types/sound';

function useEventSounds(view: CanvasView) {
  const { play } = useSound();
  const previous = useRef<CanvasView | null>(null);
  const lastEventCueAt = useRef(-Infinity);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const last = previous.current;
    previous.current = view;
    // The first view is a load or a resume
    if (!last) return;

    // The haptic skips the mute: the phone's own setting governs it
    const fire = (cue: SoundCue) => {
      cueHaptic(cue);
      play(cue);
    };
    const now = performance.now();
    const cues = scheduleCues(
      soundCuesFor(last, view),
      now - lastEventCueAt.current,
    );
    for (const { cue, delayMs } of cues) {
      if (!isLateCue(cue)) lastEventCueAt.current = now;
      if (delayMs === 0) {
        fire(cue);
        continue;
      }
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        fire(cue);
      }, delayMs);
      timers.current.add(timer);
    }
  }, [view, play]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
}

// Hears the second the ring shows, on its frame; idle while it's still
function useClockSounds(view: CanvasView) {
  const { play } = useSound();
  const heard = useRef<HeardSecond | null>(null);
  const ring = activeRing(view.clock, view.mode === 'duel' ? view.turn : 'you');
  const { mode, owner } = ring;
  const { startedAt, endsAt } = ring.round;

  useEffect(() => {
    if (mode !== 'running') return;
    const round = { startedAt, endsAt };
    let handle = 0;

    const tick = () => {
      const seconds = displaySeconds(remainingMs(round, serverClock.now()));
      const now = { startedAt, endsAt, seconds };
      const cue = heardClockCue(heard.current, now, owner);
      heard.current = now;
      if (cue) play(cue.cue, { gainScale: cue.gainScale });
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [mode, owner, startedAt, endsAt, play]);
}

export function useGameSounds(view: CanvasView) {
  useEventSounds(view);
  useClockSounds(view);
}
