# Phase M20b — Pro

## Status

Completed

## Goals

- **`src/app/pro.tsx`** replaces the M05 placeholder. It's pushed with no tabs and renders `ProScreen`, or, in development only, a `?state=` preview.
- **`src/components/pro/ProScreen.tsx`**, as the web's:
  - config failed with no data: `RetryNotice` ("Couldn’t load this page");
  - config unknown: nothing yet;
  - **split off** (`proEnabled` false): `NotFoundView`, so no Pro surface exists;
  - otherwise `ProView` with the plan: `pending` while the session loads, else `pro` or `free` from the session's tier.
- **`ProView.tsx`**, as `design-mobile.md` § 6 Pro:
  - the header chevron, a tilted PRO sticker over the Title "Lineup Pro", and the line "More solo: pick any match, practise it, play without a daily limit.";
  - the plan table in a ruled section;
  - a bottom action pinned above the home indicator, the same height in every plan, so nothing shifts: Free gets `GetProButton`, Pro gets a "You have Pro." sticker (read as a status), and pending gets the empty space.
- **`ProPlanTable.tsx`**, with `pro-plan-table/Value.tsx`: the seven Free vs Pro rows of `project-overview.md` (the web's `ROWS`), as a ruled table (Feature · Free · Pro):
  - the Pro column is filled lavender, so it reads as the offer;
  - "not included" is a minus mark, read as "Not included";
  - a Pro value carries a check mark;
  - each row is read aloud as one item: the feature, then its Free and Pro values;
  - at 375, the feature column wraps to two lines.
- **`GetProButton.tsx`:** a disabled large primary "Get Pro", with "Pro isn’t on sale yet." read as its hint. This is where checkout plugs in later (Deferred: payments).
- **Dev states:** `/pro?state=` shows `free`, `pro`, `pending` and `error`, checked at 390 × 844 and 375 × 667. They're built in this repo, because the web has no Pro samples.

## Mirrors

From the M20 row of the Web References table in `context/todo.md`, read-only in `../lineup-web/`:

- `src/components/pro/`: `ProScreen`, `ProView`, `ProPlanTable`, `pro-plan-table/Value`, `GetProButton`.
- **Already here:** `src/lib/pro.ts` (`showsPro`, `proAccess`, `PRO_PATH`), `src/hooks/use-pro.ts`, `ProLockButton`, `ProLockCaption` (M13a, M15a) and `ProLock` (M20a). There is no copy list.
- `context/project-overview.md` § Free vs Pro, and `context/theme.md` § Pro lock.

## Out of Scope

- **Buying Pro:** native IAP, RevenueCat and restore purchases are deferred, as on the web.
- **New lock placements:** the Pro locks on Play, the summary, rooms and the archive already exist (M13 to M20a).

## Notes

- Scope: the `/pro` screen and the switch-on checks across the app.
- Depends on: M20a (`ProLock`).
- Constraints:
  - **With the split off, no lock, no price and no word "Pro" appear anywhere** (`theme.md` § Pro lock). `/pro` is a not-found screen, as the web's real 404.
  - **The tier is the server's** (Hard Constraint 16): the plan comes from the session, never asserted by the client.
  - **Nothing purchasable affects a duel** (Hard Constraint 15): the table is copied as written, with duels unlimited on both plans.
- **Your part:** restart the backend with `PRO_ENABLED=true`, then on the iOS Simulator, signed in as Free:
  - See Pro from a lock opens `/pro`, and the chevron returns;
  - Profile shows the Free sticker and its See Pro;
  - restart with the switch off: `/pro` is not found, and no "Pro" shows on Play, Profile or the archive.
- Verification (Claude, Android emulator):
  - with the switch on (your restart): `/pro` as Free and as Pro; every lock opens it; Profile's plan line, the M19a check deferred to here;
  - with the switch off: the not-found screen, and no Pro wording on the screens above;
  - the dev states at both sizes;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Deviations recorded during implementation:**
  - `Screen` gained two slots: `footer` (a row pinned under the scroll, clear of the home indicator) and `aboveTitle` (the PRO sticker over the large title). Welcome and `ResultFrame` pinned their rows by hand.
  - `Button` and `PressableFace` gained `accessibilityHint`, so "Pro isn’t on sale yet." is read as the hint; the visible line is hidden from the reader so it isn't heard twice.
  - The rows, the row label and the plan live in a new `src/lib/pro-plan.ts` (`PRO_ROWS`, `proRowLabel`, `proPlanOf`) with `src/types/pro-plan.ts`: `src/lib/pro.ts` and `src/types/pro.ts` are word-for-word web copies and stay untouched. Tests: `pro-plan.test.ts`, `dev/pro-states.test.ts`.
  - Columns are 38% · 28% · the rest, not the web's 38% and two equal: at 375, "Unlimited" broke mid-word beside the Pro check.
  - The error state is `ProLoadFailed`: a screen titled "Couldn’t load this page" over the `RetryNotice`, shared with the `error` dev state. The unknown-config state is a blank cream view, not `null`.
  - The chevron falls back to Play when nothing is behind `/pro` (`leavePro`), so a cold link isn't a dead end.
  - "As Pro" against the real backend was skipped: it needs a stored `tier` of `pro`, set only by a database edit, and the shared database stays untouched (user, 2026-11-24). The `pro` dev state covers the view.
- **Follow-ups (review):** the error screen's title "Couldn’t load this page" runs past ~20 characters, so `design-mobile.md` would set it in the long-title type (Archivo Bold 20); `Screen` has one title style. A `Screen` title variant fits M24 (visual polish).
- **Verified on Android (2026-11-24):** switch on, as Free: See Pro on the archive lock and on Profile opens `/pro`, the chevron returns, and Profile shows the Free sticker, its line and See Pro. Switch off: `/pro` is the not-found screen; Play steps 1 and 3, Profile and the archive show no Pro wording, no locks and no runs-left line. Dev states at 390 and 375.
- **Verified on iOS by the user (2026-11-24):** See Pro from a lock opens `/pro` and the chevron returns; Profile shows the Free sticker and See Pro; with the switch off, `/pro` is not found and no Pro shows on Play, Profile or the archive.

## History
