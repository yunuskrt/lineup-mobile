# Phase M19a — Profile Screen

## Status

Completed

## Goals

- **`src/app/(tabs)/profile.tsx`** replaces the M05 placeholder. It reads `useSession`, `useProfile` and `useHistory` (copied in M06) through the copied `profileScreenView`, and passes `onRetry` as the web's `ProfileScreen` does. In development a `?state=` param renders a state from the copied `profile-states.ts` instead, as the web's `ProfileStatePreview` does.
- **`src/components/profile/ProfileView.tsx`** switches on the view's status, inside the M05 `Screen` titled "Profile", with the tab bar:
  - **loading:** `ProfileSkeleton`;
  - **signed out:** `ProfileNotice`, "No profile yet", with Play and Sign in;
  - **error:** `ProfileNotice` over the existing `RetryNotice`, "Couldn't load your profile", with Try again;
  - **ready:** the sections below, as open ruled sections, never one box around the page (`design-mobile.md` § 3).
- **`profile/ProfileHeader.tsx`:** a mint avatar with the handle's initial (`handleInitial`), the handle, a butter **Guest** sticker for a guest, and the plan.
- **`profile/ProfilePlan.tsx`:** shown only while the Free/Pro split is on (`showsPro`). It holds a Pro or Free sticker, "You're on Pro." or "You're on the Free plan.", and See Pro (to `/pro`) for Free.
- **`profile/GuestUpgrade.tsx`:** for a guest, above the record, as the design's guest strip. It says "You're playing as a guest. Create an account to keep your history on any device. Nothing you've played is lost.", and Create account opens `/sign-in?mode=sign-up` (M07's upgrade).
- **`profile/DuelRecord.tsx`:** the screen's one lavender block, with a 2pt ink outline and the hard shadow:
  - "Duel record" and the count (`duelCountLabel`) over an ink rule;
  - Won, Drawn and Lost, each a large number under its label, with a `duel-record/LetterTile.tsx`: W in your colour, D split between both colours, L in danger, and plain white tiles before any duel;
  - the record bar (`recordShares`), with ink gaps between its segments, and plain white before any duel.
- **`profile/ProfileStats.tsx`:** four tiles in a white 2 × 2 grid split by ink rules: Solo runs (`soloRunCount`), Perfect clears, Best streak and Accuracy (`accuracyStat`).
- **Sign out** closes the column for an account, as a secondary button (`useSignOut`), with "Signing out…" while pending and its error in an alert. Once signed out, the screen shows the signed-out notice.
- **Pull to refresh** refetches the profile and the history, with the spinner in ink (`design-mobile.md` § 4). `Screen` gains an optional `onRefresh` and `isRefreshing`, used only here so far.
- **`profile/ProfileSkeleton.tsx`:** placeholders the size of the loaded parts, built from the same classes so nothing shifts. A guest's skeleton (`loading-guest`) holds the guest strip's space. It breathes slowly, and stays still under reduced motion.
- **`src/components/profile/styles.ts`:** the classes the parts share (the record block, the letter tile, the stat grid), as the web's.
- **Dev states:** `/profile?state=` renders `loading`, `loading-guest`, `signed-out`, `error`, `empty`, `guest` and `populated` in development. The History section is M19b's.

## Mirrors

