# Phase M09a — Countdown Clock

## Status

Not Started

## Goals

- **`src/components/game/CountdownRing.tsx`:** the web's open-arc clock in `react-native-svg`, on the same 100 × 100 view box:
  - a 270° arc (`ARC_SPAN` 0.75) with the gap at the bottom, from the copied `src/lib/countdown.ts`;
  - a `rule` track at the calm weight, then the stage arc over a 3-unit ink edge;
  - three stages by weight and colour (`design-mobile.md` § 3):
    - calm is the owner's colour (`you` or `opponent`) at weight 6;
    - warning (7–4s) is `warning` at 9;
    - critical (3–0s) is `danger` at 12, pulsing 1 → 0.6 → 1 each second;
  - the number in its stage's text role (`fg`, `opponent-text`, `warning-text`, `danger-text`), and `fg-dim` for both arc and number in `waiting`;
  - the modes `running`, `frozen` and `waiting` (`RingMode`), with `ringStage` keeping the opponent's clock and a waiting clock calm;
  - a spent arc is hidden, so no round-cap dot is left;
  - two sizes:
    - `full`, 144pt, with the number at 64 and "seconds" under it (their turn, the full board);
    - `band`, about 48pt, with the number alone (the keyboard band, beside the lives).
- **The sweep is linear and runs on the UI thread:**
  - the arc's length comes from `sweepFraction(remainingMs(round, serverClock.now()))`, animated to 0 with Reanimated's linear easing over the time left;
  - the animation restarts from the server clock whenever the round or the mode changes;
  - a `frozen` or `waiting` ring reads the clock once and holds.
- **The seconds** come from `displaySeconds`. They're re-read from the server clock on a JS tick, never counted down locally, so the number and the arc always agree.
- **`src/components/game/TurnSticker.tsx`:** the turn sticker pair, "Your turn" (`you`) and "Their turn" (`opponent`):
  - the kit's `Badge` sticker in the actor's tone, with the label from the copied `TURN_LABELS`;
  - M11 places it beside the lives, as in the `design-mobile.md` § 6 game sketches.
- **`/dev/ring`** (`src/app/dev/ring.tsx`), from the web's `RingPreview`:
  - Live: a 15s round with Restart and the three modes, beside an opponent ring that's running;
  - Static: calm 12s, warning 6s, critical 2s, time up 0s, waiting 9s and opponent 9s;
  - both sizes, and the turn sticker pair;
  - a `?section=` filter, as on the other dev pages.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/CountdownRing.tsx`: geometry, weights, tones, the pulse and the spent-arc rule.
- `src/lib/countdown.ts` (copied in M02, with its tests): stages, `ringStage`, `arcDashArray`, `sweepFraction`.
- `src/components/game/game-canvas/ClockBlock.tsx` and `src/lib/canvas.ts` (copied): the turn label and sticker.
- `src/components/dev/RingPreview.tsx` and `src/app/dev/ring/`.

No copy list.

## Out of Scope

- The lives, the life-lost flash and the reconnect chip (M09b).
- Placing the clock in the rail or band, and the turn announcement for screen readers (M11).
- The tick and final-beep sounds and their haptics (M12).

## Notes

- Scope: the round clock and the turn stickers, on a dev page. Not wired to a game.
- Depends on: M04 (Badge, `useMotionPolicy`), M02 (`countdown.ts`, `server-clock.ts`, `TURN_LABELS`).
- Constraints:
  - **The clock shows time honestly** (`theme.md` § Rules):
    - it's drawn from the server's round timestamps through `serverClock`;
    - its progress is linear, never eased;
    - it decides nothing. Reaching 0 shows 0, and the server says what happens next.
  - **Reduced motion never stops the sweep** (`ringSweep` and `timerColorShift` are `keep`). It drops only the critical pulse (`ringCriticalPulse`), through `useMotionPolicy`.
  - Three stages, never two, carried by weight as well as colour.
  - You are blue and the opponent is orange. The sticker says whose turn it is in words.
  - Text scaling is capped on the ring's number (`maxFontSizeMultiplier`), as it's a fixed-size game piece.
  - Accessibility: the ring is `accessibilityRole="timer"` labelled "Time left", with the seconds as its value. It isn't announced every second.
  - Theme roles only, including inside the SVG (`ROLES`). `style=` only for Reanimated and run-time sizes.
- **`pathLength`:** if `react-native-svg` doesn't honour it on both platforms, work out the dash in user units from the circumference (2πr). Put that in a pure helper beside `countdown.ts`, with tests.
- **The number at 64:** if two digits don't fit inside the arc at 144pt, fall back to the web's phone size (48) and record it.
- **Your part:**
  - On the iOS Simulator, open `lineup://dev/ring` and watch a full round.
  - Turn on Reduce Motion (Settings → Accessibility → Motion), and check that the sweep still runs and the critical pulse stops.
  - Claude checks Android, with animations on and off, and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: any helper added for the arc's geometry. The copied `countdown.test.ts` keeps passing.
  - On both simulators, `/dev/ring`:
    - the live ring sweeps steadily from full to empty in 15s, and the number matches the arc;
    - it turns amber at 7 and red at 3, thicker at each stage, and pulses only when critical;
    - Restart starts it again;
    - frozen holds, and waiting is grey;
    - the opponent's ring stays orange and calm throughout;
    - at 0, no dot is left;
    - both sizes render, and both stickers read clearly;
    - with reduced motion or Android's animations off, the sweep still runs and the pulse is gone.

