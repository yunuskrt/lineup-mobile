# Phase M18b — Drops & Resume

## Status

Completed

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
- **Deviations recorded during implementation:**
  - **The reducer test has 49 cases** (45, then 4 more of the web's drop cases at review). Its sessions and results are built from `samples.ts` (`samplePlayer`, `SAMPLE_MATCH`, the sample players), not from `canvas-states.ts`, whose builders aren't exported. Breaking two lines of the reducer on purpose (the requeue after a drop, and which side's life flashes) failed two of its cases.
  - **Background past 20 seconds on Android doesn't forfeit.** The server never saw a drop: Android froze the app with its socket still open, so the duel played on by the clock, with lives lost on both sides. On return the buffered events replayed over about 3 seconds, then the server's result showed ("You lost", then "You won" on the next run). That is the server's answer rendered, as the coding standards ask; "you left" needs the server to see a drop, which is your iOS check.
  - **Fixed: the keyboard over the result.** Back from the background on your turn, Android raised the keyboard over the result for about 3 seconds. `GameCanvas` now dismisses it when a game ends, as `CanvasGate` does for a gate. A re-run showed the result with no keyboard.
  - **The away and called-off dev states were added,** as the web had none: `connection-closed`, `ended-away`, `ended-away-found` and `called-off`. Each is built by feeding `duelSessionReducer` the events a drop brings, so it shows what the app does. They are recorded as an adapted copy.
  - **The dev canvas page builds in server time** (`serverClock.now()`, not `Date.now()`). The emulator's clock runs 19 seconds slow, so a deadline 18 seconds out read 0s, and the clocks read 0.
  - **No change to the copied `use-duel.ts` or `duel-session.ts`:** the reducer test and the live flows found nothing wrong in them.
- **Checked (Claude, Android emulator, 2026-11-24):**
  - **the opponent's drop:** the script killed mid-duel gave "Reconnecting, 16s" by their lives and "…is reconnecting. Their clock keeps running." under the rail, then "Opponent left" with the Forfeit sticker;
  - **background briefly (6 seconds):** the board came back as it was, with the clock having run on (11s to 4s), and no gate;
  - **background past 20 seconds:** as the deviation above;
  - **the dev states:** `you-reconnecting`, `opponent-reconnecting`, `connection-closed`, `ended-away`, `ended-away-found` and `called-off` at 390 × 844 and 375 × 667.
- **Tests (`/feature test`):** `src/lib/dev/drop-states.test.ts`, this repo's own, beside the copied `canvas-states.test.ts`. Its 5 cases check what each drop dev state shows: the closed gate with Try again, the away gate while checking and once found, the called-off gate, and both reconnecting countdowns.
- **Verified on iOS by the user (2026-11-24):** against a browser at `localhost:3000`: your drop (Wi-Fi off briefly, then past 20 seconds, then Try again), the opponent's drop (the browser tab closed), the app in the background, and a backend restart.
  - **Past 20 seconds in the background, the duel played on,** as on Android: the socket stayed open, so the clock ran and lives were lost.
  - **Quitting the app** (swiped away in the app switcher) closed the socket, and the result was "You left": the server's forfeit after its window. So "you left" comes from a real disconnect, never from the background alone.
- **Follow-ups:**
  - **On return from a long background on Android, the board is stale for about 3 seconds** while buffered events replay, and its input looks live. A guess sent then is refused with a toast, not lost silently. A "Catching up…" state on return is a design call (M21 or M24).
  - **The rail behind the away gate still shows "Your turn"** (`clockLabel` with no turn). It's hidden behind the gate; it would be worth a look in M24.

## History
