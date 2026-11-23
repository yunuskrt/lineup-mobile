# Phase M13b — Filters Step

## Status

Not Started

## Goals

- **`src/components/play/FiltersStep.tsx`:** step 2, replacing M13a's stub:
  - the "Choose filters" heading, with the web's intro line;
  - the filter rows, then Back and **Next: start**;
  - **loading:** `FilterSkeleton`;
  - **error:** `RetryNotice`, with the copied `authErrorMessageOf`. A background refetch that fails keeps the data it has;
  - Next is live once the options load: Any is a valid choice.
- **The filters live in the route's params**, through the copied `filtersFromParams` and `filtersToParams`, so returning to `/play` keeps them. Each change writes them with `router.setParams` (M13a's `route-params`).
- **`src/components/play/FilterPanel.tsx`** and **`filter-panel/`:** three ruled rows, **Competition**, **Club** and **Era** (`design-mobile.md` § 6). Each row is a select row that opens the kit's `Sheet`:
  - **`CompetitionFilter`:** a single pick:
    - "Any competition", then the copied `competitionGroups` under their group labels;
    - each competition has its logo (`CompetitionLogo`);
    - a pick goes through `selectCompetition`, which fits the era and drops clubs outside it.
  - **`ClubFilter`:** a multi pick with checkboxes and crests:
    - the rows come from the copied `clubRowView`;
    - with no competition, it's search only: the hint "Pick a competition to see its clubs, or search for one.", and results from two letters;
    - otherwise it lists the competition's clubs, with a search when they're over 12;
    - the notes are "No club matches that name." and "N more. Keep typing to narrow it down.";
    - picked clubs keep their catalog order;
    - it clears when the competition changes, as the web keys it;
    - the screen reader hears the count ("3 clubs found").
  - **`EraFilter`:** **From** and **to**, two single-pick season sheets (`seasonLabel`). "to" lists only seasons from "From" on, and moving "From" past "to" pulls "to" along, as on web.
  - **The row's value:** "Any", the one pick, or the count, with the kit's count badge.
- **The kit's `Select`:** it gains what these rows need, or the rows build on `Sheet` directly. Decide in the build and record which:
  - a single-pick mode (radio rows that close the sheet);
  - group headings;
  - a leading image.
- **`src/components/play/FilterChipImage.tsx`:** a 20pt crest or logo, falling back to the shield (`SHIELD_PATH`, copied in M02) through `useImageFallback`.
- **`src/components/play/FilterSkeleton.tsx`** and **`filter-skeleton/`:** the three rows at their real height, in `skeleton-fill`, so nothing shifts when the options arrive. The web's pixel widths don't carry over; the rows are what matter here.
- **`/dev/play`** gains:
  - the panel on the static `SAMPLE_FILTER_OPTIONS` and `SAMPLE_FILTERS` (copied in M02, in `src/lib/dev/samples.ts`);
  - the skeleton;
  - the error.

## Mirrors

From the M13 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/play/`:
  - `FiltersStep.tsx`, `FilterPanel.tsx` and `filter-panel/`;
  - `FilterSkeleton.tsx` and `filter-skeleton/`;
  - `FilterChipImage.tsx`, `shared.ts` (`CLUB_HINT`), `styles.ts`.
- `src/lib/filters.ts`, copied in M02.

No copy list. The web's chips become sheet rows on mobile (`design-mobile.md` § 4: bottom sheets replace popovers and selects).

## Notes

- Scope: step 2 only. Step 3's summary reads these filters in M13c.
- Depends on: M13a (the route, its params and `route-params`), M04 (`Sheet`, `Select`, `Checkbox`, `Input`, `Skeleton`), M08 (`CompetitionLogo`), M06 (`useFilterOptions`).
- Constraints:
  - **Filters are preferences, never a pool count.** The client never works out how many matches a filter leaves: that's the server's (and M21's empty-pool widen).
  - **No difficulty or memorability filter** (Hard Constraint 20).
  - **Images are never on the critical path:** a missing crest shows the shield.
  - **Sheets rise above the keyboard** for the club search (M04b's `Sheet`).
  - The rest as usual: one component per file, theme roles, 44pt targets.
- **Your part:** with the backend running, on the iOS Simulator:
  - pick a competition and check that the clubs and era follow;
  - search a club with no competition (try "bayern" and "atletico");
  - change the era both ways;
  - leave the tab and come back, and the filters should still be there.

  Claude checks Android first and stops when it needs you.
- **Deviations recorded during implementation:**
  - **The rows build on `Sheet` directly; the kit's `Select` is unchanged.** Its own search (from 9 options, every label) would fight `clubRowView`'s rules: search only with no competition, from two letters, capped at 12. No new `select` mode, so no new `select` tests. The parts are in `filter-panel/`:
    - `SheetTrigger`: the kit Select's row look (`SELECT_TRIGGER`), with the count badge;
    - `OptionRow`: a ruled radio or checkbox row, with an optional image;
    - `CompetitionGroup`: an uppercase group heading;
    - `SeasonSelect`: one season sheet.
  - **The layout:** each filter is a label over its select row, split by 2pt `rule` lines. Era puts "From" and "to" side by side, each with its own sheet ("Era from", "Era to").
  - **A single pick closes its sheet at once**, with no slide down: `Sheet` only animates the closes it starts itself.
  - **Tapping the picked competition keeps it.** On web the chip toggles back to Any; in a radio list, "Any competition" does that.
  - **The club search clears when its sheet closes**, as the kit `Select`'s does. The count is read aloud with `AccessibilityInfo.announceForAccessibility`.
  - **`CLUB_HINT` stays in `ClubFilter`**, its only user: the mobile skeleton draws no hint line.
  - **A bug fix in M13a's `route-params`:**
    - the route keeps its own key order, so the canonicalising effect fired on every render;
    - with a repeated `club` key, each write made a new array, and picking two clubs looped ("Maximum update depth exceeded");
    - `paramsKey` now sorts the keys and keeps a repeated key's order, and `sameParams` compares through it. Both have tests.
  - **`STEP_INTRO` is back** in `play/styles.ts`: the M13a review removed it while it was unused.
  - **`/dev/play` renders `FiltersStep` itself** in three sections, `panel`, `loading` and `error`, rather than the panel alone.
  - **Verified on Android:**
    - each sheet: Competition with logos and groups, Club with crests and search, both season sheets;
    - a competition pick, with the clubs following; two clubs, the count badge, and catalog order kept while searching;
    - search only with Any competition: the hint, "atletico" finding Atlético Madrid, and "No club matches that name.";
    - "to" listing seasons from "From" on, and moving "From" past "to" pulling it along;
    - filters kept across a tab switch;
    - the skeleton and the error on `/dev/play`, and the era row at 375 × 667.
  - **Verified on iOS by the user (2026-11-23):** the competition pick with clubs and era following, the "bayern" and "atletico" searches, the era both ways, and filters kept across a tab switch.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass;
  - the copied `filters` tests keep passing, and the kit's `select` tests cover any new mode;
  - screenshots of each sheet, and of the skeleton, on both platforms.

## History
