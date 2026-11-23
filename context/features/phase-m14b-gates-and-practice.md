# Phase M14b — Gates & Practice

## Status

Not Started

## Goals

- **`SoloGame`'s gate actions, the rest of them** (`soloGateAction`):
  - **`widen`:** `useSoloRun`'s `widen` restarts on the widened filters. The route's params follow (`router.setParams`), as the web's `router.replace`;
  - **`playDuel`:** to `/play/duel` with the filters only. The picked match, practice and mode are dropped, as the web's `playDuel`. It uses M13c's `gameHref`;
  - **`backToArchive`:** to the Archive tab;
  - the secondary action (**Back to play**) and **See Pro**, as M11's `GateAction` already draws them.
- **Every solo gate, reached and checked:**

  | Gate | Trigger | Actions |
  | --- | --- | --- |
  | Daily cap | Free, 5 runs today | The cap line, Play a duel, Back to play, See Pro |
  | Picking refused | Free with a `?match=` link | "A random match from your filters is still free.", Back to play, See Pro |
  | Match gone | A picked match no longer in the game | Back to the archive |
  | Practice locked | Free with a practice link | "A timed run from your filters is still free.", Back to play, See Pro |
  | Practice closed | 30 idle minutes | Back to play |
  | Empty pool | No match passes both gates | Names the filter, widens it, or Back to filters |
  | A failed step | find, choose, guess, sync, quit or summary fails | Its title, Try again |

- **Practice runs end to end** (`?practice=1`, Pro, or everyone while the switch is off):
  - M11's practice panel replaces the clock and the lives, from the side pick on;
  - no clock or whistle sounds play, and the guess cues still do;
  - Quit asks with `PRACTICE_QUIT_COPY` ("End this practice run?");
  - **practising over a run left in play asks first:** M13c's dialog on `/play`, now that M14a's open-run flag works.
- **A run left in the background:** on return to the foreground the board shows what the server says, which may be a lost life or the run over:
  - the copied hook's round timer may already cover it;
  - if not, `SoloGame` re-syncs on `AppState` active, and the change is recorded.
- **`/dev/canvas`** gains the solo gates it lacks (it has `solo-daily-cap` today):
  - picking refused, match gone, practice locked, practice closed and the empty pool;
  - a failed step.

  The states come from the copied samples, or the gate views `soloCanvasView` builds.

## Mirrors

From the M14 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/SoloGame.tsx` (`handleGateAction`, `playDuel`, `widenAndRestart`).
- `src/lib/solo-run.ts` (`soloGateAction`, `SOLO_GATE_COPY`, `dailyCapGate`), `src/lib/practice.ts` and `src/lib/system-states.ts` (`widenReasonOf`), all copied.
- `src/lib/dev/canvas-states.ts`, for the dev states.
- `context/theme.md` § Solo (daily cap, picked match, practice) and § System (empty filter result).

## Out of Scope

- **The run summary**, and its Play again, Change filters, Play a duel and Practise again: M15.
- **The archive** that sends a picked match: M20. A `?match=` link stands in for it here.
- **The other system states** (update required, rate limit, offline): M21. The empty-pool gate is here because the solo run raises it.

## Notes

- Scope: every way a solo run can be stopped, and the practice variant.
- Depends on: M14a (`SoloGame`, the open-run flag, `playHref`), M13c (`gameHref`, the practice dialog) and M11 (`GateAction`, the practice panel).
- Constraints:
  - **Never a dead end** (`theme.md` § Solo): every gate offers a way on.
  - **The cap and Pro are the server's** (Hard Constraints 15 and 16):
    - the client shows what the server refuses;
    - with the switch off, no lock and no word "Pro" appear;
    - free duels are never capped.
  - **No difficulty or memorability anywhere** (Hard Constraint 20). The empty-pool gate names the filter, never a score.
  - **Practice is never saved and never counts toward the cap.** The server decides; the client only asks for it.
- **The Pro switch is off locally** (`PRO_ENABLED=false`), so the daily cap, picking refused and practice locked can't be reached on the real screen. `/dev/canvas` shows them.
- **Your part:** with the backend running, on the iOS Simulator:
  - pick filters too narrow for any match, then widen from the gate;
  - open `lineup://play/solo?match=not-a-real-id`, and the match-gone gate shows;
  - play a practice run, and quit it;
  - leave a timed run mid-round, then start practice from `/play`, and the dialog asks first;
  - send the app to the background mid-round for 20 seconds, then come back.

  Claude checks Android first and stops when it needs you.
- **Deviations recorded during implementation:**
  - **`/dev/canvas` already had every solo gate but a failed step.** Picking refused, match gone, practice locked, practice closed and four empty pools came with the copied states:
    - `solo-failed-sync` is added to the copied `src/lib/dev/canvas-states.ts`: a sync the server didn't answer, with Try again;
    - the ledger records it.
  - **An empty pool's Change filters opens step 2,** as `theme.md` § Play setup says ("Change filters opens step 2"):
    - the web sends every exit to step 3;
    - `soloExitStep` (`src/lib/solo-exit.ts`, tested) picks Filters for an empty pool and Start otherwise;
    - `leave` uses it for the gate's buttons, Quit and Back to play.
  - **Play a duel replaces the solo screen** rather than pushing on top, so Back from the duel never returns to a dead gate.
  - **Back to the archive dismisses the game onto the Archive tab.**
  - **The background:** the copied hook's round timer already re-syncs when the app comes back, so `SoloGame` adds no `AppState` listener.
  - **A run left in play is rare on a phone:** Quit and Back both ask first. It happens when a link opens `/play` mid-run, or a failed step's gate goes back. The warning was checked with a link.
  - **Verified on Android:**
    - `lineup://play/solo?match=not-a-real-id` showing "That match isn't in the game any more", and Back to the archive landing on the Archive tab;
    - APOEL Nicosia over 2000–01 to 2001–02 showing "No match for those clubs":
      - Include every club restarted on a May 2002 match;
      - Change filters opened step 2 with APOEL and the era kept;
    - a practice run:
      - the practice panel from the side pick, no clock or lives;
      - Forlán revealed;
      - "End this practice run?" with Keep practising and End practice, and its end;
    - a timed run left open through a link, then Start practice asking "Practise now?", and Practise starting the practice run;
    - a timed run sent to the background for 20 seconds: on return a life was gone and the next round was running;
    - on `/dev/canvas`: the daily cap (Play a duel, Back to play, See Pro), picking refused, practice locked, practice closed and `solo-failed-sync`.
  - **Verified on iOS by the user (2026-11-23):** the empty-pool widen, the match-gone link, a practice run ended, the practise-over-run warning, and a run back from 20 seconds in the background.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass;
  - the copied `solo-run`, `practice` and `system-states` tests keep passing;
  - screenshots of each gate on `/dev/canvas`, and of a practice run, on both platforms.

## History