From the M19 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/profile/`: `ProfileScreen`, `ProfileView`, `ProfileHeader`, `ProfilePlan`, `GuestUpgrade`, `DuelRecord` and `duel-record/LetterTile`, `ProfileStats`, `ProfileNotice`, `ProfileSkeleton` and `styles.ts`.
- `src/lib/profile.ts` and `src/lib/dev/profile-states.ts`, already copied (M02).
- `src/app/(site)/(pages)/profile/page.tsx` and `src/components/dev/ProfileStatePreview.tsx`, for the `?state=` preview.
- `src/components/auth/SignedInPanel.tsx`, for sign-out's copy and error.
- `context/screenshots/notes.md`: profile/00-page-b (phone stacking: a title, one lavender hero, a ruled list), profile/03-record-a and profile/03-record-b.

## Open Questions

1. **Sign out for a guest?** The design puts Sign out at the end of the column. A guest who signs out can't sign back in, because their identity lives only on this device, so their history is out of reach.
   - **Default:** accounts only. A guest sees the strip with Create account instead, and still has Sign out on `/sign-in`, as in M07.
   - **The alternative:** show it to everyone, as the web's sign-in panel does.

## Out of Scope

- **History:** the list, its rows, paging and the empty history (M19b).
- **The `/pro` page:** M20. See Pro opens the existing placeholder.
- **A guest's upgrade itself:** built in M07. This screen only links to it.

## Notes

- Scope: everything on Profile above the history, plus the screen's states, sign out and pull to refresh.
- Depends on: M05 (`Screen`, the tab), M06 (`useProfile`, `useHistory`, the session), M07 (sign-up, the upgrade, `useSignOut`), M04 (avatar, sticker, alert, skeleton).
- Constraints:
  - **Guest play is first-class** (Hard Constraint 12): the guest strip invites, never blocks, and says that nothing is lost.
  - **Pro status is the server's** (Hard Constraint 16): the plan line reads `tier` and the config's switch. With the switch off, no "Pro" or "Free" appears anywhere.
  - **No polling:** the profile refreshes on focus (M06's `focusManager`) and on pull, never on a timer.
  - **Queries are keyed by user** (`use-profile.ts`), so a new identity never sees the old numbers.
  - **You are blue, the opponent orange, a loss red;** never red against green. A draw shows both colours, neither leading.
  - Text scaling stays on. Only the record's big numbers cap it (`maxFontSizeMultiplier`), as fixed-size figures.
  - The component template, one component per file, and parts in `profile/` subfolders by parent.
- **The design (`design-mobile.md` § 6, Profile):** the guest strip sits above the hero, Sign out is a secondary button at the end of the column, and at 375 the stat grid stays 2 × 2 with its labels wrapping.
- **Your part:** on the iOS Simulator, with the backend running:
  - open Profile as the account you've been testing with, then pull to refresh;
  - as a guest (Welcome, then Continue as guest), see the guest strip, then Create account and come back;
  - sign out from Profile.
- Verification (Claude, Android emulator):
  - the real profile of `m16-test` (its duels from M17 and M18) and of a fresh guest;
  - the 7 dev states at 390 × 844 and 375 × 667;
  - pull to refresh, sign out, then the signed-out notice;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

**Deviations recorded during implementation**

- **The guest strip** is its own white panel with a small hard shadow, not the kit's `Alert`: that one holds text only, and an alert role would interrupt.
- **The handle** uses the Section type (24): the screen's "Profile" title holds the Title role, where the web's page has the handle as its heading.
- **The avatar** is the kit's `Avatar` given `handleInitial`, so the letter is Inter 600 at 16 rather than the web's Archivo 20.
- **Sign out** sits in `profile/profile-view/SignOut.tsx`, a part only `ProfileView` uses, with `SignedInPanel`'s copy and error alert.
- **Pull to refresh** is offered on the ready and error states only. A local flag drives the spinner, so a refetch on focus never shows it.
- **The skeleton** pulses each placeholder through the kit's `Skeleton`, rather than the whole board as on web.
- **Not checked here:** the plan line needs the backend's `PRO_ENABLED` on, which no dev state covers. Its check is part of M20.
- **Review fix:** a pull with no signed-in user reloads only the session. TanStack's `refetch` ignores `enabled`, so the profile query would otherwise run without a token.
- **Follow-up (M19b):** a pull refetches every loaded history page. M19b's "reloads from its first page" needs the infinite query reset instead.
- **Verified on iOS by the user (2026-11-24):** pull to refresh, the guest strip and Create account, and Sign out.

## History
