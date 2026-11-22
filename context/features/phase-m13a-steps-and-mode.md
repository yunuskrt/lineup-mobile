# Phase M13a — Steps & Mode

## Status

Not Started

## Goals

- **`/play` becomes the play setup** (`src/app/(tabs)/play.tsx` → `src/components/play/PlayScreen.tsx`), replacing the M05 placeholder buttons:
  - three steps on one route, **1 Mode**, **2 Filters**, **3 Start**, as in `theme.md` § Play setup;
  - the step and the choices live in the route's params (`step`, `mode`, `practice`, and later the filters), read through the copied `playStepFrom`, `modeOptionFrom`, `withModeOption` and `withStep`;
  - a later step with no mode falls back to step 1, nothing picked (`playStepFrom` already does it);
  - **nothing is picked on a fresh visit.** Next stays disabled until a card is picked.
- **Moving between steps, the native way:**
  - Next and Back buttons write the params in place (`router.setParams`). The tab keeps one screen, with no stack of steps;
  - on steps 2 and 3, the header shows the back chevron, and Android's back button goes back one step. On step 1 it leaves as it does today;
  - the column scrolls to the top on a step change, and the step's heading takes screen-reader focus (not on first load), as the web moves focus.
- **`src/lib/route-params.ts`:** Expo Router's params (`string | string[]`) to `URLSearchParams` and back, keeping repeated keys (`club`), so the copied helpers work unchanged.
- **`src/lib/filters.ts`, adapted:** `replaceQuery` (`window.history`) is removed. The screen writes params through `router.setParams` instead, and M20's archive does the same. `withQuery` stays.
- **`src/components/play/PlaySteps.tsx`:** the step indicator: three numbered pills, joined by ink rules:
  - the current step is lavender;
  - a filled step shows a check and its choice ("Solo", "Your filters");
  - a step opens once every earlier one is filled (`isStepFilled`, `isStepReachable`). A pill you can reach is a button.
- **`src/components/play/ModeStep.tsx`:** the "Choose a mode" heading, the cards, the solo allowance line, and Next ("Next: filters").
- **`src/components/play/ModeChoice.tsx`** and **`mode-choice/`** (`CardIcon`, `LockedCard`, `PlayerBars`, `shared.ts`, `styles.ts`):
  - Solo, Duel and Practice cards, with the web's titles and text, an icon tile and the player bars (you blue, the opponent orange);
  - a picked card fills lavender with a tilted "Selected" sticker. Screen readers hear it as a radio group;
  - **Practice is Pro:** with access `locked` it's shown locked and inert, with "Practice is part of Pro: no clock, no lives, not saved." and See Pro. With `pending` it's locked with no caption. A locked practice pick shows as Solo, as on web;
  - **375pt:** the cards drop their descriptions (`design-mobile.md` § 6).
- **`src/components/play/SoloAllowanceNote.tsx`:** the copied `allowanceLine` ("3 of 5 solo runs left today"). At the cap it shows the cap line with **Play a duel**, which picks Duel, and **See Pro**. It shows nothing while unlimited, and nothing for Practice.
- **`src/components/pro/ProLockCaption.tsx`** and **`ProLockButton.tsx`:** the web's two lock parts, rebuilt:
  - the caption is a Pro badge with a lock, the short line and a **See Pro** button to `/pro`. It's a button, as `design-mobile.md` § 3 rules out text links;
  - the button is a flat, muted secondary button that does nothing.

  M13c and M20 reuse them.
- **Steps 2 and 3, for now:** each has its heading, Back and a line saying it's built in M13b or M13c, so the indicator and the back moves can be tried end to end.
- **`/dev/play`** (`src/app/dev/play.tsx`): the Pro switch is off locally (`PRO_ENABLED=false`), so the real screen never shows a lock or a count. This page shows:
  - `ModeChoice` with access open, locked and pending;
  - `SoloAllowanceNote` at 3 left and at the cap, from the copied `sampleAllowance`.

## Mirrors

