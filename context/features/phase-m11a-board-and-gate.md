# Phase M11a — Board & Gate

## Status

Not Started

## Goals

- **`src/components/game/GameCanvas.tsx`:** the one game board for a `CanvasView` (copied type), laid out with the keyboard down. This is the "their turn" sketch in `design-mobile.md` § 6:
  - **one united board**, full bleed and split by 2pt ink rules: scoreboard, turf, rail. No card around it;
  - **scoreboard:** M08b's `MatchHeader` with `hasControls`. It runs up under the status bar, which uses light content over it. Quit (M05's `QuitChip`, calling `onQuit`) sits at its left end. The right end is left empty for M12's sound toggle;
  - **turf:** `FoundCount`, then `SquadGrid` with the found players and `pulse`. While `match` is null, `SquadGrid` uses `LOADING_FORMATION` and `isLoading`;
  - **rail:** `ActiveRail`, which clears the home indicator;
  - **`LifeLostFlash`** over the whole board, keyed by `lifeLostKey`;
  - **suggestions:** the copied `suggest` over a `SuggestionIndex`, with already-named players dimmed, as on web.
- **`src/components/game/game-canvas/`:**
  - **`ActiveRail.tsx`:**
    - the clock and lives row, then a rule;
    - a fixed-height toast slot, then the guess area;
    - **your turn and solo:** `GuessInput` (M10a) with the view's status, `cooldownUntil`, `shakeKey` and suggestions;
    - **their turn:** no input, and the copied `waitingLine` in its place;
    - the copied `turnAnnouncement` is spoken when the turn changes;
    - **practice:** `PracticeCard` replaces the clock and lives row.
  - **`ClockBlock.tsx`:**
    - the copied `activeRing` and `clockLabel` drive one full-size `CountdownRing` (M09a);
    - in a duel, the `TurnSticker` names whose turn it is;
    - in solo, there's no sticker.
  - **`RailLives.tsx`:** `LivesCard` in solo, and `DuelLivesCard` in a duel, with the opponent's connection (M09b).
  - **The gate's parts:**
    - **`GateAction.tsx`:** kit `Button`s, full width and stacked: the action, then the secondary one, then **See Pro** as a secondary button to `/pro` (actions are buttons, never links);
    - **`GateCountdown.tsx`:** the ticking detail, from `useSecondsLeft`;
    - **`GateSeconds.tsx`:** the big seconds under the detail, hidden from screen readers.
- **`src/components/game/FoundCount.tsx`:**
  - a sticker on the turf's top-left corner reading "4/11", from the copied `foundCountLabel`;
  - screen readers hear "4 of 11 found".
- **`src/components/game/PracticeCard.tsx`:**
  - a mint `TimerOff` icon tile, titled "Practice";
  - the web's line: "No clock and no lives. Name all eleven, or quit when you like. This run isn't saved."
- **`src/components/game/CanvasGate.tsx` and `canvas-gate/GatePanel.tsx`:** the overlay for a `CanvasGateView`:
  - **look:** `gate-scrim` over the board, under a centred `surface-raised` panel. The panel has a 2pt ink outline, the hard shadow and the long-title type;
  - **size:** narrow (centred) or wide (left-aligned, for the side pick and the lobby);
  - **motion:** it fades in and out over `gateFade` (240ms, kept under reduced motion);
  - **while open:**
    - the board under it takes no touches and is hidden from screen readers;
    - the title is announced and screen-reader focus moves to the panel;
    - the keyboard is dismissed;
  - **the two notices:**
    - `connection`: a `WifiOff` icon tile, the countdown detail and the big seconds;
    - `refused`: the detail as a kit `Alert`.
