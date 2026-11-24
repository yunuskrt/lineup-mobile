# Phase M20a — Archive

## Status

Completed

## Goals

- **`src/app/(tabs)/archive.tsx`** replaces the M05 placeholder. It renders `ArchiveScreen`, or, in development only, `ArchiveStatePreview` for `?state=` (keyed by the state, as `/profile`).
- **`src/components/archive/ArchiveScreen.tsx`** wires the data, as the web's `ArchiveScreen`:
  - `useProAccess`, `useFilterOptions` and `useArchive(query)`. `query` stays null until access is `open` and the filters have loaded, so a locked or pending archive sends no request;
  - **search:** applied 300ms after typing stops (`ARCHIVE_SEARCH_DELAY_MS`), and at once on the keyboard's search key;
  - **filters:** a change goes through `withOneClub`;
  - **Clear:** clears the search, or the filters when there's no search;
  - **`retry`, `showMore`** (with the stale-cursor refetch) and **pull to refresh** from page one, as in M19b;
  - the search and filters are kept in the route params (`archiveParams`) with `router.setParams`, and read once on entry, as the web keeps the URL.
- **`ArchiveView.tsx`**, with `archive-view/Header.tsx` and `archive-view/Results.tsx`, renders one view per `archiveView` status:
  - **pending:** the header, then skeleton rows, with no controls (no lock flashes in or out);
  - **locked:** a `ProLock` with "Browse the archive" and "The archive is part of Pro.", over an `Archive` icon tile;
  - **loading:** skeleton rows;
  - **error:** `RetryNotice`;
  - **empty:** "No match fits. Try fewer words or a wider filter.", with the Clear button;
  - **list:** the rows, then the paging footer. While a new search loads over the last results (`isRefreshing`), the list dims and says it's busy.
- **Header:** the Title "Archive"; a brand PRO sticker only while `showsPro`; then the total line (`archiveTotalLine`), the locked line ("Every match in the game, searchable. Pick one and play it.") or a placeholder at the line's height.
- **Search field:** the kit's input with a search icon, "Search the archive", the search return key, no autocorrect, and `ARCHIVE_SEARCH_MAX`.
- **`ArchiveFilters.tsx`:** a chip row (Competition, Club and Era) under the search, as `design-mobile.md` § 6 Archive. Each chip opens the matching M13b sheet, and a picked chip shows its choice. The active filters are read aloud (`activeFiltersLabel`). `FilterSkeleton` shows while the options load.
- **`ArchiveRow.tsx`**, as the sketch in `design-mobile.md` § 6:
  - home, score and away on the first line, with crests from 390 (`ClubCrest`);
  - the competition logo, the event (`matchEvent`) and the date (`archiveDateLabel`) on the second line, with the nickname when there is one;
  - **Play** and **Practise** buttons (`playMatchLabel` for screen readers). The pressed row reads "Starting…", and the other rows' buttons go inert;
  - **at 375:** one Play button and a "more" button that opens a sheet with Play and Practise.
- **Starting a run:** `useStartNavigation` to `pickedMatchPath(id, practice)`. Practice over an open run asks first (`QuitDialog` with `PRACTICE_OVER_RUN_COPY`). A failed start shows an Alert over the results (`authErrorMessageOf`).
- **`ArchiveSkeleton.tsx`:** placeholder rows at the real row height, in the real list's frame.
- **The paging footer:** `profile/HistoryMore` gains a `noun` prop ("games" by default, "matches" here), as on the web.
- **`ProLock.tsx`** (in `src/components/pro/`): `ProLockButton` with `ProLockCaption` under it, and no caption while pending, as the web's `ProLock`.
- **Dev states:** `src/components/dev/ArchiveStatePreview.tsx` over `resolveArchiveState`: `open`, `locked`, `pending`, `loading`, `empty`, `error`, `long` and `refreshing`. Checked at 390 × 844 and 375 × 667.

## Mirrors

From the M20 row of the Web References table in `context/todo.md`, read-only in `../lineup-web/`:

- `src/components/archive/`: `ArchiveScreen`, `ArchiveView`, `archive-view/Header`, `archive-view/Results`, `ArchiveRow`, `ArchiveFilters`, `ArchiveSkeleton` and `styles.ts`; `src/components/pro/ProLock.tsx`; `src/components/dev/ArchiveStatePreview.tsx`.
- **Already copied (M02, M06):** `src/lib/archive.ts`, `src/lib/dev/archive-states.ts`, `src/types/archive.ts` and `src/hooks/use-archive.ts`. There is no copy list.
- `context/theme.md` § Pro lock and § Solo, Picked match (what a picked run does next).

