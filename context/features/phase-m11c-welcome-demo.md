# Phase M11c — Welcome Demo

## Status

Not Started

## Goals

- **`src/components/home/ShowcaseFrame.tsx`:** the demo loop on the Welcome, which M07 moved here (user, 2026-11-22):
  - it sits under the rules row, inside a board frame, as in `design-mobile.md` § 6;
  - its data is the catalog overview's `showcase` (`useCatalogOverview`, already on the Welcome);
  - **showcase:** the demo plays. Under reduced motion it's one still frame instead;
  - **loading:** the stage's skeletons, and a caption placeholder;
  - **no showcase, or the catalog is down:** nothing (the frame is left out).
- **`src/components/home/showcase-frame/`:**
  - **`Stage.tsx`:** the board in miniature: `MatchHeader` (compact), `FoundCount`, `SquadGrid`, `FeedbackToast` and a driven `GuessInput`;
  - **`ShowcaseDemo.tsx`:** plays the response's script through the copied `demoTimeline` and `demoFrameAt`. It types the surname's first letters, shows the suggestion row and highlights it, then goes pending and reveals. It shakes once with "Not in this XI" after two reveals, then fades and loops;
  - **`ShowcaseStill.tsx`:** the reduced-motion frame. The demo's reveals are filled, the input is empty, and there's no control;
  - **`Caption.tsx`:** the copied `showcaseCaption` (the named club's XI and the match date), with the Pause / Play control at its end. That control is the demo's only one, in a 44pt target.
- **`src/hooks/use-demo-playback.ts`:** the web hook rebuilt natively. It's one frame loop on `requestAnimationFrame`, and React hears only real frame changes (the copied `sameFrame`). It stops where it is when:
  - the player taps Pause;
  - less than half the frame is on screen (from the Welcome's scroll position and the frame's layout);
  - the app is in the background (`AppState`) or the screen isn't focused.
- **`GuessInput`, driven:** a display-only mode for the demo:
  - it never focuses, never raises the keyboard and takes no touches;
  - it carries the web's `drivenHighlight`, which M10a didn't (M10a follow-up), so a suggestion row shows as highlighted without focus;
  - its value and status come from the frame.
- **Accessibility:**
  - the figure is one element, labelled with the copied `showcaseSentence`. Screen readers don't walk the stage, and the typing isn't announced;
  - the control says "Pause demo" or "Play demo".
- **375pt (iPhone SE):** the frame shortens to the pitch alone, per `design-mobile.md` § 6 Welcome.
- **`/dev/welcome`** (`src/app/dev/welcome.tsx`), standing in for the web's `/?state=`:
  - the states are ready (playing), demo-paused, still, frozen at a moment, loading and no-showcase;
  - they come from a static `SAMPLE_SHOWCASE` in `src/lib/dev/`, built from the `samples.ts` match and players. It's a sample, not a mock: no rules and no API.

## Mirrors

From the Web References table in `context/todo.md` (the M07 row, which the demo came from); read-only in `../lineup-web/`:

- `src/components/home/ShowcaseFrame.tsx` and `showcase-frame/` (`Stage`, `ShowcaseDemo`, `ShowcaseStill`, `Caption`, `shared.ts`).
- `src/components/home/home-fold/HomeShowcase.tsx`.
- `src/hooks/use-demo-playback.ts`.
- `src/lib/landing-demo.ts` and `src/lib/landing.ts` (both copied in M02).
- `src/lib/dev/landing-states.ts`, for the state list only. It reads the web's mock overview, so it isn't copied.

No copy list. The web's `WindowBar` (a browser window's dots) isn't carried: it means nothing on a phone.

## Out of Scope

- Any sound. The game's cues never play on the Welcome (`theme.md` § Landing demo), and M12 must keep it that way.
- A countdown clock in the demo: it has none (user, 2026-11-10).

## Notes

- Scope: the Welcome's demo frame and its dev page. The rest of the Welcome (M07) is unchanged, apart from where the frame sits.
- Depends on: M11a (`FoundCount`), M10 (`GuessInput`, `FeedbackToast`, `RevealCard`), M08 (`SquadGrid`, `MatchHeader`), M07 (the Welcome).
- Constraints:
  - **It's presentation, not a game.** The reveals and the wrong guess come from the response's script, and nothing is decided on the device (Hard Constraints 1 and 2). The squad isn't requested: the showcase carries only the players it reveals.
  - **Reduced motion is per component:** `demoLoop` is dropped through `useMotionPolicy`, which shows the still frame. The frame loop doesn't run at all then.
  - **No battery drain:** the loop stops off screen and in the background.
  - Theme roles only; `style=` for Reanimated and run-time sizes. One component per file, and the template.
