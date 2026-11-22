# Phase M10b — Feedback & Reveal

## Status

Not Started

## Goals

- **`src/components/game/FeedbackToast.tsx`:** the verdict line, from a `ToastMessage` (copied type):
  - "Already named" or "Not in this XI" (the copied `FEEDBACK_MESSAGES`) on a white chip with an ink outline and the small hard shadow;
  - it rises 4pt (`toastRise`, dropped under reduced motion) and fades in, holds, and fades out over 1.6s (`toastVisible`, `toastFade` kept);
  - a fixed-height slot, so nothing shifts when it comes and goes;
  - a screen reader hears it once, and the faded text doesn't linger.
- **`src/components/pitch/RevealCard.tsx`:** the filled slot when a player is found:
  - **new:**
    - it fades in and springs from 0.85 to full size (`REVEAL_SPRING`, `revealSpring` dropped under reduced motion);
    - a flash in the finder's colour (`reveal-flash-you` or `reveal-flash-opponent`) at 40%, fading after the reveal (`revealFlash`, kept);
  - **already there** when the grid mounts (a snapshot): no animation;
  - **pulse:** when its `pulseKey` changes ("Already named"), an umber pulse (`already-found-pulse`) fades in and out once over 480ms (`alreadyFoundPulse`, kept).
- **The grid wiring (M08a's note: M10 swaps in the reveal card):**
  - `SquadSlot` takes a `backdrop` behind the filled disc, as on web;
  - `GridSlot` shows the `RevealCard` for a filled slot;
  - `SquadGrid` takes `pulse` (a copied `GridPulse`). It works out which players are new since the last render, as the web's grid does: anything present when loading ends, or on mount, is a snapshot.
- **`/dev/feedback`** (`src/app/dev/feedback.tsx`), from the web's `FeedbackPreview`:
  - the outcome buttons send a guess through the copied `guessFeedback` and `applyFeedback`;
  - "Already named" pulses a found slot on the grid and shows the toast;
  - "Not in this XI" shakes the input (M10a) and shows the toast;
  - a correct guess reveals the next slot;
  - the grid, the toast and the input are stacked as the board will stack them;
  - a `?section=` filter.
- **`/dev/reveal`** (`src/app/dev/reveal.tsx`), from the web's `RevealPreview`:
  - formation buttons;
  - You reveal next, Opponent reveals next, Reveal two at once, Mount with 5 revealed (no animation) and Reset;
  - the "N / 11 named" count.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/FeedbackToast.tsx`.
- `src/components/pitch/RevealCard.tsx`, and `SquadGrid.tsx` and `squad-grid/GridSlot.tsx` (the new-player and pulse wiring).
- `src/lib/feedback.ts` (copied, with tests): the messages, `guessFeedback` and `applyFeedback`.
- `src/styles/motion.ts` (copied): `REVEAL_SPRING`, `toastVisible`, `alreadyFoundPulse`, `reveal`.
- `src/components/dev/FeedbackPreview.tsx`, `RevealPreview.tsx`, `src/app/dev/feedback/` and `src/app/dev/reveal/`.

No copy list.

## Out of Scope

- The board around them: the toast's place above the band, the found count and the named order (M11).
- The missed slots' staggered reveal after a run (M15).
- Sounds and haptics for each verdict (M12).

## Notes

- Scope: the two verdict channels and the reveal, on dev pages. Not wired to a game.
- Depends on: M10a (the input's shake on `/dev/feedback`), M08a (`SquadGrid`, `SquadSlot`).
- Constraints:
  - **The two no-penalty verdicts are told apart at once** (`theme.md` § States): already-found speaks through the grid (the pulse), and not-in-XI through the input (the shake). The toast says it in words for both.
  - **State is server-pushed:** a slot reveals only when it's given a found player. The client never infers one (Hard Constraint 2).
  - **In a duel, a found player is marked with the finder's colour:** the flash and the label say who.
  - **Reduced motion** drops the spring and the toast's rise. The fade, the flash and the pulse stay, as they carry information.
  - Theme roles only, and `style=` only for Reanimated and run-time sizes. One component per file, and the template.
- **Your part:** on the iOS Simulator, open `lineup://dev/feedback` and `lineup://dev/reveal`, try each button, and repeat with Reduce Motion on (relaunch after switching it). Claude checks Android and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: the new-player rule if it moves into a pure helper. The copied `feedback.test.ts` keeps passing.
  - On both simulators:
    - `/dev/feedback`:
      - "Already named" pulses one found slot and shows its toast, with no shake;
      - "Not in this XI" shakes the input and shows its toast, with no pulse;
    - `/dev/reveal`:
      - a reveal springs in with a blue or orange flash by finder, and two reveal at once;
      - Mount with 5 shows them with no animation;
    - with reduced motion, there's no spring and no rise, but the flash, the pulse and the fades remain.

## History
