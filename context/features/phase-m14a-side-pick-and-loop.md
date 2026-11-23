# Phase M14a — Side Pick & Loop

## Status

Not Started

## Goals

- **Copy list D:** you paste `src/hooks/use-solo-run.ts` from `lineup-web/` to the same path. Claude records it in `context/web-carryover.md`, and changes it only where React Native needs it, recording each change there.
- **`src/lib/practice.ts`, adapted:** the open-run flag moves off `sessionStorage` into the app's memory, so `hasOpenRun` works on a phone and M13c's practise-over-run dialog can ask for real (M14b checks it):
  - `markOpenRun`, `clearOpenRun` and `hasOpenRun` keep their names and signatures;
  - the copied test changes to match, and both changes go in the ledger.
- **`src/components/game/QuitDialog.tsx`:** the web's quit dialog on the kit's `Dialog`:
  - `SOLO_QUIT_COPY` and `DUEL_FORFEIT_COPY` as named exports, with `QuitDialogCopy` from `@/types/quit-dialog`;
  - **Keep playing** first and primary, the confirm second;
  - both are disabled while quitting, and the confirm reads its pending label;
  - Android's back button and a tap on the scrim keep playing. One tap cancels, never a double confirm (`theme.md` § Solo).
- **`src/components/game/SidePickCard.tsx`** and **`side-pick-card/`** (`Tile`, `shared.ts`), in the gate's body:
  - the competition's logo and name, and the date (`matchDateLabel`), over the score;
  - two tiles, home and away: the crest in a round ink frame, and the club's name;
  - each tile slides in from its own side (`sidePickSlide`, dropped under reduced motion). The hover lift has no touch equivalent; the tile's press is the feedback;
  - readers hear "Name Barcelona's starting XI, home side";
  - both tiles are inert while the side is being sent.
- **`GameCanvas`:** the gate's body shows `SidePickCard` for a side pick, sending the side through `onGateAction`. `laterGatePart` drops the side pick and keeps the duel lobby (M17).
- **`src/components/game/SoloGame.tsx`:** the web's `SoloGame`, on Expo Router:
  - the route's params are read once on mount (`searchParamsOf`), as the web snapshots them;
  - it holds `useSoloRun`, `usePlayerDirectory` for suggestions, and the cap line from `useSoloAllowance`;
  - the guess and its clearing (`clearInput`);
  - **quit:** mid-play it opens `QuitDialog` with `soloQuitCopy`; anywhere else it leaves;
  - **the gate's actions in this spec:** `choose`, `retry` (including a failed quit) and `leave`. The rest are M14b.
- **`src/app/(game)/play/solo.tsx`:** renders `SoloGame` in place of M05's `GamePlaceholder`. The duel route keeps the placeholder until M17.
- **Leaving goes back to step 3 of `/play` with the run's choices**, as the web's `backTo('start')`:
  - `playHref` (beside `gameHref` in `src/lib/game-href.ts`, tested) builds the typed href from `playPath`'s parts;
  - the game screen is dismissed onto it, never pushed on top.
- **Android back:** mid-play it opens the quit dialog; anywhere else it leaves (`useGameBack`). The iOS back swipe is already off on the game stack.
- **Until M15:**
  - a finished run shows M11's board: found and missed on the pitch, with the "Built in M15" notice in the rail;
  - that notice gains a **Back to play** button, so the end of a run is never a dead end.

## Mirrors

