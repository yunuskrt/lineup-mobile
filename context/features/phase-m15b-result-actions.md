# Phase M15b — Result Actions

## Status

Completed

## Goals

- **`src/components/game/ResultActions.tsx`** fills M15a's pinned row. Its layout comes from the copied `resultActionsLayout`, which picks one primary and one secondary:

  | Context | Primary | Secondary |
  | --- | --- | --- |
  | A plain run | Play again | Change filters |
  | Today's fifth run (capped) | Play a duel | Back to play |
  | A picked match | Play it again | Back to the archive |
  | Practice | Practise again | Back to play (Back to the archive if picked) |
  | A room game (M18) | New room | Back to play |
  | A room game, Free, split on (M18) | Back to play | New room, locked: "Pro hosts rooms." |

  - The cap line ("You've played your 5 solo runs today…") sits above the buttons when capped.
  - **The two buttons sit side by side,** primary first, as the sketch's `[Play again] [Change filters]`:
    - large (56pt) normally, default (44pt) on a short screen, as M13c's shared Start row;
    - a label never wraps or truncates. If a pair doesn't fit at 375pt, that pair stacks and the deviation is recorded.
  - The locked New room uses M13a's `ProLockButton` and `ProLockCaption`. Its `isPending` state shows no caption.
  - `ResultActionsProps` is exported for M18's `DuelResultPanel`.
- **`GameCanvas`:**
  - takes `onPlayAgain`, `onChangeFilters` and `onPlayDuel`, and passes them with `onBackToPlay` to `ResultActions`;
  - `onBackToPlay` loses its "until M15" comment and becomes the secondary Back to play;
  - the "Built in M15b" placeholder goes, and `laterRailPart` names only the duel result (M18). Its tests follow.
- **`SoloGame` wires each action:**
  - **Play again, Play it again and Practise again:** clear the guess, then `useSoloRun`'s `playAgain`. The run restarts in place, on the same route and params, so a picked match and practice carry over. A refused restart (the cap reached meanwhile) shows M14b's gate;
  - **Change filters:** `/play` step 2 with this run's choices (`playHref(…, 'filters')`, through `router.dismissTo`). For a picked match, the Archive tab instead, as the web's;
  - **Back to play:** the existing `leave()` (step 3);
  - **Play a duel:** the existing `playDuel()`;
  - **Back to the archive:** the existing `backToArchive()`.
- **The fifth run's summary shows Play a duel.** The allowance must be fresh when the summary shows:
  - check that `useSoloAllowance` refetches once a run ends;
  - if it doesn't, invalidate it on the summary, and record the change.
- **Android's back button on the summary** leaves to step 3, as now (`useGameBack` → `leave`). A finished run has nothing to confirm.
- **`/dev/canvas/solo`:** the actions are no-ops in the preview, as on web, and every row of the table above that solo can reach renders: `run-over`, `run-over-capped`, `run-over-picked` and `practice-summary` (with a picked variant if the samples allow one).

## Mirrors

From the M15 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/ResultActions.tsx` (`PRIMARY_LABELS`, `SECONDARY_LABELS`, the locked New room).
- `src/lib/result-actions.ts`, already copied with its test.
- `src/components/game/SoloGame.tsx` (`handlePlayAgain`, `onChangeFilters`, `backTo`).
- `src/components/game/GameCanvas.tsx`, for the props it passes to `RunSummary`.
- `context/theme.md` § Solo (daily cap, picked match, practice) and § Play setup (Entry links: Back to play opens step 3, Change filters step 2).

## Out of Scope

- **The duel's result panel** and its New room, Play again and Back to play: M18. `ResultActions` supports them, but only solo uses it here.
- **The archive** that sends a picked match: M20. A `?match=` link stands in for it.
- **Sharing a result:** deferred in `todo.md`.

## Notes

- Scope: every way out of a finished solo run.
- Depends on: M15a (`RunSummary`, the pinned row) and M14 (`SoloGame`, `playAgain`, `leave`, `playDuel`, `backToArchive`, `playHref`).
- Constraints:
  - **The cap is the server's** (Hard Constraints 15 and 16). The client reads the allowance and never counts runs itself.
  - **Free duels are never capped,** so Play a duel is always open.
  - **Never a dead end** (`theme.md` § Solo): every summary offers a next run or a way back.
  - **With the switch off,** no lock, no cap line and no word "Pro" appear.
  - Play again restarts the run **in place**, not by a new push, so the game stack never grows a run per replay.
- **The Pro switch is off locally,** so the capped and locked rows are checked on `/dev/canvas`.
- **Your part:** with the backend running, on the iOS Simulator:
  - end a run, tap Play again, and play a second run;
  - end one and tap Change filters, which opens step 2 with the choices kept;
  - end a practice run and tap Practise again, which starts another practice run;
  - open `lineup://play/solo?match=<a real id>`, end it, and try Play it again and Back to the archive.
- Verification (Claude, Android emulator):
  - the same four flows, and Android's back button on a summary;
  - the dev states at 390 × 844 and 375 × 667, checking that no label wraps;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

**Deviations recorded during implementation**

- **The allowance needed no change:** `useSoloRun` already calls `refreshSoloAllowance` when the summary arrives (and on the side pick), so the fifth run's summary reads a fresh count.
- **The archive pair stacks:** "Back to the archive" wraps beside "Play it again" at 390pt in large, so with that secondary the two buttons stack full width, primary on top. It's a rule on the layout (`secondary === 'backToArchive'`), not a measurement. Every other pair fits side by side at 390 × 844 and 375 × 667.
- **`RunSummary` takes `ResultActionsProps`** in place of M15a's `actions` slot, and renders `ResultActions` in its pinned row.
- **`LATER_SUMMARY_ACTIONS` was removed** with the placeholder. `laterRailPart` already named only the duel result, after M15a.
- **The locked New room puts its caption and See Pro under the row,** not in the half-width cell. M18 checks it.

**Follow-ups**

- A `lineup://play/solo?…` link opened over a game in progress doesn't replace it: `SoloGame` reads its params once (M14). It came up in testing, not in play; the archive (M20) opens games from the tabs.
- "Paris Saint-G ermain" breaks mid-word on the side pick tile too, with M15a's pitch-label note for M24.

- **Verified on Android (Claude, 2026-11-23):**
  - Play again on a Galatasaray run opened a new side pick on the same screen (Porto–Benfica);
  - Change filters opened `/play` step 2 with Solo kept;
  - a practice run (Kane named, 27.0s) ended, and Practise again opened another practice run;
  - a picked PSG–Arsenal final: Play it again reopened the same match, and Back to the archive opened the Archive tab;
  - Android's back button on a summary opened step 3;
  - the dev states `run-over`, `run-over-capped`, `run-over-picked` and `practice-summary` at 390 × 844 and 375 × 667, with no label wrapping.
- **Verified on iOS by the user (2026-11-23):** Play again into a second run, Change filters on step 2 with the choices kept, Practise again, and Play it again and Back to the archive on the picked PSG–Arsenal final.

## History
