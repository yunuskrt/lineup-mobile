# Phase M12a — Sound

## Status

Not Started

## Goals

- **Copy list C, pasted by you** (8 files, from `../lineup-web/context/docs/mobile-repo-setup.md` § Copy lists):
  - `src/lib/sound/` (all 6 files: `engine`, `preference` and `render`, each with its test);
  - `src/hooks/use-sound.ts` and `src/hooks/use-game-sounds.ts`.

  Each one goes in `context/web-carryover.md`, word for word or adapted, with the change named.
- **The native Web Audio runtime:** `react-native-audio-api` (Software Mansion), installed with `npx expo install` and its config plugin in `app.json`. It's for playback only: no microphone permission, no background mode and no foreground service.
- **`src/lib/sound/engine.ts`, adapted:**
  - it builds on `react-native-audio-api`'s `AudioContext` instead of the browser's;
  - there's no browser autoplay rule, so "unlock" becomes "make sure the context is running". That happens on the first cue and when the app comes back to the foreground (`AppState`), instead of on the first pointer or key event;
  - it keeps the web's guarantees: one context, a failed build turns every call into a no-op, and a render error never breaks a round;
  - `render.ts` should carry over word for word, as the library mirrors the Web Audio node API. The adapted engine test fakes the library's context instead of `window`.
- **The audio session:**
  - **iOS:** `ambient` with `mixWithOthers`, set once before the first cue (decided: the silent switch silences the cues). The cues mix with the player's own music and never stop it;
  - **Android:** plays on the media stream, under the system volume.
- **`src/lib/sound/preference.ts`, adapted:**
  - the mute choice is stored on the device through a synchronous store, as `useSyncExternalStore` reads it on render;
  - `expo-secure-store`'s synchronous `getItem` and `setItem` are already installed, so nothing new is added;
  - the web's `readMuted` and `writeMuted` already take a storage, so only `browserStorage()` changes;
  - a blocked or empty store still means sound on.
- **`src/hooks/use-game-sounds.ts`, adapted:** the web's `useAnimationFrame` (motion) becomes a `requestAnimationFrame` loop that runs only while the ring runs. The copied `sound-cues` logic is unchanged:
  - your ticks 14 → 6;
  - the final beeps 5 → 1;
  - the opponent's ticks at half gain, with no beeps;
  - no whistle at 0: the whistle comes from the server's life-lost event;
  - the event cues come from comparing one view with the next.
- **`src/components/game/SoundToggle.tsx`:**
  - a `Volume2` or `VolumeX` icon in cream, in the scoreboard's right room, which M11a left empty for it;
  - a 44pt target with hit slop;
  - labelled "Mute sounds", with its pressed state;
  - it stays above the gate's scrim, as Quit does, and shows in solo and duel;
  - it's on `/dev/canvas` too.
- **Wiring:** `GameCanvas` calls `useGameSounds(view)`, as on web. That covers:
  - every `/dev/canvas` state with an event: `correct`, `already-found`, `not-in-xi`, `life-lost`, `their-reveal`, `their-life-lost`, and the turn handover;
  - M11b's "Pass the turn" button, which plays `turnToYou`.
- **`/dev/sound`** (`src/app/dev/sound.tsx`), from the web's `SoundPreview`:
  - **Mute:** the toggle;
  - **Clock:** a tick, the five final beeps one second apart, and the opponent's half-gain tick;
  - **Cues:** one button per cue, labelled with its event, as in the `theme.md` § Sound table.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- Copy list C (above).
- `src/styles/sound.ts` and `src/lib/sound-cues.ts`: both copied in M02, with tests.
- `src/components/game/SoundToggle.tsx`, `src/components/dev/SoundPreview.tsx` and `src/app/dev/sound/`.
- `context/theme.md` § Sound, the spec for every cue.

## Open Questions

Decide at `/feature load`; the default stands otherwise.

1. **The iPhone's silent switch.**
   - **Recommended:** respect it. That's the `ambient` category with `mixWithOthers`: the switch silences the cues, and music keeps playing under them. That's how most casual games behave, and the screen already says everything the sound does.
   - **Alternative:** play through the switch. That's `playback` with `mixWithOthers`: cues sound even on silent, still over the player's music.

Decided (user, 2026-11-22): **1 → respect the switch** (`ambient` with `mixWithOthers`).

## Out of Scope

- **Haptics doubling the cues (M12b).**
- **The real game routes (M14, M18).** The cues fire on `/dev/canvas` until then.
- **Sound on the Welcome:** there is none. The demo never calls `useGameSounds`, and this phase keeps it that way.

## Notes

