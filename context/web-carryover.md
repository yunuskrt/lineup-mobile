# Web Carry-over

Every file this repo copied from `lineup-web`. Each one sits at the **same path** in `../lineup-web/`, and belongs to this repo from the moment it was pasted: it builds with the web deleted and changes on its own schedule.

- **Word for word:** byte-identical to the web file when copied. A web fix is "paste the new version and run `npm test`".
- **Adapted:** changed here; the note says what, so a re-paste keeps the change.
- **Browser-only:** compiles here, but must not run until the named phase adapts it.

Add a row for every file a copy list brings in, and update the state when a phase adapts one. Components are never copied.

## Extracted from web components (M02)

Not copies of whole files: types the web keeps inside `.tsx` components, moved here so the copies can import them.

| File | Web source | Phase |
| --- | --- | --- |
| `src/types/guess-input.ts` | `GuessInputStatus` in `src/components/game/GuessInput.tsx` | M02 |
| `src/types/quit-dialog.ts` | `QuitDialogCopy` in `src/components/game/QuitDialog.tsx` | M02 |

## Copy list A — Core (M02), 139 files

| File | Phase | State |
| --- | --- | --- |
| `src/components/game/competition-kind.test.ts` | M02 | word for word |
| `src/components/game/competition-kind.ts` | M02 | word for word |
| `src/components/game/shirt.ts` | M02 | word for word |
| `src/components/pitch/person.ts` | M02 | word for word |
| `src/components/play/filter-icons.ts` | M02 | word for word |
| `src/lib/api/client.ts` | M02 | word for word |
| `src/lib/api/duel-client.ts` | M02 | word for word |
| `src/lib/api/duel-emitter.test.ts` | M02 | word for word |
| `src/lib/api/duel-emitter.ts` | M02 | word for word |
| `src/lib/api/protocol.ts` | M02 | word for word |
| `src/lib/api/retry.test.ts` | M02 | word for word |
| `src/lib/api/retry.ts` | M02 | word for word |
| `src/lib/api/schemas/auth.ts` | M02 | word for word |
| `src/lib/api/schemas/catalog.ts` | M02 | word for word |
| `src/lib/api/schemas/common.test.ts` | M02 | word for word |
| `src/lib/api/schemas/common.ts` | M02 | word for word |
| `src/lib/api/schemas/config.test.ts` | M02 | word for word |
| `src/lib/api/schemas/config.ts` | M02 | word for word |
| `src/lib/api/schemas/duel.test.ts` | M02 | word for word |
| `src/lib/api/schemas/duel.ts` | M02 | word for word |
| `src/lib/api/schemas/game.ts` | M02 | word for word |
| `src/lib/api/schemas/match.test.ts` | M02 | word for word |
| `src/lib/api/schemas/match.ts` | M02 | word for word |
| `src/lib/api/schemas/player.test.ts` | M02 | word for word |
| `src/lib/api/schemas/player.ts` | M02 | word for word |
| `src/lib/api/schemas/profile.ts` | M02 | word for word |
| `src/lib/api/schemas/result.ts` | M02 | word for word |
| `src/lib/api/schemas/solo.test.ts` | M02 | word for word |
| `src/lib/api/schemas/solo.ts` | M02 | word for word |
| `src/lib/api/schemas/user.ts` | M02 | word for word |
| `src/lib/api/session-loss.test.ts` | M02 | word for word |
| `src/lib/api/session-loss.ts` | M02 | word for word |
| `src/lib/api/unwrap.test.ts` | M02 | word for word |
| `src/lib/api/unwrap.ts` | M02 | word for word |
| `src/lib/archive.test.ts` | M02 | word for word |
| `src/lib/archive.ts` | M02 | word for word |
| `src/lib/auth.test.ts` | M02 | word for word |
| `src/lib/auth.ts` | M02 | word for word |
| `src/lib/canvas.test.ts` | M02 | word for word |
| `src/lib/canvas.ts` | M02 | word for word |
| `src/lib/countdown.test.ts` | M02 | word for word |
| `src/lib/countdown.ts` | M02 | word for word |
| `src/lib/date-label.test.ts` | M02 | word for word |
| `src/lib/date-label.ts` | M02 | word for word |
| `src/lib/dev/archive-states.test.ts` | M02 | word for word |
| `src/lib/dev/archive-states.ts` | M02 | word for word |
| `src/lib/dev/canvas-states.test.ts` | M02 | word for word |
| `src/lib/dev/canvas-states.ts` | M02 | word for word |
| `src/lib/dev/profile-states.test.ts` | M02 | word for word |
| `src/lib/dev/profile-states.ts` | M02 | word for word |
| `src/lib/dev/samples.ts` | M02 | word for word |
| `src/lib/duel-result.test.ts` | M02 | word for word |
| `src/lib/duel-result.ts` | M02 | word for word |
| `src/lib/duel-session.ts` | M02 | adapted: imports `GuessInputStatus` from `@/types/guess-input` |
| `src/lib/duel-status.test.ts` | M02 | word for word |
| `src/lib/duel-status.ts` | M02 | word for word |
| `src/lib/feedback.test.ts` | M02 | word for word |
| `src/lib/feedback.ts` | M02 | word for word |
| `src/lib/filters.test.ts` | M02 | word for word |
| `src/lib/filters.ts` | M02 | word for word. **Browser-only:** `replaceQuery` uses `window.history`; M13 replaces it with Expo Router |
| `src/lib/formation.test.ts` | M02 | word for word |
| `src/lib/formation.ts` | M02 | word for word |
| `src/lib/guess.test.ts` | M02 | word for word |
| `src/lib/guess.ts` | M02 | word for word |
| `src/lib/initials.test.ts` | M02 | word for word |
| `src/lib/initials.ts` | M02 | word for word |
| `src/lib/landing-demo.ts` | M02 | word for word |
| `src/lib/landing.ts` | M02 | word for word |
| `src/lib/lobby.test.ts` | M02 | word for word |
| `src/lib/lobby.ts` | M02 | word for word |
| `src/lib/match-header.ts` | M02 | word for word |
| `src/lib/normalize.test.ts` | M02 | word for word |
| `src/lib/normalize.ts` | M02 | word for word |
| `src/lib/play-steps.test.ts` | M02 | word for word |
| `src/lib/play-steps.ts` | M02 | word for word |
| `src/lib/plural.test.ts` | M02 | word for word |
| `src/lib/plural.ts` | M02 | word for word |
| `src/lib/practice.test.ts` | M02 | word for word |
| `src/lib/practice.ts` | M02 | adapted: imports `QuitDialogCopy` from `@/types/quit-dialog`. **Browser-only:** the open-run flag uses `sessionStorage`; M14 moves it to device storage |
| `src/lib/pro.test.ts` | M02 | word for word |
| `src/lib/pro.ts` | M02 | word for word |
| `src/lib/profile.test.ts` | M02 | word for word |
| `src/lib/profile.ts` | M02 | word for word |
| `src/lib/query-keys.ts` | M02 | word for word |
| `src/lib/result-actions.test.ts` | M02 | word for word |
| `src/lib/result-actions.ts` | M02 | word for word |
| `src/lib/room-code.test.ts` | M02 | word for word |
| `src/lib/room-code.ts` | M02 | word for word |
| `src/lib/server-clock.test.ts` | M02 | word for word |
| `src/lib/server-clock.ts` | M02 | word for word |
| `src/lib/solo-allowance.test.ts` | M02 | word for word |
| `src/lib/solo-allowance.ts` | M02 | word for word |
| `src/lib/solo-run.test.ts` | M02 | word for word |
| `src/lib/solo-run.ts` | M02 | adapted: imports `GuessInputStatus` from `@/types/guess-input`, and `QuitDialogCopy` from `@/types/quit-dialog` |
| `src/lib/sound-cues.test.ts` | M02 | word for word |
| `src/lib/sound-cues.ts` | M02 | word for word |
| `src/lib/suggestions.test.ts` | M02 | word for word |
| `src/lib/suggestions.ts` | M02 | word for word |
| `src/lib/summary.test.ts` | M02 | word for word |
| `src/lib/summary.ts` | M02 | word for word |
| `src/lib/system-states.test.ts` | M02 | word for word |
| `src/lib/system-states.ts` | M02 | word for word |
| `src/lib/utils.test.ts` | M02 | word for word |
| `src/lib/utils.ts` | M02 | word for word |
| `src/lib/wait.test.ts` | M02 | word for word |
| `src/lib/wait.ts` | M02 | word for word |
| `src/styles/contrast.ts` | M02 | word for word |
| `src/styles/motion.ts` | M02 | word for word |
| `src/styles/sound.test.ts` | M02 | word for word |
| `src/styles/sound.ts` | M02 | word for word |
| `src/types/api.ts` | M02 | word for word |
| `src/types/archive.ts` | M02 | word for word |
| `src/types/auth.ts` | M02 | word for word |
| `src/types/canvas.ts` | M02 | adapted: imports `GuessInputStatus` from `@/types/guess-input` |
| `src/types/catalog.ts` | M02 | word for word |
| `src/types/config.ts` | M02 | word for word |
| `src/types/countdown.ts` | M02 | word for word |
| `src/types/duel-lobby.ts` | M02 | word for word |
| `src/types/duel-session.ts` | M02 | word for word |
| `src/types/duel.ts` | M02 | word for word |
| `src/types/feedback.ts` | M02 | word for word |
| `src/types/filters.ts` | M02 | word for word |
| `src/types/formation.ts` | M02 | word for word |
| `src/types/game.ts` | M02 | word for word |
| `src/types/landing.ts` | M02 | word for word |
| `src/types/match.ts` | M02 | word for word |
| `src/types/play.ts` | M02 | word for word |
| `src/types/player.ts` | M02 | word for word |
| `src/types/pro.ts` | M02 | word for word |
| `src/types/profile-screen.ts` | M02 | word for word |
| `src/types/profile.ts` | M02 | word for word |
| `src/types/query.ts` | M02 | word for word |
| `src/types/room.ts` | M02 | word for word |
| `src/types/solo-run.ts` | M02 | word for word |
| `src/types/solo.ts` | M02 | word for word |
| `src/types/sound.ts` | M02 | word for word |
| `src/types/summary.ts` | M02 | word for word |
| `src/types/user.ts` | M02 | word for word |
| `vitest.config.mts` | M02 | word for word |