From the M14 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/app/(game)/play/solo/page.tsx`.
- `src/components/game/SoloGame.tsx`, `SidePickCard.tsx` and `side-pick-card/`, `QuitDialog.tsx`.
- `src/hooks/use-solo-run.ts`, arriving as copy list D.
- `src/lib/solo-run.ts` and `src/lib/practice.ts`, copied in M02.

## Out of Scope

- **The other gates and their actions:** M14b.
  - daily cap, picked match gone, picking refused;
  - practice locked, practice closed;
  - the empty-pool widen.
- **Practice runs end to end:** M14b.
- **The run summary** and its actions: M15.
- **`?state=` on `/play/solo`:** the web's route takes it. Here every canvas state is on `/dev/canvas?state=` (M11), so the route doesn't.

## Notes

- Scope: a timed solo run from the hand-off to its end. Start, pick a side, guess, lose lives to the clock, quit.
- Depends on:
  - M13c: the hand-off and `gameHref`;
  - M11: `GameCanvas` and its gate;
  - M12: sound and haptics, already wired through `useGameSounds`;
  - M10: the input and the suggestions;
  - M04b: `Dialog`.
- **Decisions this spec takes; tell me if you'd rather another way:**
  - **The open-run flag lives in memory,** for the life of the app process, as the web's lives for a tab:
    - a killed app forgets it, and the server's R14 still ends an open run when practice starts;
    - device storage would make every check asynchronous for no gain.
  - **Leaving dismisses the game onto `/play`** rather than pushing `/play`, so Back from Play never returns to a finished run.
- Constraints:
  - **The server is authoritative** (Hard Constraints 1, 9, 11):
    - the clock is drawn from the round's server timestamps, and the client only asks at 0;
    - a life is lost only when the server says so;
    - a name not in the XI costs nothing but time.
  - **The squad is never requested, stored or logged** (Hard Constraint 2). Only revealed players arrive.
  - **Never fail silently on a game action.** A refused or dropped guess shows on the board (the input's statuses and the gate).
  - **The clock keeps running** while the quit dialog is open, and its copy says so.
  - The rest as usual:
    - one component per file and the template;
    - theme roles only;
    - 44pt targets;
    - `style=` only under the three exceptions;
    - reduced motion through `useMotionPolicy`.
- **Your part:** with the backend running, on the iOS Simulator:
  - start a solo run from `/play` and pick a side;
  - name a few players, including one already named and one not in the XI;
  - let a round run out and lose a life;
  - open Quit and choose Keep playing, then quit for real;
  - press Back to play at the end.

  Claude checks Android first, including the back button, and stops when it needs you.
- **Deviations recorded during implementation:**
  - **Copy list D arrived word for word.** `use-solo-run.ts` typechecks unchanged.
  - **The gate actions M14b builds leave for now:** `widen`, `playDuel` and `backToArchive` fall back to Back to play, so no gate button is dead before M14b.
  - **`GameCanvas` takes `onBackToPlay`,** drawn as a secondary button under the "Built in M15" notice. M15 replaces both.
  - **The side pick:**
    - the score is three texts, read as one ("4 to 1");
    - each tile holds two lines for the club's name, so a one-line name's tile is as tall as its neighbour.
  - **`QuitDialog` ignores Back and the scrim while a quit is in flight**, as its buttons do.
  - **`playHref` is the web's `playPath` without the hash:** nothing on a phone scrolls to an anchor.
  - **Other files touched:**
    - `canvas-parts.ts` and its test drop the side pick from the later parts;
    - `GamePlaceholder`'s comment now names only the duel.
  - **Verified on Android:**
    - a real match on the side pick;
    - picking a side, and the round's clock and lives;
    - "anelka" shown as not in the XI, the text kept;
    - "fowler" revealing Robbie Fowler, the next round starting at once;
    - a life lost to the clock;
    - mid-round, Android back opening the quit dialog with the clock running;
    - Back keeping play going, and Quit run ending on the board with Back to play;
    - Back to play landing on step 3 with the Champions League filter kept, and Android back from there stepping to step 2;
    - at 375 × 667, the side pick, the round and the quit dialog. The pitch with Gboard up there is M11b's known small-phone follow-up for M24.
  - **Verified on iOS by the user (2026-11-23):** a run started and a side picked, guesses including a repeat and a name not in the XI, a life lost to the clock, Keep playing then a real quit, and Back to play at the end.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass;
  - the copied `solo-run` and the adapted `practice` tests pass;
  - `playHref` has tests;
  - screenshots on 390 × 844 and 375 × 667: the side pick, a round, the quit dialog, and the end.

## History
