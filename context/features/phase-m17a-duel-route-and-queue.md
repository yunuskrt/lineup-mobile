# Phase M17a — Duel Route & Queue

## Status

Completed

## Goals

- **Copy list F** (you paste it): `lineup-web/src/hooks/use-duel.ts` into `src/hooks/use-duel.ts`, word for word, with a "Copy list F" section in `context/web-carryover.md`. It runs on the M16 socket client and the copied `duel-session.ts` reducer.
- **`src/components/game/DuelGame.tsx`,** rebuilt from the web's on `GameCanvas`. The route's params are a `useState` snapshot, as `SoloGame`'s, and these are wired:
  - **the lobby actions** (`LobbyAction`):
    - `cancel` goes back to `/play` step 3, with the mode and filters kept;
    - `lock` locks in your filters;
    - `solo` replaces the duel with `/play/solo` on the same filters;
    - `searchAgain` re-enters the queue;
  - **the gate actions** (`duelGateAction`): `widen` (an empty pool: the filters widen and the params follow), `leave`, `retry` and `playAgain`;
  - **leaving:** the duel's `leave()` runs first, then `router.dismissTo` back to `/play` with the choices kept, as `SoloGame`'s exits do;
  - **the forfeit dialog** (M14a's `QuitDialog` with `DUEL_FORFEIT_COPY`), from the quit chip and Android's back button (`useGameBack`), once a match is running. This is brought forward from M18 (see Notes);
  - **outside a match,** quit and Back simply leave: the lobby has nothing to forfeit.
- **`src/app/(game)/play/duel.tsx`** renders `DuelGame`. `GamePlaceholder` is then unused and is deleted.
- **`src/components/duel/LobbyPanel.tsx`** fills the gate for the queue's steps, replacing M11's "Built in M17" notice. Its parts go in `src/components/duel/lobby-panel/`:
  - **`Searching`:** an ambient wait, with no clock (`theme.md` § Lobby). It shows your mark, the opponent's dim mark breathing (still under reduced motion), and Cancel. `joining` reuses it until M17b;
  - **`Paired`:** the two player cards, in the duel colours, with a VS sticker between them, stacked: you, VS, the opponent;
  - **`Filters`:** your card (a summary of your filters, then Lock in filters, or a Locked in sticker) and theirs ("Hidden until the coin flip.", then Choosing… or Locked in). Each lock is announced to screen readers;
  - **`CoinFlip`:** the winner's card, "Your filters" or "{handle}'s filters", with a Used sticker and the applied filters. Both marks stay, and the winner's leads. It scales in, or only fades under reduced motion;
  - **`NoOpponent`:** Play solo with these filters, and Search again. Never a dead end;
  - shared pieces `ActorBar`, `PlayerCard`, `FilterCard`, `LockedIn`, `SummaryList`, and `styles.ts` (`CARD`, `ACTIONS`, `STATUS_ROW`).
- **`GameCanvas`:**
  - takes `onLobbyAction` and renders `LobbyPanel` in the gate for a lobby view;
  - `laterGatePart` stops naming the lobby, and its tests follow;
  - the gate sizes stay `canvas-parts`' `LOBBY_GATE_SIZE`, which already mirrors the web's.
- **A refused protocol** (`state.phase === 'refused'`) shows a holding gate until M21 builds the update screen. It reads "This version of Lineup is out of date. Update to keep playing." over a "Built in M21" notice, with Back to play.
- **`/dev/canvas/duel`:** these lobby states render with the real panel: `searching`, `paired`, `filters`, `filters-locked`, `filters-both`, `coin-flip-won`, `coin-flip-lost` and `no-opponent`. Lobby actions are no-ops there.

## Mirrors

From the M17 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- Copy list F: `src/hooks/use-duel.ts`.
- `src/components/duel/LobbyPanel.tsx` and `lobby-panel/` (`Searching`, `Paired`, `PlayerCard`, `Filters`, `FilterCard`, `LockedIn`, `CoinFlip`, `NoOpponent`, `ActorBar`, `SummaryList`, `styles.ts`).
- `src/components/game/DuelGame.tsx` and `src/app/(game)/play/duel/page.tsx`, for the actions and the refused branch.
- `src/lib/lobby.ts` and `src/lib/duel-session.ts`, already copied.
- `context/theme.md` § Lobby & matchmaking, and § Duel for the forfeit dialog.
- `context/design-mobile.md` § 6, LOBBY (the Searching column, the VS row, and the coin flip named in a sticker).

## Out of Scope

- **Rooms:** waiting with a code, Copy and Share, closes-in, joining, refusals and expiry. That is M17b.
- **The duel's play, beyond what the M11 canvas already draws:** their turn, the drop and resume overlays, and the result panel with its replay actions are M18.
- **The update-required screen** with its store link: M21.

## Notes

- Scope: `/play/duel` as a real route, from Find an opponent to a running match, plus the way out at every step.
- Depends on: M16 (the registered socket client), M13c (Find an opponent's hand-off), M11 (`GameCanvas`, the gate, the duel view, the dev lobby states), M14a (`QuitDialog`, `useGameBack`) and copy list A (`duel-session.ts`, `lobby.ts`).
- **Brought forward from M18:** the forfeit dialog and Android Back. `DuelGame` is one component on the web, and a running match with no confirmed way out would be a trap. M18 keeps the overlays, their turn and the result.
- Constraints:
  - **The server is authoritative** (Hard Constraints 1, 7 and 19). The pairing, the coin flip and whose filters apply all come from server events. The client never picks a winner or merges filters.
  - **Name whose filters won, explicitly** (`theme.md` § Lobby). Without it, the player whose filters lost assumes the app ignored them.
  - **No countdown clock in the lobby:** the clock means you're losing time.
  - **Nothing purchasable affects a duel** (Hard Constraint 15), and free duels are never capped.
  - **Never a dead end:** every lobby step and gate has a way on.
  - You are blue and the opponent orange, always named by label as well as colour.
  - The component template, one component per file, and parts in `lobby-panel/` with a sibling `styles.ts`.
- **Your part:**
  1. **Copy list F.** Paste `lineup-web/src/hooks/use-duel.ts` into `src/hooks/use-duel.ts`, then tell me.
  2. **With the backend and the web running,** on the iOS Simulator: Play → Duel → Find an opponent while a browser at `localhost:3000` does the same. Then pair, lock in, watch the coin flip, and play into the match. Also try Cancel while searching, and the forfeit dialog mid-match.
- Verification (Claude, Android emulator):
  - **against M16's Node opponent:** search, pair, lock in, the coin flip naming the winner, and the match starting on the board;
  - Cancel while searching, which returns to step 3 with the choices kept;
  - the forfeit dialog from the quit chip and from Android Back;
  - the no-opponent step after the queue's 60-second timeout, and Play solo with these filters;
  - the lobby dev states at 390 × 844 and 375 × 667;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

**Deviations recorded during implementation**

- **The refused-protocol hold uses the web's `ProtocolRefused` copy:** "Update Lineup to keep playing" and "This version is out of date, so the duel server turned it away." It replaces the line written above, over the "Built in M21" notice, with Back to play (`duel-game/ProtocolHold.tsx`).
- **`laterGatePart` now names the room steps (`roomWaiting`, `roomExpired`) as M17b's,** in place of the whole lobby. `LobbyPanel` returns nothing for those two until M17b.
- **The lobby's actor classes** (`ACTOR_BAR`, `ACTOR_BG`, `ACTOR_TEXT`) live in `lobby-panel/styles.ts`, beside `CARD`, `ACTIONS` and `STATUS_ROW`. The web keeps them in `styles/classes.ts`.
- **Lock in filters is a 44pt button,** not the web's 32pt one (the targets rule). `STATUS_ROW` matches that height, so locking in never shifts the card.
- **The VS sticker sits in an extra box:** the kit's `Badge` aligns itself to the start, which overrode the row's centring.
- **A result away goes to the Profile tab** (`handleGateSecondaryAction`, as the web's), through `router.dismissTo('/profile')`.

**Follow-ups**

- **At 375 × 667, the Filters step nearly fills the gate,** which doesn't scroll. A very long filter summary could overflow it; for M24.
- **The coin flip's card shows only briefly** before `matchReady` replaces it, as on the web. It was checked on the dev states.
- **`duel-session.ts` has no tests in this repo:** its web test runs against the mock adapter, so copy list A left it out. A reducer test built on the dev states' samples is suggested before M18, which leans on it most.

- **Verified on Android (Claude, 2026-11-23), against M16's Node opponent:**
  - **a full match:** search, pair, the opponent locked in, Lock in filters ("Locking in…"), the coin flip, then the board (Man Utd–Spurs) through to the end, which shows M18's result notice;
  - Back to play from that notice opened step 3 with Duel kept;
  - Cancel while searching opened step 3 with the choices kept;
  - **the forfeit dialog:** from Android Back and from the quit chip; Keep playing closed it, and Forfeit gave the opponent `forfeit_win`;
  - no opponent after 60 seconds, then Play solo with these filters opened a solo side pick;
  - the 7 lobby dev states at 390 × 844, and paired, filters and the coin flip at 375 × 667.
- **Verified on iOS by the user (2026-11-23):** a full duel against a browser at `localhost:3000` (search, pair, lock in, the coin flip, guesses and reveals both ways), Cancel while searching, and the forfeit dialog from the quit chip.

## History