- **Your part:**
  - with the backend running, open the Welcome on the iOS Simulator (sign out first, or clear the app's data) and watch a loop;
  - scroll it half out of view, and send the app to the background and back;
  - tap Pause and Play;
  - then try `lineup://dev/welcome` and Reduce Motion (relaunch after switching it).

  Claude checks Android first and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass. The copied `landing` and `landing-demo` tests keep passing.
  - Tests: any new pure helper (for example, the half-in-view check from the scroll and layout numbers).
  - **On both simulators, the demo:**
    - it types, suggests, reveals two, shakes once and loops;
    - Pause freezes it mid-step, and Play resumes from there;
    - scrolling it away or backgrounding the app stops it, and coming back resumes it;
    - the keyboard never rises.
  - **On both, the other states:**
    - with reduced motion it's the still frame, with no control;
    - loading shows skeletons;
    - with no showcase there's no frame;
    - at 375pt it's the pitch alone.

- **Deviations recorded during implementation:**
  - **The Welcome didn't read the catalog overview yet** (the spec said it did). It now calls `useCatalogOverview` and passes the showcase to the frame, under a second rule below the rules row.
  - **New helper:** `src/lib/demo-view.ts` (`isHalfInView`, with tests). It's the native stand-in for the web's `useInView` at half. The Welcome keeps the scroll position and the frame's layout in refs, and re-renders only when the answer flips.
  - **`use-demo-playback`:**
    - the web's rAF loop, with `isInView` passed in by whoever holds the scroll view;
    - the app's state comes from `AppState` through `useSyncExternalStore`, and "unknown" at launch counts as shown;
    - screen focus comes from `useIsFocused`.
  - **The driven `GuessInput`** (`drivenHighlight`):
    - it isn't editable and takes no touches (`pointerEvents="none"`);
    - it never focuses and never announces anything;
    - its list opens without focus, and `SuggestionList` gained `highlightedKey`, a brand fill as on web.
  - **The frame never changes height:**
    - the input area keeps room for one suggestion row (`min-h-[120px]`);
    - the toast sits in that space, as the toast and the row never show together;
    - before this, each suggestion pushed the frame and caption down about 50pt.
  - **The caption speaks for the hidden stage:** its text carries `showcaseSentence` as its screen-reader label. The figure isn't one accessible element, as that would swallow the Pause control on iOS.
  - **The stage** uses the compact scoreboard, has no visible input label, and keeps the web's tilted "Demo" sticker. The control is a kit secondary button, "Pause" or "Play".
  - **Dev states:** `src/lib/dev/welcome-states.ts` (with tests) builds `SAMPLE_SHOWCASE` from the dev samples, checked against `showcaseSchema`. `frozen` is worked out from the timeline: the first suggestion row, highlighted.
  - **The pending spinner keeps turning while paused,** as the web's CSS spin does. Everything else stops where it was.
  - **The web's landing tests, pasted by you, adapted:** `landing-demo.test.ts` and `landing.test.ts` read `SAMPLE_SHOWCASE` and a new static `SAMPLE_OVERVIEW` (`src/lib/dev/welcome-states.ts`), not the web's mock overview, which this repo doesn't carry. The sample showcase now reveals eight, as the web's tests expect, and the caption's date is the sample's. Both are recorded in `context/web-carryover.md`, and the overview is checked against `catalogOverviewSchema`.
- **Verified on Android:**
  - **`/dev/welcome`:**
    - `ready` types "Tavinho", reveals him (1/11), then a second player. "Marco Bellandi" stays in the field with "Not in this XI" in the reserved space, and the loop goes on;
    - `frozen` shows "Tav" with the Tavinho row highlighted, and no control;
    - Pause stops it mid-step and shows "Play", and Play resumes it;
    - `still` shows six filled slots and no control (eight since the tests were adapted);
    - `loading` shows the skeleton stage and caption;
    - `no-showcase` shows no frame.
  - **The real Welcome**, its showcase from the backend (RMA 2–3 BAR, LaLiga 2017), seen through a scratch route that rendered it while signed in. The route and a sample fallback were removed after:
    - below the fold, two captures were identical (stopped);
    - scrolled into view it plays, with Cristiano Ronaldo's row highlighted and his headshot;
    - the app sent to the background and brought back still plays;
    - scrolled back with less than half on screen, it stops;
    - the keyboard never rose (`mInputShown=false`).
- **Verified by the user on iOS (2026-11-22):** the real Welcome's demo (the loop, stopping off screen and resuming, the background, Pause and Play, no keyboard), every `/dev/welcome` state, the still frame under Reduce Motion, and the pitch-only frame on an iPhone SE simulator.
- **Checks:** all pass. `npm run lint` keeps its one warning from Expo's generated `.expo/types/router.d.ts`.

## History