- **Deviations recorded during implementation:**
  - **The arc is in user units:** `react-native-svg` has no `pathLength`.
    - The dash and offset come from the circumference, in `src/lib/countdown-arc.ts`, with tests.
    - The sweep animates `strokeDashoffset`, a single number, on the UI thread.
  - **Sizes:**
    - the full ring keeps 144pt, but its number is 48 (the web's phone size), not 64. At 64, "12" ran into the arc;
    - the band ring is 56pt, not about 48, with the number at 16. At 48pt, two 20pt digits touched the arc.
  - **Where the parts live:**
    - `src/hooks/use-round-clock.ts` runs the sweep and re-reads the seconds every 100ms;
    - `src/hooks/use-stage-shift.ts` eases the stage's colour and weight changes over 200ms (`timerColorShift`);
    - `countdown-ring/RingArcs.tsx` draws the track and the arcs. `countdown-ring/shared.ts` holds the stage weights both files use, and the tones and sizes stay in `CountdownRing.tsx` (review fix: single-use values stay in their file).
  - **Reanimated is told never to skip** the sweep or the stage shift (`ReduceMotion.Never`), as both are `keep`. Its default would jump them to the end under reduced motion.
  - **The critical pulse fades the arcs only,** not the track or the number, as on web.
  - **Reduced motion applies only after a restart.** Reanimated reads the system setting once, at launch, for every component since M04.
  - **Found, not fixed (outside this phase):** `MatchHeader` and `RuleTile` pass `TABULAR_NUMS`, a style object, into `className`. So their numbers aren't tabular. The ring passes it as `style`.
- **Verified on Android, `/dev/ring`:**
  - the live ring sweeps from 15 to 0, with the number matching the arc (9s at about 60%);
  - amber and thicker at 6, red and thickest at 3, and pulsing only when critical;
  - Restart starts it again;
  - frozen holds at 13 while the opponent runs on, and waiting is grey;
  - the opponent's ring stays orange and calm to 0;
  - at 0 no dot is left;
  - both sizes, the static specimens and the turn stickers render.

  With animations off (after a relaunch), the sweep still runs and the critical arc is solid, with no pulse.
- **Verified by the user on iOS (2026-11-22):** `/dev/ring`, a full round through all three stages, Restart, frozen and waiting; with Reduce Motion on after a relaunch, the sweep runs and the pulse is gone.

## History
