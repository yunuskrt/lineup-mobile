import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { listenForUnlock, playCue } from '@/lib/sound/engine';
import { getMuted, setMuted, subscribeMuted } from '@/lib/sound/preference';
import { SOUND_CUES } from '@/styles/sound';
import type { CueSpec, PlayOptions, SoundCue } from '@/types/sound';

// Wakes the audio now, and again on each return to the app
export function useSoundUnlock() {
  useEffect(() => listenForUnlock(), []);
}

export function useSound() {
  const isMuted = useSyncExternalStore(subscribeMuted, getMuted);

  useSoundUnlock();

  const toggleMuted = useCallback(() => setMuted(!getMuted()), []);

  const play = useCallback(
    (cue: SoundCue | CueSpec, { gainScale }: PlayOptions = {}) => {
      if (getMuted()) return;
      playCue(typeof cue === 'string' ? SOUND_CUES[cue] : cue, gainScale);
    },
    [],
  );

  return { isMuted, toggleMuted, play };
}