## Open Questions

1. **Filters UI.**
   - **Default:** chips that each open their own sheet, as `design-mobile.md` § 6 sketches.
   - **The alternative:** one Filters button, as the web, opening a sheet that holds the M13b rows.

## Out of Scope

- The `/pro` screen, `GetProButton` and the plan table (M20b).
- Sorting the archive, or showing how a match was picked: `memorability_score` is never exposed (Hard Constraint 20).

## Notes

- Scope: the Archive tab, its states and its route into a picked or practice run.
- Depends on: M13b (filter sheets), M14b (picked and practice runs), M19b (`HistoryMore`, pull to refresh from page one).
- Constraints:
  - **The tier is the server's** (Hard Constraint 16). The backend refuses the archive to Free ("Browsing the match archive needs Pro."), so a locked archive shows one lock and sends no request. That overrides the row-level locks in `design-mobile.md` § 6 Archive, because there are no rows to lock.
  - **No word "Pro" while the split is off** (`showsPro`).
  - **Every wait has a known shape:** skeleton rows at the real row height; while a new search loads, the last results stay, dimmed.
  - **Never fail silently:** a failed page keeps its rows and offers Try again, and a failed start says why.
- **Your part:** on the iOS Simulator with the backend running (Pro, or `PRO_ENABLED=false`), search for a club, change a filter, Show more, then Play a match and Practise another.
- Verification (Claude, Android emulator):
  - the real archive: search, each chip's sheet, Clear, Show more, pull to refresh;
  - Play and Practise each start the picked run; practice over an open run asks first;
  - with `PRO_ENABLED=true` and a Free account (your backend restart): the locked screen, and no archive request;
  - the dev states at both sizes;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

- **Deviations recorded during implementation:**
  - Open question 1 (user, 2026-11-24): chips, with a new Era sheet. M13b's Era is two season pickers with a sheet each, so `archive-filters/EraChip` holds From and To lists side by side, with Done.
  - Competition and Club reuse their M13b sheets: both take `isChip`, and a shared `filter-panel/FilterTrigger` draws a ruled row or a `play/SheetChip`.
  - Each chip reads its own "name: value", in place of the web's `activeFiltersLabel` line; the chips already show the values.
  - While the options load, three chip-shaped skeletons stand in for `FilterSkeleton`, whose rows don't match the chips.
  - The PRO sticker and the total line sit under the screen's title, since `Screen` owns the title.
  - The locked state is `archive-view/Locked`: an icon tile over a full-width `ProLock`, in the dashed frame of `Empty`.
  - "At 375" follows the repo's small-phone test (`isShortScreen`, by height), as the rest of the app does.
  - Pull to refresh: `refetchFirstPage` in the new `src/lib/first-page.ts`, shared with Profile. `refreshHistory` now calls it, and `firstHistoryPage` became `firstPageOnly`. `use-archive.ts` stays word for word.
  - A start clears the practice warning whether it succeeds or not, because the tab stays mounted under the game. The web clears it only on a failure.
  - The home name is right-aligned by its box, because Android clips the start of right-aligned truncated text.
  - Practice over an open run wasn't reached from the archive, because leaving a game ends its run. It shares `hasOpenRun` and `QuitDialog` with `/play`.
  - Review: the row's team and match lines use min heights, so scaled text grows them instead of being cut off.
  - Test: `src/lib/first-page.test.ts` covers `firstPageOnly` and `refetchFirstPage` with an archive-style key; the trim tests moved there from `use-profile.test.ts`, which keeps the `refreshHistory` ones.
- **Follow-up (M24):** a club with no crest falls back to its short name, and wide ones ("KMC") truncate in the row-size crest (`ClubCrest`, M08).
- **Follow-up (M24):** the Era sheet's To column opens at the top, not at the picked season.
- **Follow-up (M24):** at 375, Practise from the "more" sheet with a run left open would raise the practice warning as the sheet closes. On iOS a modal opening while another one is closing may not show; this wasn't reached on a device.
- **Follow-up:** `archive-filters/EraChip` imports `play/filter-panel/OptionRow` across folders. OptionRow is already shared by several filter parts, so it could move up to `play/`.
- **Locked, real backend (2026-11-24):** with `PRO_ENABLED=true`, Free `m16-test` gets the lock, the PRO sticker and the locked line; See Pro opens `/pro` (still the placeholder until M20b). No request is sent because the query stays null while locked; the backend's own logs weren't checked.
- **Verified on iOS by the user (2026-11-24):** search, a filter change, Show more, Play on one match and Practise on another.

## History