## Copy list B — API and data hooks (M06), 24 files

| File | Phase | State |
| --- | --- | --- |
| `src/components/providers/query-client.test.ts` | M06 | word for word |
| `src/components/providers/query-client.ts` | M06 | word for word |
| `src/hooks/use-archive.ts` | M06 | word for word |
| `src/hooks/use-auth.test.ts` | M06 | adapted: the `ensureSession` tests base their fake on a real HTTP client (no mock to reuse); a `clearSession` token test added |
| `src/hooks/use-auth.ts` | M06 | adapted: `clearSession` also calls `clearToken()` |
| `src/hooks/use-catalog-overview.ts` | M06 | word for word |
| `src/hooks/use-changed-since-mount.ts` | M06 | word for word |
| `src/hooks/use-cooldown-end.ts` | M06 | adapted: `'use client'` removed |
| `src/hooks/use-filter-options.ts` | M06 | word for word |
| `src/hooks/use-image-fallback.ts` | M06 | adapted: `'use client'` removed |
| `src/hooks/use-player-directory.test.ts` | M06 | word for word |
| `src/hooks/use-player-directory.ts` | M06 | word for word |
| `src/hooks/use-pro.ts` | M06 | word for word |
| `src/hooks/use-profile.ts` | M06 | word for word |
| `src/hooks/use-seconds-left.ts` | M06 | word for word |
| `src/hooks/use-solo-allowance.ts` | M06 | word for word |
| `src/hooks/use-today.ts` | M06 | word for word |
| `src/lib/api/config.test.ts` | M06 | adapted: the env name; the `API_MODE` and mock-flag tests removed |
| `src/lib/api/config.ts` | M06 | adapted: reads `EXPO_PUBLIC_API_URL` with `!__DEV__` as production; `API_MODE` and the mock flags removed; `isOrigin` uses try/catch, as Hermes's `URL` has no `canParse` |
| `src/lib/api/http/api-client.ts` | M06 | word for word |
| `src/lib/api/http/transport.test.ts` | M06 | adapted: expects no `credentials` |
| `src/lib/api/http/transport.ts` | M06 | adapted: no `credentials`; sends `Authorization: Bearer` from the token store; stores a `set-auth-token` header |
| `src/lib/api/pro-switch.test.ts` | M06 | word for word |
| `src/lib/api/pro-switch.ts` | M06 | adapted: `isProSwitchOff` removed (a Next.js server fetch); `isSwitchOffIn` kept |