- Scope: the sound engine on a native runtime, the mute toggle, the clock and event cues on the board, and `/dev/sound`.
- Depends on: M11 (the board and its scoreboard room), M02 (`sound-cues`, `styles/sound`, `types/sound`).
- Constraints:
  - **Every sound doubles something on screen** (`theme.md` § Sound). Nothing is heard that isn't shown, and the game plays fully muted.
  - **Synthesized, not recorded:** no audio files, nothing to load.
  - **No cue decides anything** (Hard Constraint 1). The clock never whistles, and urgency belongs to your own clock.
  - **Reduced motion doesn't affect sound.**
  - **On by default, one mute toggle** remembered on the device. There's no volume slider.
  - Theme roles only, one component per file, and the template. Install with `npx expo install`.
- **Your part:**
  1. Paste copy list C (8 files).
  2. After Claude adds `react-native-audio-api`, rebuild the dev build on both platforms (`npx expo run:ios` and `npx expo run:android`). A new native package needs a fresh build.
  3. With the sound up on the iOS Simulator (and the silent switch as Open Questions 1 decides), open `lineup://dev/sound` and play each cue and the clock.
  4. Open `lineup://dev/canvas`, try `critical` (beeps), `correct`, `not-in-xi`, `already-found` and `life-lost`, then a duel's "Pass the turn", and mute it.

  Claude checks Android first and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass. The copied sound tests pass, adapted where the engine changed.
  - **On both simulators:**
    - each cue on `/dev/sound` plays and sounds as the § Sound table says;
    - the final beeps rise and get louder from 3;
    - `/dev/canvas` plays the event cues and the clock;
    - the opponent's clock ticks quietly and never beeps;
    - nothing plays at 0;
    - the mute toggle silences everything, and the choice survives a relaunch;
    - the Welcome stays silent.

- **Deviations recorded during implementation:**
  - **`react-native-audio-api` 1.0.1**, installed with `npx expo install`. Its plugin is set to playback only (`iosBackgroundMode: false`, `androidForegroundService: false`, `androidPermissions: []`); by default it turns on iOS background audio and an Android foreground service.
  - **The audio session API changed in 1.0:** it's `AudioManager.setSystemOptions({ ios: { category: 'ambient', options: ['mixWithOthers'], allowHaptics: true } })`, not the docs' `setAudioSessionOptions`. `allowHaptics` is set now for M12b. Android asks for no audio focus unless told to, so music plays on there too.
  - **New: `src/lib/sound/register.ts` (`registerSound`)**, called at startup beside `registerApiClient`. It hands the copied engine and mute store their native pieces: the library's context, the session, `AppState`'s foreground event and `expo-secure-store`'s synchronous `getItem` and `setItem`. That keeps the copied modules free of native imports, so their tests run in Node.
  - **Found on the emulator: vibrato crashed the app.** The web's vibrato connects an LFO into the oscillator's frequency param, and the library aborts on that (`HostGraph::addEdge`, "!ownsOutputBuffer(to)"). It killed the app on the first whistle. `render.ts` now draws vibrato as a `setValueCurveAtTime` curve: the same glide and wobble, no node-to-param connection. Two tests cover it.
  - **`SoundToggle`** takes `isOnScoreboard` (a cream icon), as `QuitChip` does. It's a switch for screen readers: "Mute sounds", checked when muted. On the board it sits in the same overlay as Quit, above the gate's scrim, and stays when a result hides Quit.
  - All 8 copied files, and how each was adapted, are in `context/web-carryover.md`.
- **Verified on Android:**
  - **Every cue plays:** each was played from `/dev/sound`, with a temporary log in the engine, since removed:
    - all 13 cues, the final-5 sequence and the opponent's half-gain tick: 19 renders, no render error, no crash;
    - the app holds an AAudio stream on the media stream (`dumpsys audio`: `state:started`, `usage=USAGE_MEDIA`).
  - **`/dev/canvas`:**
    - `critical` beeps on its last seconds;
    - `correct` plays the find, 600ms in;
    - `their-turn` (the opponent's clock at 9s) plays four ticks, 9 to 6, and no beeps.
  - **The toggle:**
    - on the board it sits at the scoreboard's right end, in cream, above the scrim;
    - muted, it reads "checked" and stays muted after the app is force-stopped and reopened.
- **Verified by the user on iOS (2026-11-23):** every cue and the clock on `/dev/sound`, the board's cues on `/dev/canvas` (beeps, verdicts, the whistle, their quiet ticks, the handover whoosh), the mute and its relaunch, and a silent Welcome. The silent switch itself needs a real iPhone; the Simulator doesn't model it.
- **Checks:** all pass. `npm run lint` keeps its one warning from Expo's generated `.expo/types/router.d.ts`.

## History