- **The parts later phases own** (the side pick M14, the run summary M15, the lobby M17, the duel result M18): the canvas shows a `StateNotice` reading "Built in M1x" in that part's place, in the gate or the rail. Each of those phases swaps in the real part.
- **`/dev/canvas`:**
  - **`src/app/dev/canvas/index.tsx`:** the index of every state in the copied `CANVAS_STATES`, Solo then Duel, as on web. Each row shows the name and the description, and opens the state;
  - **`src/app/dev/canvas/[mode].tsx`:** renders `?state=` through the copied `resolveCanvasState`, full screen like the game, with no dev header:
    - a state's `next` frame plays 600ms after load (`SNAPSHOT_EVENT_DELAY_MS`);
    - the gate's action moves to `idle` (`AFTER_GATE_STATE`);
    - typing changes the guess, and Send does nothing (there's no server);
    - suggestions come from `SAMPLE_SUGGESTION_INDEX`;
    - back leaves, as it's a dev page.
- **`/dev/loading`** (`src/app/dev/loading.tsx`), from the web's `LoadingPreview`:
  - Loading toggles the squad skeleton, with formation buttons;
  - "Finish loading with 4 revealed" drops in a snapshot with no reveal animation;
  - three gate samples (Matchmaking, Reconnecting, Pre-match) and Close, over a grid and a live input;
  - board taps and sends are counted, to prove the gate blocks both.
- **`TABULAR_NUMS` fix (M10b follow-up):** `MatchHeader.tsx` and `RuleTile.tsx` pass it in `style`, not `className`, so their digits are tabular.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/GameCanvas.tsx` and `game-canvas/` (`ActiveRail`, `ClockBlock`, `RailLives`, `GateAction`, `GateCountdown`, `GateSeconds`).
- `src/components/game/CanvasGate.tsx` and `canvas-gate/GatePanel.tsx`, `FoundCount.tsx`, `PracticeCard.tsx`.
- `src/lib/canvas.ts` and `src/lib/dev/canvas-states.ts` (both copied in M02, with tests).
- `src/components/dev/CanvasStatePreview.tsx`, `LoadingPreview.tsx`, `src/app/dev/canvas/` and `src/app/dev/loading/`.

No copy list.

## Out of Scope

- The keyboard band, the compact scoreboard while typing, and dismissing the keyboard on their turn (M11b). Until then the board sits in a `KeyboardAvoidingView` (padding, on both platforms, as M10a found), so the input stays above the keyboard even if the board is cramped.
- The welcome's demo loop (M11c).
- `NamedOrder`: only the run summary and the duel result use it, so it moves to M15.
- The sound toggle and every cue (M12). The real game routes and their `?state=` (M14, M18).

## Notes

- Scope: the board and the gate, rendered from static canvas views on dev pages. Not wired to a session.
- Depends on: M08 (pitch, grid, scoreboard), M09 (clock, lives, flash), M10 (input, toast, reveal), M05 (`QuitChip`, `StateNotice`).
- Constraints:
  - **No game logic** (Hard Constraints 1 and 7). The board renders the view it's given. The clock is drawn from the round's timestamps, and nothing on the board decides a life, a turn or a verdict.
  - **The squad always shows all eleven slots** and the placeholder takes the exact size of what loads (`theme.md` § Rules).
  - **Whose turn it is is always visible**, by sticker label as well as colour. You are blue, the opponent orange.
  - **The pitch is always upright**, the goal at the bottom.
  - **Safe areas:** nothing under the notch or the home indicator except the scoreboard's ink, which runs up under the status bar.
  - **Text scaling caps** only on the fixed pieces (the clock, the scoreboard, the count sticker).
  - Theme roles only; `style=` only for Reanimated, run-time sizes and safe-area insets. One component per file, and the template.
- **375pt (iPhone SE):** the scoreboard is always the one-line strip (`isCompact`), as `design-mobile.md` § 6 says.
- **Your part:** on the iOS Simulator, open `lineup://dev/canvas` and try a spread of states (`loading`, `pre-match`, `idle`, `critical`, `already-found`, `not-in-xi`, `life-lost`, `practice`, `rate-limited`, `their-turn`, `their-reveal`, `opponent-reconnecting`, `you-reconnecting`). Then try `lineup://dev/loading`. Claude checks Android first and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass. The copied `canvas.test.ts` and `canvas-states.test.ts` keep passing.
  - Tests: any new pure helper (for example, choosing which placeholder a state needs).
  - On both simulators:
    - every state in the index opens without a crash, and the later-phase parts show their "Built in" notice;
    - `loading` shows the header and grid skeletons;
    - `pre-match` shows the gate, and Start moves on to `idle`;
    - `correct` and `life-lost` play their event after 600ms (the reveal, the flash);
    - in `their-turn` the ring is orange, the sticker says so, and there's no input;
    - `you-reconnecting` ticks the gate's seconds;
    - the gate blocks board taps and sends on `/dev/loading`;
    - the status bar is light over the scoreboard;
    - VoiceOver and TalkBack read the gate's title and skip the board under it.

- **Deviations recorded during implementation:**
  - **The turn sticker sits under the lives**, as in the "their turn" sketch in `design-mobile.md` § 6. It isn't above the ring, as in the web's `ClockBlock`, which saves about 32pt for the pitch. `ClockBlock` is the ring alone.
  - **Quit sits outside the gate**, over the scrim, as on web, so a gate never traps the player. It's hidden once a result's own actions take over, as on web. `QuitChip` gained `isOnScoreboard`, a cream ✕ on the ink.
  - **New helper:** `src/lib/canvas-parts.ts` (with tests, and `src/types/canvas-gate.ts`):
    - `gateSize` carries the web's `LOBBY_GATE_SIZE`;
    - `laterGatePart`, `laterRailPart` and `laterPartLine` name the "Built in M1x" parts.
  - **The gate's screen-reader cue is focus alone:** focus moves to the title (`sendAccessibilityEvent`), which reads it. Repeating it as an announcement would read it twice. The fade is Reanimated's `FadeIn` and `FadeOut` with `ReduceMotion.Never` (`gateFade` is kept).
  - **The light status bar shows only while the board's screen is focused** (`useIsFocused`). Otherwise a screen pushed over the game, such as `/pro` from See Pro, kept light icons on cream.
  - **`Badge` gained `maxFontSizeMultiplier`**, so the found count's sticker can be capped (1.2).
  - **`GameCanvas` leaves out the end-of-game callbacks** (Play again, Change filters…) until M15 and M18 bring the parts that use them. It does carry the perfect-clear border on the turf and the missed slots, as on web.
- **Verified on Android:**
  - **All 75 states:** each opens from the index's deep links with no JS error or warning in the log.
  - **Gates and turns, by screenshot:**
    - `pre-match` shows its gate, and Start moves on to `idle`;
    - `side-pick` and `paired` show "Built in M14" and "Built in M17" in the gate, and `run-over` shows "Built in M15" in the rail;
    - `their-turn` has an orange ring, the "Their turn" sticker and "Waiting for deadball_dan", with no input;
    - `you-reconnecting` ticks its big seconds under the Wi-Fi tile;
    - `opponent-reconnecting` shows the reconnect chip and the "keeps running" line.
  - **Other states, by screenshot:**
    - `practice` shows the card in place of the clock and lives;
    - `loading` shows the header and grid skeletons;
    - `life-lost` passes the turn with the red flash fading;
    - the status bar is light over the scoreboard, dark again on `/pro`, and light on return.
  - **`/dev/loading`:** a board tap counts. With Pre-match open, two taps don't count, and after Start they count again.
  - **Emulator artifacts, not bugs:**
    - a grey box over the clock in `loading` is Android's keyboard-focus highlight, gone after one tap;
    - with the keyboard up, the pitch squeezes small, as expected until M11b's band;
    - on `/dev/loading`, the first tap while the input has focus only blurs it (the dev scroll view's default).
- **Verified by the user on iOS (2026-11-22):** `/dev/canvas` across the solo and duel states (gates, turns, events, the status bar) and `/dev/loading` (the gate blocks board taps).
- **Checks:** `npm run lint` has one warning, from Expo's generated `.expo/types/router.d.ts` (its `eslint-disable` header, which has been there since M01). Everything else passes clean.

## History
