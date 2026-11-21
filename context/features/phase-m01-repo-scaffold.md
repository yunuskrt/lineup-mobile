# Phase M01 — Repo & Scaffold

## Status

Completed

## Goals

- **Template cleared.** Delete the `create-expo-app` example code:
  - `src/app/explore.tsx`, everything in `src/components/`, `src/constants/`, `src/hooks/` and `src/global.css`;
  - `scripts/reset-project.js` and its script;
  - the example images in `assets/images/` (`react-logo*`, `expo-badge*`, `expo-logo.png`, `logo-glow.png`, `tutorial-web.png`, `tabIcons/`). The icon, splash and Android icon files stay until M27.
- **Blank app** in `src/app/`:
  - `_layout.tsx`: a plain root stack;
  - `index.tsx`: one screen saying "Lineup" on a plain background.
  - Both follow the component template in `coding-standards-mobile.md`. M05 builds the real shell; M03 the theme.
- **iOS and Android only.** `app.json` `platforms: ["ios", "android"]`, and the `web` script, the `web` block and `favicon.png` go.
- **`app.json`:**
  - name "Lineup", scheme `lineup`, orientation portrait, `userInterfaceStyle: "light"`;
  - `ios.supportsTablet: false`, so iPad runs the phone layout;
  - `ios.bundleIdentifier` and `android.package` per Open Questions 1;
  - the New Architecture: on. It's the only architecture in SDK 58; set a flag only if the SDK 58 docs still have one;
  - `slug`, `typedRoutes`, `reactCompiler` and `predictiveBackGestureEnabled: false` stay as the scaffold set them.
- **A development build:** `expo-dev-client` installed with `npx expo install`. The app runs as a dev build on both platforms, not in Expo Go. `ios/` and `android/` are generated and already gitignored.
- **`@/` → `src/`**, as in the scaffold's `tsconfig.json` (kept). `strict` stays on. The `@/assets/*` alias stays for `assets/` imports.
- **Scripts** in `package.json`, named as on web so the skills' commands hold:
  - `lint` (ESLint over the repo);
  - `typecheck` (`tsc --noEmit`);
  - `test` (`vitest run`, with `--passWithNoTests` until M02 adds the first tests and the Vitest config);
  - `format` and `format:check` (Prettier);
  - `build`: `expo export` for iOS and Android into `dist/` (flags checked against the SDK 58 CLI docs). It proves both bundles compile.
- **ESLint** in `eslint.config.js`:
  - `eslint-config-expo` plus `eslint-config-prettier`;
  - the web's two template rules, with the web's comments: `@typescript-eslint/no-empty-object-type` with `allowObjectTypes: 'always'`, and `@typescript-eslint/no-unused-vars` with `varsIgnorePattern: '^React$'`;
  - `dist/`, `ios/` and `android/` ignored.
- **Prettier** installed as a dev dependency, using the committed `.prettierrc` and `.prettierignore`. The repo passes `npm run format:check`.
- **Vitest** installed as a dev dependency for the `test` script; nothing else of Vitest yet.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `package.json` scripts (`lint`, `format`, `format:check`, `test`)
- `tsconfig.json` paths (`@/*` → `./src/*`)
- `eslint.config.mjs`: the `Props` and `React` rules, and `eslint-config-prettier` last in the chain
- `.prettierrc` and `.prettierignore`: already copied in setup (Step 14), kept as they are

No copy list.

## Open Questions

Decided (user, 2026-11-21): **1 → `gg.lineup.app`**, **2 → remove now**.

1. **Bundle id.** Recommended: `gg.lineup.app` for both `ios.bundleIdentifier` and `android.package`, matching the shared `lineup.gg` domain in `project-overview.md`. It's hard to change once the app is in a store.
2. **Web leftovers in `package.json`.** Recommended: remove the packages only the deleted template used (`react-native-web`, `react-dom`, `expo-web-browser`, `expo-glass-effect`, `expo-symbols`, `@expo/ui`, `expo-device`), keeping any that `expo-router` lists as a peer. The alternative is to leave them, since they're harmless, and prune in M27.

## Out of Scope

- The theme, fonts, colours and the splash's colour (M03, M05). The splash keeps the scaffold's look until then.
- Navigation beyond one stack: tabs, the game stack, 404 (M05).
- Icons, bundle signing and EAS profiles (M27).
- Maestro flows (M26). Installing the Maestro CLI is optional here, only if the user approves it.

## Notes

- Scope: a clean, blank, buildable app with the repo's tooling in place. Every later phase builds on these scripts and this layout.
- Depends on: setup (Steps 1–16), done.
- Constraints:
  - Never create or edit `ios/` or `android/` by hand; native settings go in `app.json`.
  - Native packages are installed with `npx expo install`; check the SDK 58 docs before using an Expo API.
  - `@/` imports only, never relative.
  - Comments are one line, at most 75 characters.
  - The two template files follow the component template exactly (`import React` first, `type Props = {}`, arrow const, default export).
- Manual steps are the user's: building and installing the dev build (`npx expo run:ios`, `npx expo run:android`) and starting the simulators. Claude stops, says what to run, and waits.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass. Today the scaffold fails lint (1 error) and typecheck (3 errors), all in template files this phase deletes.
  - Run it on the iOS Simulator and the Android emulator: the dev build opens on the "Lineup" screen. Claude takes a screenshot of each (`xcrun simctl io booted screenshot`, `adb exec-out screencap -p`) and reads them back.
  - What to tap and check: rotate each simulator, and the screen stays portrait. `xcrun simctl openurl booted lineup://` and `adb shell am start -a android.intent.action.VIEW -d lineup://` open the app.

- **Deviations recorded during implementation:**
  - ESLint has a third template rule, `no-empty-pattern` with `allowObjectPatternsAsParameters: true`, because `eslint-config-expo` warns on the template's `({}: Props)`. The three rules are scoped to `.ts` and `.tsx`, where `eslint-config-expo` registers the TypeScript plugin.
  - `build` is `expo export --platform all`. The SDK 58 CLI documents `all` as every configured platform (iOS and Android here), and doesn't document repeating `--platform`.
  - No New Architecture flag: the SDK 58 app config reference has no `newArchEnabled` key.
  - `tsconfig.json` and `assets/expo.icon/icon.json` were reformatted by Prettier, so `format:check` passes with `.prettierignore` unchanged.
  - The blank screen has no styles, only a `SafeAreaView` and `Text`. NativeWind arrives in M03, and a style object here wouldn't fit the styling rules.

- **Follow-ups:** on Android the status bar text is white over the light screen, so it barely shows. `design-mobile.md` wants dark content except over the scoreboard; M05 sets it with the shell.

## History
