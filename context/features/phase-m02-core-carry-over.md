# Phase M02 — Core Carry-over

## Status

Completed

## Goals

- **Copy list A in place:** 139 files from `lineup-web`, each at its web path (A1–A10 in `../lineup-web/context/docs/mobile-repo-setup.md` § Copy lists). Claude checks the set against the list before `/feature start`: none missing, none extra.
- **Dependencies** installed with `npx expo install`, at the web's majors:
  - `zod` 4, `clsx` 2, `tailwind-merge` 3;
  - `@tanstack/react-query` 5, because `src/types/query.ts` augments its types. The setup guide's list leaves it out; M06 uses it anyway.
- **Two component types moved into `src/types/`**, as new files so the copied type files stay untouched:
  - `src/types/guess-input.ts`: `GuessInputStatus` (from the web's `GuessInput.tsx`);
  - `src/types/quit-dialog.ts`: `QuitDialogCopy` (from the web's `QuitDialog.tsx`, with its comment).
  - The four copies that import them change one import line each: `src/lib/duel-session.ts`, `src/lib/solo-run.ts`, `src/lib/practice.ts` and `src/types/canvas.ts`. These are the only edits to copied files.
- **Vitest runs the copied tests:**
  - `vitest.config.mts` copied as is (Node environment, `src/**/*.test.ts`, `tsconfigPaths`);
  - the `test` script drops `--passWithNoTests` and becomes `vitest run`, as on web;
  - the 46 copied test files pass.
- **A Hermes runtime check** at `src/app/dev/runtime.tsx` (`/dev/runtime`):
  - It calls the copied helpers that lean on `URL`, `URLSearchParams` and `Intl` (`DateTimeFormat` and `NumberFormat` in `en-GB`, `Collator`), using the helpers from `filters`, `play-steps`, `room-code`, `archive`, `summary`, `landing` and `suggestions`;
  - each row shows the result next to the value Node gives, with a pass or fail mark;
  - the screen is unstyled, like the M01 screen, and stays as a dev check to rerun after SDK upgrades.
- **`context/web-carryover.md`**, the ledger of every copied file:
  - one row per file, with its web source (the same path), the phase that copied it and its state: *word for word* or *adapted: <what>*;
  - the four import edits are recorded as adaptations;
  - the browser-only parts are flagged with the phase that adapts them: `replaceQuery` in `filters.ts` (`window.history`) for M13, and the open-run flag in `practice.ts` (`sessionStorage`) for M14.

## Your part

After `/feature load` and before `/feature start`, paste copy list A from `lineup-web` into `lineup-mobile`:

- Every file keeps its path. Create a missing folder first, and use ⌘C / ⌘V in Finder, never dragging.
- Leave out exactly what the list's **Leave out** column names: the web-mock tests, `entrance*`, `theme-preview.ts`, the Next.js `route*` files, and the web CSS tests.
- Tell Claude when it's done. Claude checks the 139 files, then starts.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- **Copy list A:** A1–A10 in `context/docs/mobile-repo-setup.md` § Copy lists.
- `src/components/game/GuessInput.tsx`: the `GuessInputStatus` type.
- `src/components/game/QuitDialog.tsx`: the `QuitDialogCopy` type.
- `vitest.config.mts`.

## Out of Scope

- Adapting the browser-only helpers (`replaceQuery` → Expo Router in M13, the practice flag → device storage in M14). In M02 they compile but nothing calls them.
- Copy list B (the transport, config and data hooks) and the real `src/lib/api/index.ts` (M06).
- Any screen beyond `/dev/runtime`, and any styling (M03, M05).

## Notes

- Scope: the web's pure TypeScript compiles, tests green and runs on Hermes inside this repo. Every later phase imports from it.
- Depends on: M01, for the scripts, Vitest and the `@/` alias.
- Constraints:
  - Copies stay word for word, apart from the four import lines. A web fix later is "paste the new version and run `npm test`", which only works if the copies match the web.
  - If a copied file fails this repo's lint (`eslint-config-expo` has rules the web's config doesn't), change the ESLint config when the rule clashes with a web convention. Otherwise fix the file, and record it as an adaptation in the ledger.
  - `@/` imports only; no import from `../lineup-web`.
  - The dev screen follows the component template; `src/app/dev/` may keep several components in one file.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test` (the 46 copied tests), `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Every copied file matches its web original byte for byte, apart from the four with one changed import line. Claude checks this with a diff against `../lineup-web`.
  - Run it on the iOS Simulator and the Android emulator: open `/dev/runtime` (`xcrun simctl openurl booted lineup://dev/runtime`, and the same link on Android). Every row passes on both. Claude takes a screenshot of each and reads them back.
  - What to tap: nothing; the screen runs its checks when it opens.

- **Deviations recorded during implementation:**
  - 45 copied test files, not 46: the earlier count included `vitest.config.mts`, which also imports `vitest`. With the runtime check's test, the suite is 46 files and 890 tests.
  - `src/lib/solo-run.ts` changes two import lines, because it imports both moved types; the other three copies change one.
  - The runtime check is split in three, so its expected values are proven in Node rather than typed by hand:
    - `src/lib/dev/runtime-checks.ts` holds the checks and `runCheck`, which turns a throw into a failed row;
    - `runtime-checks.test.ts` asserts each check in Node, and `runCheck`'s pass, mismatch and throw cases;
    - `src/types/runtime-check.ts` holds both types; the screen only renders the results.
  - It runs 13 checks. Beyond the planned helpers, it covers a time zone (`resetTimeOf` in `solo-allowance`), Unicode normalization (`normalizeName`) and Zod (`isRoomCode`), the other runtime APIs the copies lean on.
  - The packages are pinned at the web's exact versions, not only its majors.
  - No ESLint change and no copy fix were needed: the copies pass this repo's lint as they are.
- **Follow-ups:** `/dev/runtime` is reachable in a release build; Expo Router ships every route. The web 404s its dev pages in production (`requireDevEnv` in `src/lib/dev/route.ts`). M05, which builds the 404, should gate `src/app/dev/` the same way (with `__DEV__`) before any release build (M27).

## History
