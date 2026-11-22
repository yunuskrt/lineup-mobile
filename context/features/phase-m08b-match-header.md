# Phase M08b — Match Header

## Status

Not Started

## Goals

- **`src/components/game/MatchHeader.tsx`:** the ink scoreboard, from the copied `matchHeaderView(match)`, in two layouts (`design-mobile.md` § 6):
  - `full`:
    - crest over name for each side, with the score between them in `score-digits` (Numbers role, 32, tabular);
    - under them the context line: the competition logo and name, then the date, at 75% `on-scoreboard`;
    - the side being named is emphasised (the crest's ink ring), and the other side is muted;
  - `compact`: one line, `BAR 2–1 MIL · UCL 2006`, for the keyboard-up band and 375pt screens;
  - a `hasControls` room at the right end for Quit and sound, which M11 places;
  - with no match yet, a placeholder of the same size: the crests, the score and the context line as faint blocks, so nothing shifts.
- **`src/components/game/match-header/Team.tsx`:** one side's crest, short name and named ring.
- **`src/components/game/ClubCrest.tsx`:**
  - the crest through `expo-image` in a 2pt-ring box, in the sizes `row` 32, `header` 40 and `card` 80;
  - initials on a card or raised fill when there's no image, or it fails (`useImageFallback`);
  - an ink ring when `isNamed`.
- **`src/components/game/CompetitionLogo.tsx`:** the logo through `expo-image`. With no image, the web's trophy outline in `react-native-svg`.
- **`/dev/pitch` gains a header section:**
  - full and compact, each with the home side named and with the away side named;
  - a missing crest showing initials, a missing logo showing the trophy, and the loading placeholder;
  - each over the pitch below it, as a board would show it.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/MatchHeader.tsx` and `match-header/` (`Team.tsx`, `styles.ts`)
- `src/components/game/ClubCrest.tsx`, `src/components/game/CompetitionLogo.tsx`
- `src/lib/match-header.ts` (copied): the view model, short names and the date line.
- `src/components/game/competition-kind.ts` (copied).

No copy list.

## Out of Scope

- The light status bar over the scoreboard, and running the scoreboard up under it (M11, with the board).
- Quit and sound on the scoreboard (M11 places them; M12 makes the sound toggle).

## Notes

- Scope: the scoreboard every game screen and summary leads with, on a dev page.
- Depends on: M08a (the pitch it sits on in the dev page), M06 (`useImageFallback`).
- Constraints:
  - Text on the ink uses `on-scoreboard` and `score-digits`, theme roles only.
  - Images are never on the critical path; a crest or logo that fails shows its fallback at once (`project-overview.md` § Data Architecture).
  - Text scaling is capped on the scoreboard (`maxFontSizeMultiplier`), as it's a fixed-size piece.
  - The score reads "2 to 1" to a screen reader, as on web.
- **Your part:** on the iOS Simulator, open `lineup://dev/pitch?section=header`. Claude checks Android and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: any helper added beside `match-header.ts`, such as the compact line's text.
  - On both simulators:
    - full and compact match `design-mobile.md`;
    - the named side reads as emphasised;
    - a missing crest and logo fall back cleanly;
    - the placeholder is the same height as the header.

- **Deviations recorded during implementation:**
  - **The crest fallback is the club's short name, not initials,** as the web's `ClubCrest` draws it ("NGU" on the card fill).
  - **Crest sizes are 32, 40 and 80.** The web's phone sizes (32, 32 and 64) cut "NGU" to "N…" in the header, so the header crest is 40, as the spec had it.
  - **The named side's emphasis follows the web:**
    - a butter (`score-digits`) ring around the crest's white tile, with its name in semibold;
    - the other side's name at 70% opacity.

    `ClubCrest`'s own ink `isNamed` ring is for light surfaces (rows).
  - **The compact strip has no competition short name to use** (the contract has none). It reads `NGU 3–3 RSO · Continental Cup 2005`: the short names and score in `score-digits`, then the competition and year.
  - **New helpers,** in `src/lib/scoreboard.ts` with tests:
    - `compactScoreParts` builds the strip;
    - `scoreboardLabel` is the screen-reader label for both layouts: "Northgate United 3 to 3 Real Solvara. Continental Cup, 25 May 2005. You're naming Northgate United's starting XI".
  - **Sizes:**
    - full is 112pt tall (the web's phone `h-28`) and compact 44pt;
    - the score is 32 (the design's figure; the web's phone size is 24);
    - `hasControls` keeps 48pt at each end;
    - the competition logo is 16pt on a white tile, and its fallback mark is drawn in ink.
  - **The scoreboard's content is centred (user, 2026-11-22).** Quit (✕) will sit at the left end and sound (♪) at the right, rather than both on the right. `hasControls` keeps 48pt at each end, so the score is centred and nothing truncates. With both on the right (96pt each side), the competition cut to "Continen…". The compact strip is centred too.
  - **The loading placeholder** is in `match-header/Placeholder.tsx`, and is the same fixed height as the header.
- **Verified on Android, `/dev/pitch?section=header`:**
  - full with the home side named, and with the away side named;
  - compact in one line;
  - the no-image fallbacks (short name and trophy mark);
  - both loading placeholders at the header's height, each over the pitch.

  The sample crest and logo paths are web-only, so every specimen shows the fallbacks.
- **Verified by the user on iOS (2026-11-22):** the header section, centred, with both sides named, the compact strip, the fallbacks and the placeholders.
- **Follow-up:** the web's `src/lib/match-header.test.ts` covers the copied `matchHeaderView` but wasn't in copy list A. Paste it unchanged into the same path and record it in `context/web-carryover.md`.

## History
