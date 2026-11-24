# Fix — Screen Titles

## Status

Completed

## Goals

- **No page title on any screen.** The large title at the top of the column, and the compact title that fades into the bar when it scrolls away, are removed from every screen built on `src/components/shell/Screen.tsx`:
  - the tabs: Play, Archive and Profile (the tab bar already names them);
  - the pushed screens: Sign in, Create account and Signed in (`src/app/sign-in.tsx`; the Sign in | Create account switch already names the form), Lineup Pro (`ProView`), Couldn’t load this page (`ProLoadFailed`), and Not found (`NotFoundView`).
- **`Screen` drops its title** (`src/components/shell/Screen.tsx`):
  - the `title` and `aboveTitle` props go, along with the title block, its `onLayout` measure and the `TYPE_TITLE` and `TYPE_CARD_TITLE` uses;
  - **the top row is kept only when it holds something**, a back chevron or a `headerAction`. A tab screen with neither starts its column right under the status bar, with no empty 44pt band;
  - **the column starts 16pt under the top edge** (the row, or the safe area when there is no row), instead of today's 8pt under the row;
  - **a 2pt ink rule still fades in under the top edge once the column scrolls**, so content never slides under the status bar without an edge. `headerCollapse` (`src/lib/screen-header.ts`) already returns 1 for any scroll when the title height is 0. It gets a fixed distance (16pt, the gap above the column) in place of the title height, and its test follows.
