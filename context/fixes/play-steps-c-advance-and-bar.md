# Fix — Play Steps C: Pick to Advance, Pinned Actions

## Status

Completed

## Goals

The mobile port of the web's **Play Steps C** (`../lineup-web/context/fixes/play-steps-c-advance-and-bar.md`). Copy, the game routes and the server's checks don't change. `context/theme.md` § Play setup already carries the new Mode, Join by code and Step actions rows.

- **Picking a mode card moves to Filters** (`ModeChoice`, `PlayScreen`):
  - a tap on Solo, Duel or Practice selects it and opens step 2, as Next would; a tap on the card already selected moves on too;
  - **a VoiceOver or TalkBack double-tap is a tap**: it picks and moves on, and step 2's heading takes focus as after Next (the `hasMoved` focus M13 already has);
  - **a locked Practice card stays inert** (`LockedCard`, no press), with See Pro as before;
  - **a capped Solo stays on step 1**, selected, so its cap line with Play a duel and See Pro is seen rather than skipped (only with the backend's `PRO_ENABLED` on);
  - **Next: filters stays**, for coming back to step 1 with a card kept;
  - **the header chevron and Android's back** return to step 1 with the card kept (`useStepBack`, unchanged);
  - `ModeChoice` takes an optional `onPick`; without it a tap only selects, as the `/dev/play` mode samples keep doing.
- **The room-code row is always on step 1** (`ModeStep`, `JoinRoom`):
  - at the top of the step, under "Choose a mode" and above the cards, with no Duel pick needed; no longer its own ruled section;
  - **Join sends `mode=duel` and drops `practice`** (`withModeOption(filterParams, 'duel')`), as the row now sits beside whatever card is picked, so Back to play after the room game opens a duel's step 3;
  - joining still skips the filters; a `lineup://` room link and a held code (M22) still fill it.
- **Each step's buttons move into `Screen`'s `footer`**, pinned above the tab bar (`PlayScreen` picks the footer for the step):
  - **step 1:** Next: filters;
  - **step 2:** Back and Next: start;
  - **step 3:** Back and Start (Start solo run, Start practice, Find an opponent), the runs-left or cap line, and for a duel **Create room with its Pro caption** or its error. On a short screen (375 × 667) Start and Create room keep sharing one row with Back as the chevron, as M13c built;
  - the step's content keeps its heading and sections; nothing else moves into the footer;
  - **"Play a friend" loses its label** with its section, as on web: Create room sits in the footer under Start. `CreateRoom` becomes the button and its notes, with no section or label;
  - **the archive line moves up into the summary section** of step 3, still a secondary button ("Or pick the exact match from the archive"), as `design-mobile.md` § 3 wants actions as buttons, never text links; shown for a solo run that isn't capped, as now.
- **The keyboard:** on a small iPhone with the keyboard up on step 1, the code boxes, Join and the footer don't collide; the footer rides above the keyboard with the column (`Screen`'s `avoidsKeyboard`), and the join row stays in view (Open Question 1).
- **`/dev/play` follows:** its Create room samples render the new `CreateRoom`, and the Start sample shows the footer's parts.
- **The docs follow:** `context/design-mobile.md` § 6 Play: the step 1 sketch has the join row under the heading and above the cards; the "Steps" note says a pick moves on, the join row is always there, and each step's actions are pinned above the tab bar; the "join row appears only with Duel picked" line goes.

## Contract

No backend change. Joining is the existing `room:join`; the server still checks every code, cap and Pro gate.

## Mirrors

Read-only, in `../lineup-web/`:

