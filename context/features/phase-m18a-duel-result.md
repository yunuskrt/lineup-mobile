# Phase M18a — Duel Result

## Status

Completed

## Goals

- **`src/components/game/DuelResultPanel.tsx`** replaces the "Built in M18: the duel result." notice once a duel ends (`view.end` set). It renders, in order:
  - **`duel-result-panel/Outcome.tsx`:**
    - the title and the line, from the copied `duel-result.ts` (`duelResultTitle`, `duelResultDetail`): You won, You lost, Draw, You left, Opponent left, and the connection-lost forms;
    - **the tones** (`theme.md` § Duel — terminal): a win or forfeit win fills the block in your colour, edge to edge. A loss is a neutral card with a thin danger band on top. A draw carries both colours in a split band, neither leading;
    - a **Forfeit** sticker when the result says `isForfeit`;
  - **`duel-result-panel/Tally.tsx`:** two halves split by a 2pt ink rule, "You named" and "{handle} named". Each half has its actor bar, the count (`foundTally`) and that player's lives;
  - **`NamedOrder` in duel mode,** built in M15a and checked now: each row has the finder's colour bar and name, with no fastest mark and no Total.
- **The end layout, shared with the solo summary:** the board stays, the turf shrinks (M15a's 40%, or 30% on a short screen), the panel scrolls, and `ResultActions` sits in the pinned row. If both panels would repeat the scroll-and-pinned-row frame, it moves into one shared piece, and the deviation is recorded.
- **`ResultActions` for a duel,** with the layouts M15b already holds:
  - **a queue duel:** Play again, and Change filters;
  - **a room duel:** New room, and Back to play;
  - **a room duel, Free, with the switch on:** Back to play, and New room locked with "Pro hosts rooms." and See Pro (`hostAccess` from `useProAccess`, as M17a passes).
- **The actions are wired in `DuelGame`** (M17a passes most of them already):
  - **Play again:** `playAgain()` re-enters the queue on the same filters; the route's params follow;
  - **New room:** `newRoom()` opens a new room on the creator's filters; the params follow;
  - **Change filters:** `/play` step 2;
  - **Back to play:** `/play` step 3.
- **The result's sounds and haptics** (M12): `resultWin`, `resultDraw` and `resultLoss` play once as the panel appears, with their haptics, through the existing `useGameSounds`. This is checked, not rebuilt.
- **`canvas-parts`:** `laterRailPart` now names nothing, and is removed along with `laterPartLine` and the M18 notice, if nothing else uses them. Their tests go with them.
- **Screen readers:** once the panel appears, focus moves to the title, as M15a's summary does.
- **`/dev/canvas/duel`:** these result states render with the real panel: `result-win`, `result-loss`, `result-draw`, `result-forfeit-win`, `result-forfeit-loss`, `connection-lost`, `room-result` and `room-result-free`.

## Mirrors

From the M18 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/DuelResultPanel.tsx` and `duel-result-panel/` (`Outcome`, `Tally`).
- `src/components/game/DuelGame.tsx` (`handlePlayAgain`, `follow`, `changeFilters`, `backToPlay`).
- `src/lib/duel-result.ts`, already copied (`duelResultTitle`, `duelResultDetail`, `foundTally`).
- `context/docs/w31-manual-testing.md` Part 5 (forfeit, draw, out of lives) for the endings and their copy.
- `context/theme.md` § Duel — terminal (win, loss, draw, forfeit win).

## Out of Scope

- **The drop and resume flows,** checked end to end (yours, the opponent's, away too long, a drop in the lobby) and the reducer test: M18b.
- **Profile history,** where a duel is listed: M19. A result decided away goes to the Profile tab, which M17a wired.

## Notes

- Scope: every way a duel ends, and every way on from it.
- **Already done:** `todo.md`'s "forfeit on back" for M18 was built in M17a (the forfeit dialog from the quit chip and Android Back). Their turn was drawn in M11 (the clock in their colour, the board read-only, the keyboard dropped).
- Depends on: M17a (`DuelGame`, the forfeit dialog), M17b (rooms, for New room), M15a (the end layout, `NamedOrder`), M15b (`ResultActions`) and M12 (the result cues).
- Constraints:
  - **The server decides the result** (Hard Constraints 1 and 18). An all-11 draw is the server's `draw`, and lives are never a tiebreak. The client renders `DuelResult` as it arrives.
  - **Never hide the answers from the loser:** the pitch keeps every found player, and a loss reads as plainly as a win.
  - **Forfeit wins don't count toward streaks;** the server records that. The panel only marks the forfeit.
  - **You are blue, the opponent orange,** named by label as well as colour, and never red against green.
  - **A draw is rare, and should feel like it:** both colours, neither leading.
  - The component template, one component per file, and parts in `duel-result-panel/`.
- **Your part:** with the backend and the web running, on the iOS Simulator, play duels against a browser at `localhost:3000` to each ending:
  - **out of lives:** type nothing, about 80 seconds;
  - **forfeit:** from each side;
  - **a draw:** name all 11, alternating;
  - **then:** Play again from both, and New room after a room game.
- Verification (Claude, Android emulator):
  - **against the Node opponent:** out of lives both ways (the script idles; the phone guesses or idles), a forfeit both ways, then Play again and New room;
  - the result dev states at 390 × 844 and 375 × 667;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Deviations recorded during implementation:**
  - **The shared frame is `ResultFrame`** (`src/components/game/ResultFrame.tsx`): the scroll over a pinned, inset-cleared row. `RunSummary` and `DuelResultPanel` both use it. `OUTCOME_BOX` and `SUMMARY_SECTION` moved from `run-summary/styles.ts` to `game/styles.ts`, as two parents now use them.
  - **The title focus is a hook,** `useMountFocus` (`src/hooks/use-mount-focus.ts`), taken out of M15a's `Outcome` so both outcomes share it.
  - **`laterPartLine` stays:** `ProtocolHold` still uses it for M21's notice. Only `laterRailPart` and the M18 notice went, and the test now uses the M21 line.
  - **The room result dev states were rebuilt** (`roomResultState` over `resultState`): the web's had no session, so the header and pitch stayed loading. It is recorded as an adapted copy in the ledger.
  - **The Tally reads each side aloud as one item** ("You named 2"), and the lives say whose they are (`whose`), as the rail's do.
  - **Loss and draw cards are `surface-card` white,** as the web's, on the cream rail.
  - **`ACTOR_BAR` and `ACTOR_BG` are a third local copy** (`duel-result-panel/styles.ts`), beside the lobby panel's and the mode choice's. That follows the existing pattern rather than a wider refactor; folding them into `styles/classes.ts` is left as a follow-up.
- **Checked (Claude, Android emulator, 2026-11-24):**
  - **the 8 result dev states** at 390 × 844, and three of them (forfeit win, the Free room result, draw) at 375 × 667. At 375 the panel scrolls under the pinned row, and the small pitch is the known M24 item;
  - **live against the Node opponent:**
    - its forfeit gave "Opponent left" with the sticker;
    - running out of lives gave "You won" once and "You lost" once;
    - a forfeit from the phone gave "You left";
    - Play again re-entered the queue three times;
    - Change filters landed on step 2 with Duel kept;
    - after a room game, New room opened a fresh room (FNVRQN, then AFXM3M).
  - The opponent script gained `FORFEIT_AT=<seconds>` (scratchpad only) to forfeit after `matchReady`.
- **Tests (`/feature test`):** `src/lib/dev/room-result-states.test.ts`, this repo's own, beside the copied `canvas-states.test.ts`. It checks that both room result states draw the board with its match and no gate, that they are room games, that the pitch shows the result's finds, and that a queue result stays public. Two of its cases fail against the old states.
- **Verified on iOS by the user (2026-11-24):** against a browser at `localhost:3000`: out of lives, a forfeit from each side, a draw with all 11 named, Play again from both, and New room after a room game.
- **Follow-ups:**
  - Fold the three `ACTOR_BAR` / `ACTOR_BG` copies (lobby panel, mode choice, result panel) into `src/styles/classes.ts`, as the web's `ACTOR_BAR` and `DUEL_ACTOR_BG`.

## History