From the M13 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/app/(site)/(pages)/play/page.tsx`.
- `src/components/play/`:
  - `PlayScreen.tsx`, `PlaySteps.tsx`, `ModeStep.tsx`;
  - `ModeChoice.tsx` and `mode-choice/`;
  - `SoloAllowanceNote.tsx`, `styles.ts`.
- `src/components/pro/ProLockCaption.tsx`, `ProLockButton.tsx`.
- `src/components/dev/ProPreview.tsx`, for the `/dev/play` samples.
- `src/lib/play-steps.ts`, `src/lib/solo-allowance.ts`, `src/lib/practice.ts` and `src/lib/filters.ts`, all copied in M02.

No copy list.

## Out of Scope

- **The filters step:** M13b.
- **The start step, Join by code and Create room:** M13c.
- **The `JOIN_ROW_ID` entry**, Play a friend opening at the join row: nothing on mobile links there yet. Room links are M22.
- **Practice over a run left in play:** `hasOpenRun` stays false until M14 moves it off `sessionStorage`.

## Notes

- Scope: the route, the step state, the indicator, step 1 and the Pro lock parts. Steps 2 and 3 are stubs.
- Depends on: M05 (tabs, `Screen`), M06 (`useProAccess`, `useSoloAllowance`), M04 (`ChoiceTile`, `Badge`, `IconTile`, `Button`).
- **Decisions this spec takes; tell me if you'd rather another way:**
  - steps change in place, with no screen pushed for each one;
  - Android back steps back from steps 2 and 3. The web gets the same from browser Back.
- Constraints:
  - **The client never asserts its tier.** Locks come from `useProAccess` (Hard Constraint 16), and the count from the server's allowance. Locks are shown, never hidden, and nothing says Pro while the switch is off (`theme.md` § Pro lock).
  - **`memorability_score` never shows**, and there's no difficulty choice (Hard Constraint 20).
  - Copied files keep their web path. Record the `filters.ts` change in `context/web-carryover.md`.
  - The rest as usual: one component per file and the template; theme roles only; 44pt targets; `style=` only under the three exceptions.
- **Your part:** on the iOS Simulator:
  - open Play and pick each card;
  - go Next, then Back with the chevron;
  - try `lineup://dev/play` with VoiceOver on the cards.

  Claude checks Android first, including the back button, and stops when it needs you.
- **Deviations recorded during implementation:**
  - **The step state comes from the route params alone.** The web keeps a snapshot of the URL plus React state. An effect still rewrites a stale step or an unknown filter to match the state, as the web's `replaceQuery` effect does: after a pick, a stale `step=start` would otherwise jump ahead.
  - **`route-params` has three helpers:**
    - `searchParamsOf` reads the route;
    - `routeParamsFor` writes it back. `setParams` merges, so a dropped key is written as `undefined`;
    - `sameParams` compares two sets.

    The type is in `src/types/route-params.ts`.
  - **Added files the spec didn't list:**
    - `src/lib/step-label.ts` and its test: what each pill reads aloud ("Step 1 of 3, Mode, Solo, done");
    - `src/hooks/use-step-back.ts`: Android back, skipped on step 1;
    - `src/components/play/StepHeading.tsx`: the heading that takes focus;
    - `src/components/play/LaterStep.tsx`: the step 2 and 3 stubs;
    - `src/types/pro-lock.ts`: `ProLockSize`.
  - **Kit changes:**
    - `ChoiceTile` takes `accessibilityRole`; as a radio it reports `checked`;
    - `Screen` takes `onBack` (the chevron's own action) and `scrollResetKey` (back to the top on a change);
    - `BackButton` takes `onPress`.
  - **Pro lock parts:**
    - `ProLockCaption` takes no `id`: React Native has no `aria-describedby`;
    - `ProLockButton` reads the caption as its `accessibilityHint` instead;
    - the caption's See Pro is a button, and so is `SoloAllowanceNote`'s. The web uses text links.
  - **The Selected sticker** is butter, so it stands out on the lavender card.
  - **The M05 placeholder buttons are gone from Play:**
    - Sign in stays on Profile;
    - Pro is reached through See Pro;
    - `/play/solo` and `/play/duel` only by deep link until M13c.
  - **Verified on Android:**
    - picking each card, and Next;
    - the pills, the chevron and hardware Back step by step, with the column back at the top;
    - the filled step's check;
    - `/dev/play`'s open, locked and pending cards, both allowance lines and the lock parts;
    - at 375 × 667 the cards drop their text. The "linking configured in multiple places" toast there came from the emulator's resize recreating the activity; a clean launch shows no errors.
  - **Verified on iOS by the user (2026-11-23):** the cards, Next, the chevron and the pills, and VoiceOver on `/dev/play`.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass;
  - `route-params` has tests (repeated keys, a missing key, a round trip), and the copied `play-steps` and `filters` tests keep passing;
  - screenshots on 390 × 844 and 375 × 667.

## History