## Copy list C — Sound (M12a), 8 files

| File | Phase | State |
| --- | --- | --- |
| `src/lib/sound/engine.test.ts` | M12a | adapted: registers a fake runtime instead of stubbing `window` and `AudioContext`. The fake's `resume` settles on a microtask, as a real one does. Added: the session is set once; the first cue wakes the context; a running context plays the first cue; the foreground listener. The unlock-twice case resumes once after it runs |
| `src/lib/sound/engine.ts` | M12a | adapted: an injected `AudioRuntime` (`registerAudioRuntime`: the context factory, the audio session and the foreground event) replaces `window`'s `AudioContext` and the gesture listeners. `listenForUnlock` wakes the context now and on each return to the foreground, and `playCue` wakes a suspended context |
| `src/lib/sound/preference.test.ts` | M12a | adapted: the browser cases become a configured store across a relaunch |
| `src/lib/sound/preference.ts` | M12a | adapted: `configureSoundStorage` replaces `browserStorage()` (`localStorage`) |
| `src/lib/sound/render.test.ts` | M12a | adapted: vibrato is checked as a frequency curve, plus a curve that glides |
| `src/lib/sound/render.ts` | M12a | adapted: vibrato is drawn as a `setValueCurveAtTime` frequency curve, as `react-native-audio-api` 1.0.1 aborts when a node is connected to an `AudioParam` |
| `src/hooks/use-game-sounds.ts` | M12a, M12b | adapted: no `'use client'`; a `requestAnimationFrame` loop, run only while the ring runs, replaces motion's `useAnimationFrame`. M12b: each event cue fires its haptic (`cueHaptic`) beside `play`, as the mute leaves haptics on |
| `src/hooks/use-sound.ts` | M12a | adapted: no `'use client'` and no server snapshot |

## Single files (later phases)

Pasted by hand outside a copy list, when a phase needed them.

| File | Phase | State |
| --- | --- | --- |
| `src/lib/landing-demo.test.ts` | M11c | adapted: the showcase is `SAMPLE_SHOWCASE` from `src/lib/dev/welcome-states.ts`, not the web's mock overview |
| `src/lib/landing.test.ts` | M11c | adapted: the overview is `SAMPLE_OVERVIEW` from `src/lib/dev/welcome-states.ts`, not the web's mock; the caption's date is the sample's 25 May 2005 |