- **Each screen's first section moves up and reads as its top:**
  - **Play:** the step indicator leads. The step headings that the M13 steps focus on a move (`isHeadingFocused`) stay as they are;
  - **Archive:** the Pro sticker (with the split on) and the total line lead, then the search. `archive-view/Header.tsx`'s comment ("Under the screen's title") is updated;
  - **Profile:** the avatar and handle row leads (in the loading, signed-out and error states, its skeleton or notice leads);
  - **Sign in:** the chevron row, then the Sign in | Create account switch;
  - **Pro:** the chevron row, then the PRO sticker (from today's `aboveTitle`), then the line and the plan table. The pinned footer is unchanged;
  - **Couldn’t load this page:** the chevron row, then the `RetryNotice`, whose message already says it;
  - **Not found:** the chevron row (when it can go back), then the 404 number and its "Off the pitch" sticker. `NOT_FOUND_TITLE` goes, as only the title reads it.
- **`PlaceholderScreen`** (`src/components/shell/PlaceholderScreen.tsx`) is imported nowhere since the last tab landed. It is deleted rather than given a new layout (Open Question 3).
- **The docs follow:** `context/design-mobile.md` § 4 "Screen headers" is rewritten (no large title; a chevron row only on pushed screens; the scroll rule), and the § 6 sketches lose their title lines (Play, Profile, Archive, Sign in) and the Pro description its Title "Pro".
- **Tests:** `screen-header.test.ts` is updated for the fixed fade distance: 0 at the top, 1 once scrolled past it.

## Contract

No backend change. Presentation only.

## Mirrors

None. The web keeps its page titles; this is a phone-only call, and `design-mobile.md` wins on phone-specific layout.

## Open Questions

1. **Which screens.** Default: every screen built on `Screen`, the tabs and the pushed screens alike, as the goals list. Alternative: the three tabs only, keeping the titles on Sign in, Pro, Not found and Couldn’t load this page.
2. **The Pro page's name.** Default: no title; the PRO sticker leads the page and the line under it says what Pro is. Alternative: keep "Lineup Pro" as a heading inside the column, styled as a section rather than a page title.
3. **`PlaceholderScreen`.** Default: delete it, as it has had no importer since M20. Alternative: keep it, adjusted to the new `Screen` (it would then pass no title).
4. **The top gap.** Default: 16pt, the screen gutter, under the status bar or the chevron row. Alternative: 24pt, the ruled-section gap, for more air above the first section.

## Out of Scope

- **Dev screens** (`src/app/dev/*`, `DevScreen`): they keep their titles; they're tools, not the app.
- **The game screens** (solo and duel boards, gates, summary, result): they never used `Screen`, and their scoreboard isn't a title.
- **The tab bar labels**, unchanged.
- **A full accessibility review** of screen names and heading order without a title: M23 (below, under Notes).

## Notes

- Scope: removing the page title from every `Screen` and re-spacing the top of each screen to match.
- Depends on: M05 (the `Screen` frame and its collapsing header), and every screen phase that used it (M07, M13, M19, M20a, M20b).
- Constraints:
  - **Safe areas on every screen** (`coding-standards-mobile.md` § Native): with no row, the column still clears the status bar and the notch.
  - **Back stays a 44pt chevron** on pushed screens and on Play's later steps (its `onBack` steps back).
  - **Layout snaps to 8pt** (`design-mobile.md` § 2).
  - **One component per file**, the component template, and a one-line reason on every `style=`.
- **Accessibility, for M23:** the large title was each screen's first `header`. Without it, a screen reader lands first on the tab (Play, Archive, Profile) or on Back. Play's steps and Profile's handle already carry a heading; Archive, Sign in, Pro and Not found then open on their first control or line. M23 judges whether any of them needs a heading in its first section.
- **Your part:** on the iOS Simulator, each tab at the top and scrolled (the rule fades in), Play's three steps (the chevron row on steps 2 and 3 only), Sign in and Create account, `/pro`, `/pro` with the backend down (Couldn’t load), and a wrong path such as `lineup://nowhere` (Not found).
- Verification (Claude, Android emulator):
  - screenshots of Play (steps 1 to 3), Archive, Profile, Sign in, Pro and Not found, at the top and scrolled, on the default size and on 375 × 667 (`wm size 750x1334`, `wm density 320`): no title, nothing under the status bar, no empty band on the tabs, the rule shown only once scrolled;
  - pull to refresh on Archive and Profile still shows the ink spinner under the status bar;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Decisions at start (user, 2026-11-24):**
  1. Every screen loses its title **except the auth screens** (Sign in, Create account, Signed in), which keep the large title and its collapsing bar;
  2. Pro: the PRO sticker only;
  3. `PlaceholderScreen` deleted;
  4. a 16pt top gap.
- **Deviations recorded during implementation:**
  - **`Screen` keeps an optional `title`**, used only by `src/app/sign-in.tsx` (Decision 1). With a title, the screen is as before (the row, the large title, the compact bar, 8pt under the row); without one, no title block, and the column starts 16pt under the top edge. `aboveTitle` is gone: Pro puts its sticker in the column.
  - **`headerCollapse` is unchanged**: `Screen` passes the measured title height, or the 16pt top gap (`TOP_GAP`) when there is no title. `screen-header.test.ts` gains a case for the 16pt fade instead of a change to the function.
  - **The top row shows when there is a chevron, a `headerAction` or a title.** The 2pt rule is always laid out under the top edge (transparent until scrolled), so nothing shifts when it fades in.
  - **Not found** opens on its own "Can not find the page" section heading, which the removed title sat above; `NOT_FOUND_TITLE` had no other reader and is gone.
  - **`design-mobile.md`:** § 4 "Screen headers" rewritten; the Play sketch's title line became the chevron row on step 3, the Profile and Archive line became the handle row and the total line; the Sign in sketch keeps its title.
- **Follow-ups (review):**
  - `Screen` sets its fade distance from whether its first render has a title; no screen switches between having one and not (Sign in only swaps its text), so it is never re-chosen.
  - With no row, the column starts 18pt under the safe area: the 2pt rule, always laid out so nothing shifts when it fades in, plus the 16pt gap.
  - The Play step 1 sketch in `design-mobile.md` keeps a blank line beside step 3's chevron row; it stands for the top gap, not an empty band.
- **Verified on Android (2026-11-24):** Play steps 1 and 2 (chevron row on step 2 only), Archive (also at 375 × 667), Profile at the top and scrolled (the rule under the status bar once scrolled), the Pro dev preview (`?state=free`, `?state=error`), Not found (`lineup://nowhere`; `/pro` too, with the split off), and Sign in with its title kept. Lint, typecheck, test (1343), build and expo-doctor (20/20) pass.
- **Verified on iOS by the user (2026-11-24):** each tab at the top and scrolled, Play steps 1 to 3, Sign in and Create account with their titles kept, the Pro previews (`?state=free`, `?state=error`) and Not found (`lineup://nowhere`).

## History
