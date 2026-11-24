# Phase M19b — History

## Status

Completed

## Goals

- **`src/components/profile/HistoryList.tsx`** fills Profile's History section, between the stats and Sign out (M19a). It has a "History" section title, then one white list outlined in ink with quiet rules between its rows (`design-mobile.md` § 2, Lines).
- **`profile/HistoryRow.tsx`:** one game on two lines, as the web's phone layout:
  - **first line:** the mode tag, the outcome and the scoreline (`scoreline`, short names), with the date at the right end (`playedAtLabel`: Today, Yesterday, or the date);
  - **second line:** the match's line (`matchSubtitle`), truncated, with "{n} of 11" at the right end;
  - **read aloud as one item,** including the lives left ("2 of 3 lives left", the web's `livesLeftLabel`). The row doesn't draw them on a phone, so the web's `LivesLeft` pips aren't rebuilt.
- **`profile/history-row/ModeTag.tsx`:** Solo in mint, Duel in purple, and Friend in butter for a room's duel (`isPrivate`). These are a mode's colours, never a side's.
- **`profile/history-row/Outcome.tsx`:** the label (`historyOutcomeLabel`) in its tone (`historyTone`):
  - a win in your blue;
  - a loss in danger red;
  - a perfect clear in found green;
  - a draw in ink, behind a small split blue-orange mark;
  - anything else muted.
- **`profile/history-list/EmptyHistory.tsx`:** "No games yet", "Your solo runs and duels will be listed here.", with Play (to `/play`).
- **`profile/HistoryMore.tsx`:** the paging footer under the list, one of four states:
  - **idle:** Show more;
  - **loading:** a pending Show more;
  - **failed:** "Couldn't load more games." with Try again;
  - **end:** no control.
  - Once rows are added, a screen reader hears "Showing {n} games".
- **Paging in `profile.tsx`:**
  - **`showMore`:** fetches the next page. After a failure on a stale cursor (`isStaleCursor`), it refetches from page one, as the web's `ProfileScreen` does.
  - **`onRetry`:** reloads only what failed.
- **Pull to refresh** (M19a) reloads the history from its first page.
- **Dev states:** `/profile?state=` renders the History section in `empty`, `guest`, `populated`, `loading-more`, `more-failed` and `end`, checked at 390 × 844 and 375 × 667.

## Mirrors

From the M19 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/profile/`: `HistoryList`, `HistoryMore`, `HistoryRow`, `history-row/ModeTag`, `history-row/Outcome`, `history-list/EmptyHistory`, `LivesLeft` (only its label) and `styles.ts` (`HISTORY_ROW`, its phone layout).
- `src/lib/profile.ts`, already copied (`historyOutcomeLabel`, `historyTone`, `playedAtLabel`, `isStaleCursor`), and `src/lib/summary.ts` (`scoreline`, `matchSubtitle`); `src/hooks/use-today.ts` for Today and Yesterday.
- `src/lib/dev/profile-states.ts` and `samples.ts` (`sampleHistory`), already copied.
- `context/screenshots/notes.md`: profile/00-page-a and 00-page-b (one outlined list with ink rules; title and line left, value and date right).

## Open Questions

1. **How does the next page load?**
   - **Default:** a Show more button at the list's end, as the web. Its four states map one to one, and the screen stays a single ruled column under the collapsing header.
   - **The alternative:** load the next page as the list nears its end, with the same footer for loading, a failure and the end. That would mean moving the screen onto a `FlatList`.

## Out of Scope

- **Opening a game from history** (a detail screen, or replaying a match): not in the web either.
- **Filtering or searching history:** not in the web.

## Notes

- Scope: the History section of Profile, with paging, and its states.
- Depends on: M19a (Profile, the `?state=` preview, pull to refresh).
- Constraints:
  - **The server's record, as it arrives:** the outcome and the found count come from the entry; the client derives nothing beyond labels.
  - **`memorability_score` is never shown** (Hard Constraint 20): rows name the match, never how it was picked.
  - **Never fail silently:** a failed page keeps the rows already shown and offers Try again.
  - **Every wait has a known shape:** a pending Show more stays in place, so the rows don't shift.
  - **A forfeit win reads as a win** with its own label (`historyOutcomeLabel`). Streak rules are the server's.
- **Your part:** on the iOS Simulator, with the backend running:
  - open Profile on the account with the most games, scroll History, then Show more to the end;
  - play one solo run, come back, and pull to refresh: the run is at the top as Today.
- Verification (Claude, Android emulator):
  - **`m16-test`'s real history:** duels from M17 and M18, a room game as Friend, and paging past 20 entries if it has them. If it doesn't, the dev states cover paging;
  - a failed page with the backend stopped (your step, or the dev state), then Try again;
  - the dev states at both sizes;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

- **Deviations recorded during implementation:**
  - Open question 1: Show more button, the default; no other answer was given.
  - Paging lives in `ProfileScreen.tsx`, as in M19a; the route `profile.tsx` only picks the preview.
  - Pull to refresh: `useRefreshHistory` (`use-profile.ts`) trims the cache to page one (`firstHistoryPage`), then refetches, so only the newest page reloads.
  - Added: `ProfileSkeleton` gains the History title and 3 row placeholders at the real row height, as the web's skeleton (every wait has a known shape).
  - `livesLeftLabel` is inlined in `HistoryRow`; no `LivesLeft` file. The row reads "{n} of 11 named" where it shows "{n} of 11".
  - `HistoryMore` doesn't move focus to the first new row when the last page removes the button, as the web does; on native the "Showing {n} games" announcement covers it.
  - Rows use the quiet `rule` divider, as the spec says; the web's `BOARD_LIST` uses ink.
  - Real paging past 20 wasn't exercised: `m16-test` has 14 entries. The dev states cover idle, loading, failed and end.
  - Review: the "Showing {n} games" announcement fires only when the count grows, so a pull trimming the list to page one says nothing.
  - Test: the refresh body moved into a plain `refreshHistory(queryClient, userId)` beside the hook, as `ensureSession`, so `use-profile.test.ts` can check a pull refetches page one only.
- **Follow-up (M24):** at 375 a long date ("28 Oct 2025") truncates the scoreline, as the web does at that width.
- **Follow-up:** a failed pull leaves the history at page one with no notice; Show more recovers it (silent refetch errors, as in M19a).
- **Verified on iOS by the user (2026-11-24):** History scrolled (Show more where shown), a solo run at the top as Today after pull to refresh.

## History
