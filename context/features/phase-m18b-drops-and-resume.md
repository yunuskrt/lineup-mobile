# Phase M18b — Drops & Resume

## Status

Not Started

## Goals

- **`src/lib/duel-session.test.ts`,** this repo's own test of the copied reducer. The web's test runs against its mock adapter, which carries the rules, so copy list A left it out (M17a follow-up). This test drives `duelSessionReducer` with plain events built from the dev samples (`src/lib/dev/canvas-states.ts`, `samples.ts`), never with a mock or a copy of the rules. It covers:
  - **the lobby path:** queued, paired, filters, the coin flip, then `matchReady`;
  - **a round:** `roundStarted`, the three `guessResolved` verdicts (new, already found, not in the XI), `lifeLost` for each side, and `turnChanged`;
  - **drops:** `connectionDropped` with its deadline, `connectionRestored`, the opponent's `reconnecting` then `connected`, and `disconnected`;
  - **endings:** `finished` for each outcome, a forfeit, a close (`closed`) that becomes `connectionLost` once the result arrives, and the duel ending while you were away;
  - **refusals:** `protocol_refused` becomes `refused`, and a refused join keeps its code (`keepsJoinCode`);
  - **the canvas view for each of those** (`duelCanvasView`): the gate, the lobby step, the turn, and the input's status.
- **Your connection drops mid-duel:** the M11 gate shows "Reconnecting", says the clock keeps running, and counts down to the forfeit, with the input locked. On return within the window, the gate clears and the board shows the server's state, the right turn and lives.
- **The opponent drops:** the reconnect chip by their lives counts down from 20 seconds, and says their clock keeps running. On their return it clears; after 20 seconds the result is "Opponent left".
- **Away too long:** the gate becomes "Duel connection closed" with Try again. Try again shows "The duel ended while you were away", "Checking the result…", then the result line with Play again and View profile (to the Profile tab).
- **Drops in the lobby:**
  - **while searching:** the search goes on and rejoins the queue by itself;
  - **during filters:** both sides see "The match was called off", with Search again.
- **The app in the background mid-duel,** on both platforms, now that the board renders the server's answer on return (M16's measurement): briefly, the board returns as it was; past 20 seconds, the result says you left.
- **Any defect these flows show is fixed here.** A fix in the copied `use-duel.ts` or `duel-session.ts` becomes an adapted copy in the ledger.
- **`/dev/canvas/duel`:** `you-reconnecting`, `opponent-reconnecting`, the away gate and the called-off gate render, checked at 390 × 844 and 375 × 667.

## Mirrors

From the M18 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `context/docs/w31-manual-testing.md` Parts 3, 4, 6, 7, 8 and 9 (reload, your drop, away too long, lobby drops, the opponent leaving, a backend restart), which these checks follow on a phone.
- `src/lib/duel-session.ts` and `src/lib/duel-status.ts`, already copied; `src/lib/duel-session.test.ts`, for the cases, never for its mock.
- `src/components/game/ReconnectChip.tsx` and `Tally.tsx`, already rebuilt in M09b.
- `context/theme.md` § Duel — their turn (opponent disconnected, forfeited) and § System (you reconnecting, connection lost).

## Out of Scope

- **The update-required screen:** M21.
- **A rate-limited guess:** M21's system states.
- **Redis-backed resume across backend instances:** a backend matter; the local backend is single-instance.

## Notes

- Scope: every drop a phone meets mid-duel or in the lobby, proven against the real backend, plus the missing reducer test.
- Depends on: M18a (the result panel), M17 (the lobby), M16 (reconnects, background) and M11 (the reconnect gate, the chip).
- Constraints:
  - **No game logic and no mock** (Hard Constraint 7). The test feeds the reducer what the server would send; it never decides an outcome.
  - **The server owns the reconnect window** (about 20 seconds) and the forfeit. The client renders its countdown from the server's deadline, and never decides a forfeit.
  - **Their clock keeps running** while they reconnect, and the screen says so, or it reads as a freeze.
  - **Never fail silently:** a closed connection always ends at a gate with a way on.
- **Dropping a connection on the emulator:** the `adb reverse` tunnel survives airplane mode (M16), so a drop is made by stopping the opponent script, or by stopping the backend (your step).
- **Your part:** with the backend and the web running, on the iOS Simulator against a browser:
  - **your drop:** toggle the Mac's Wi-Fi off and on mid-duel (the Simulator shares it), first briefly, then past 20 seconds, then Try again;
  - **the opponent's drop:** close the browser's duel tab mid-duel;
  - **background:** send the app to the background mid-duel, briefly and then past 20 seconds;
  - **a backend restart:** stop and start the backend mid-duel.
- Verification (Claude, Android emulator):
  - **the reducer test,** passing;
  - **the opponent's drop:** the script killed mid-duel, so the chip counts down and the result is "Opponent left";
  - **background on Android:** briefly, and past 20 seconds;
  - the dev states at both sizes;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

## History
