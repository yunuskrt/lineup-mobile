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

## History