- `context/fixes/play-steps-c-advance-and-bar.md`, with its Deviations.
- The web fix is **uncommitted** on its `fix/play-steps-c` branch (the commit "fix: play steps pick to advance, pinned actions" doesn't exist yet). Its working tree: `src/components/play/` `ModeChoice.tsx` (`onPick`), `ModeStep.tsx` (join row on top, `joinParams`), `PlayScreen.tsx` (`pickOption`, the capped-Solo stay), `StartStep.tsx` and `CreateRoom.tsx` (Create room in the bar, the archive line in the summary), `styles.ts` (`STEP_BAR`).
- No `src/lib` change, so no copy list: `play-steps.ts`, `room-code.ts` and `solo-allowance.ts` stay word for word.

**Not ported:**

- **Arrow keys only move the choice, and Space or Enter picks:** a phone has no arrow keys, and a screen reader's double-tap is a tap.
- **The history push and `flushSync`:** mobile keeps the step in the route's params and steps back through `useStepBack`, so a pick is one params write to step 2 with the card in it.
- **Sticky, "pinned only while taller than the screen":** mobile pins always, through `Screen`'s `footer`, as Pro and the run summary do.

## Open Questions

1. **The footer while typing a room code.** Default: it stays, above the keyboard. If the check on 375 × 667 shows the code boxes or Join squeezed or covered, the alternative is to hide the footer while the keyboard is up on step 1 (Join is the action then, not Next).
2. **The short-screen step 3.** Default: keep M13c's row on 375 × 667, Start and Create room side by side with Back as the chevron, so the duel footer stays one row tall. Alternative: Back and Start, then Create room under them, as on larger phones (a taller footer).

## Out of Scope

- The step indicator, the entry links and the filter panel (web Play Steps A and B).
- The game routes, the lobby and the room screens.
- The Welcome screen: mobile has no home page with "Play a friend".

## Notes

- **Source:** the user's request, 2026-11-24; the web fix and its Deviations.
- Depends on: M13a to M13c (the steps, the join row, Create room), M20b (`Screen`'s `footer`), M22 (room links into the join row), Fix Screen Titles (no title above the step indicator).
- Constraints:
  - **No game logic:** a capped Solo staying is presentation from the server's allowance; the server still refuses a capped run.
  - **Pro locks shown, never hidden** (`theme.md` § Pro lock): locked Practice and Create room keep their captions and See Pro.
  - **Touch targets 44pt**; the footer clears the tab bar (`Screen` gives a tab screen's footer no bottom inset).
  - One component per file, the component template, `@/` imports, comments at most 75 characters, a one-line reason on every `style=`.
- **Your part:** on the iOS Simulator at 375 × 667 (iPhone SE) and 390 × 844: tap each card (and the selected one) to reach Filters; Back to step 1 with the card kept; with VoiceOver, a double-tap on a card moves on; type a room code with the keyboard up and check the boxes, Join and the footer; join from step 1 without picking Duel; step 3 for solo, practice and duel, with Create room in the footer.
- Verification (Claude, Android emulator, default size and 375 × 667 through `wm size 750x1334`, `wm density 320`):
  - each card advances, the selected card too; locked Practice doesn't; the chevron and the back button return to step 1 with the card kept;
  - the footer on each step, above the tab bar; step 3 solo (archive button in the summary), practice and duel (Create room, its caption with the split on);
  - the code boxes with the keyboard up; a join from step 1 lands in the duel route with `mode=duel`;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Decisions at start (user, 2026-11-24):**
  1. The footer stays above the keyboard, hidden only if it crowds the code boxes or Join at 375 × 667;
  2. the short-screen duel keeps Start and Create room in one row, with Back as the chevron.
- **Deviations recorded during implementation:**
  - **The footer steps aside while typing a code** (Decision 1 applied): at 375 × 667 Join wraps under the code boxes, and with the keyboard up the footer covered it (the keyboard's Go still joined). `PlayScreen` leaves the footer out on step 1 while `useKeyboardFrame` (the game's band hook) says the keyboard is up.
  - **The footer parts are their own components:** `FiltersActions.tsx` (Back, Next: start) and `StartActions.tsx` (Back and Start, the cap line, Create room, with `useCreateRoom` moved there from `StartStep`); step 1's footer is one Next button in `PlayScreen`. `ModeStep`, `FiltersStep` and `StartStep` now render content only; `FiltersStep` loses `onBack` and `onNext`, and `/dev/play`'s filter samples with it.
  - **A pick is one params write**: `pickOption` in `PlayScreen` sets the filters as seen and the heading to focus, then writes step 2 with the card; a capped Solo only selects.
  - **`ModeChoice`'s `onPick`** replaces `onChange` for a tap when given (`onPick ?? onChange`); the `/dev/play` mode samples pass none and keep selecting.
  - **Join wraps under the code boxes at 375pt** (six 40pt boxes, gaps and Join need about 352pt of 343); it was so in M13c too, and is more visible now that the row is always there. The web wraps only at 320px.
  - **`design-mobile.md` § 6:** the Play sketch shows the join row above the cards and each step's footer; the "Steps" and 375 notes describe the pick, the join row and the footer.
- **Follow-ups (review):**
  - A Join pressed before the filters load sends no `mode=duel` (`joinParams` is null then, as on web), so Back to play after that room game falls back to step 1. Rare: the filters load in well under a second.
  - The mode cards still read as radio buttons, while a double-tap now moves on. M23 can judge whether they need a hint ("Opens the filters").
  - The footer hides for any keyboard while step 1 shows, including one opened on a screen pushed over Play; it returns when the keyboard closes.
- **Verified on Android (2026-11-25):** step 1 with the join row on top and Next: filters pinned above the tab bar; a tap on Solo opened Filters (Back and Next: start in the footer); Android back returned to step 1 with Solo kept; a tap on the selected Solo moved on again; step 3 solo (the archive button in the summary; Back and Start solo run), practice (Start practice) and duel (Back, Find an opponent, Create room under them); at 375 × 667 the duel footer shared one row (Find an opponent, Create room) and, with the keyboard up, the code boxes and Join showed with the footer stepped aside; a join from step 1 with Solo picked opened the duel route, refused the made-up code, and Back to play returned to step 1 with Duel picked and the code kept (so `mode=duel` went with it). A "linking configured in multiple places" dev log appeared once after `wm size` restarted the activity, unrelated to the change. Lint, typecheck, test (1343), build and expo-doctor (20/20) pass.
- **iOS at 375 × 667 (iPhone SE): deferred by the user (2026-11-25)**, to be checked later; the keyboard and Join check on a small iPhone is still open.

## History
