# Phase M03 — Theme & Fonts

## Status

Completed

## Goals

- **NativeWind runs on SDK 58**, at the version picked in Open Questions 1. Its setup files, and nothing more, as its current docs list them:
  - `global.css`, imported once in `src/app/_layout.tsx`;
  - the Babel and Metro wiring;
  - the NativeWind types file;
  - the Tailwind config.

  Step one is a compatibility check: one NativeWind class rendering on both simulators before any theme work. Neither NativeWind release lists SDK 58 yet. If it fails, stop and ask.
- **Tokens as TypeScript, one source for classes and style objects:**
  - `src/styles/tokens.ts`: the web's palette under its `tokens.css` names (`cream`, `lavender`, `duel-blue`, `ink`, `tint-green`…), plus the space, radius and shadow-offset scales;
  - `src/styles/theme.ts`: the web's colour roles under their `theme.css` names (`surface`, `line`, `rule`, `fg-muted`, `you`, `opponent`, `turf`, `scoreboard`…). Each role points to a token. The four mixed roles take the hex values in `design-mobile.md` § Tokens, confirmed once against a CSS Color 4 implementation (`culori` in the scratchpad, or Chrome's computed style).
  - The roles map is typed against the copied `RoleToken` union in `src/styles/contrast.ts`, so a role the web's contrast suite knows can't go missing here.
- **The Tailwind theme reads those files.** Class names then match the web's: `bg-surface`, `text-fg-muted`, `border-line`, `bg-brand`, `text-you-text`…
  - colours: every role, and no default Tailwind palette;
  - type sizes: `text-12` … `text-72`, each with its line height from `design-mobile.md` § Type;
  - spacing in points on the web's 4pt base, so `p-4` is exactly 16pt (NativeWind's default rem would make it 14);
  - radii: `sm` 6, `md` 10, `lg` 16, `full`;
  - font families, one per embedded face.
- **Hard shadows as a style token.** NativeWind doesn't document mapping its shadow classes to React Native's `boxShadow`. So `src/styles/shadow.ts` exports the two hard shadows (`shadow-hard` 4/4, `shadow-hard-sm` 2/2, ink, no blur) as `boxShadow` style values, for the style-object exception in the standards. M04's kit builds the pressable plate on the same offsets.
- **Fonts embedded at build time** with the `expo-font` config plugin:
  - The Archivo files in `assets/fonts/` are renamed to their PostScript names (`ArchivoSemiExpanded-ExtraBold`, `ArchivoExpanded-Black`, `Archivo-Bold`), so one family name works on iOS and Android. `Archivo_Expanded-ExtraBold.ttf` is dropped: unused at phone sizes.
  - Inter 400, 500 and 600 come from `@expo-google-fonts/inter`. They're embedded under their PostScript names the same way, with the package kept as the source.
  - No face sets `fontWeight`: each family name is one face.
- **Type roles** in `src/styles/classes.ts`, as NativeWind class strings named as on web: `TYPE_DISPLAY`, `TYPE_TITLE`, `TYPE_SECTION`, `TYPE_CARD_TITLE`, `TYPE_TITLE_LONG`, `TYPE_NUMBER`, `TYPE_ROOM_CODE`, `TYPE_STICKER`, plus `SECTION_LABEL`. Their faces and sizes are in `design-mobile.md` § Type, where a face (a font family) stands in for the web's `font-stretch`.
- **`/dev/theme`** (`src/app/dev/theme.tsx`): the web page's sections, rebuilt natively on the theme. It covers primitives, roles, type roles, outline and shadow, type, spacing and radius, each swatch labelled with its name and hex.
- **Three checks `design-mobile.md` left for this phase**, recorded in the spec:
  - the mixed colour values (above);
  - the shadow direction on a device: 4/4 lands down and to the right;
  - whether the slashed zero can be switched on (Open Questions 2). `tabular-nums` comes from React Native's `fontVariant` style.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/styles/tokens.css`, `src/styles/theme.css`: names and values
- `src/styles/classes.ts`: `TYPE_*` and `SECTION_LABEL`
- `src/app/globals.css`: how the web maps tokens to Tailwind (`--color-*`, `--text-*`, `--spacing`, `--radius-*`, `--shadow-*`)
- `src/app/layout.tsx`: the fonts (Archivo with its width axis, Inter)
- `src/app/dev/theme/`: the preview page's sections
- `context/screenshots/notes.md` § Fonts: the type roles

No copy list.

## Open Questions

Decided (user, 2026-11-21): **1 → NativeWind v4.2.7**, **2 → plain zeros** if the slashed zero can't be switched on.

1. **NativeWind version.** Neither release lists Expo SDK 58.
   - **Recommended: v4.2.7**, the stable release (Tailwind 3, `tailwind.config` in TypeScript). The config can import `src/styles/tokens.ts` and `theme.ts`, so classes and style objects share one source.
   - The alternative is **v5** (Tailwind 4, a CSS-first `@theme` like the web's), which its docs call a pre-release "not intended for production".
2. **Slashed zero.** NativeWind lists `slashed-zero` as web only, and React Native's `fontVariant` has no `zero` value. Recommended: if M03 can't switch Archivo's `zero` feature on, the clock and the score use plain zeros (`design-mobile.md` open question 3).

## Out of Scope

- `CODE_BOX`, the room-code character box: it relies on `first:` and `last:` sibling variants. It's built as a component with the join and room screens (M13, M17).
- Components and the pressable plate (M04); the screen background, the status bar and the shell (M05).
- Android below 9, where static `boxShadow` doesn't draw (minimum here is API 24): `design-mobile.md` open question 2, settled in M04 with the plate.
- Dark mode: the app is light only.

## Notes

- Scope: the web's palette, roles, type, space, radii and shadows available natively. The fonts load, and one screen shows them all on both platforms.
- Depends on: M02, for `src/styles/contrast.ts` and its `RoleToken` type.
- Constraints:
  - No hard-coded colour outside `tokens.ts`: classes, style objects and the shadow helper read the tokens.
  - Native packages and config-plugin changes are installed with `npx expo install`; check NativeWind's and Expo's current docs (Context7) before writing the config.
  - The Tailwind config is tooling at the repo root, not app code. Its import of `src/styles/` is the one relative import, if `@/` doesn't resolve there.
  - Comments are one line, at most 75 characters.
- **Your part:**
  - After the Babel and Metro changes, restart Metro with `npx expo start --clear`.
  - After the fonts are embedded, rebuild the dev build on both (`npx expo run:ios`, `npx expo run:android --no-bundler`).
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - A test pins the role values, including the four mixed ones, and that every role resolves to a token.
  - Run it on the iOS Simulator and the Android emulator:
    - open `lineup://dev/theme` on both;
    - every swatch shows its colour, and each face shows in its own font (no system-font fallback);
    - the hard shadow sits down and to the right.
    - Claude takes a screenshot of each and compares them with the web's `/dev/theme`.
  - What to tap: nothing; scroll the page to see every section.

- **Deviations recorded during implementation:**
  - **No `src/styles/theme.ts`:** the roles live in `tokens.ts`. Tailwind loads its config through `jiti`, outside Metro, and `jiti` can't resolve `@/`. So the files the config imports may have no runtime `@/` import. `tokens.ts` has only a type import, and `src/styles/tailwind-theme.ts` builds the theme from tokens passed in. The root `tailwind.config.ts` imports both relatively, as tooling.
  - **The Inter family is `body`, not `sans`:** `font-body`, `font-body-medium`, `font-body-semibold`. NativeWind's preset claims `sans`, `serif` and `mono` through `theme.extend`, which wins over the theme's own value. So `font-sans` rendered the system font: a serif fallback on iOS, Roboto on Android. A test now fails if any family name is one the preset claims.
  - **Slashed zero: not available, so plain zeros (decided).** Every Archivo file has `zero` and `tnum`, but no `ss01`–`ss20` set, and React Native's `fontVariant` reaches stylistic sets, not `zero`. `TABULAR_NUMS` uses `fontVariant: ['tabular-nums']`.
  - **Mixed colours confirmed against `culori`**, a CSS Color 4 implementation. `gate-scrim` needs premultiplied alpha, as CSS mixes, to stay ink at 40% (`#1f1b1666`).
  - **Shadow direction checked:** 4/4 lands down and to the right on both platforms. A positive `offsetY` points down, as in CSS.
  - **NativeWind's Metro plugin** added `nativewind-env.d.ts` to `tsconfig.json`'s `include` on first start; kept and reformatted. Metro also sets `inlineRem: 16`, besides the explicit spacing scale.
  - **`/dev/theme?section=<id>`** shows one section alone (`primitives`, `roles`, `type-roles`, `shadow`, `type`, `spacing`, `radius`). iOS can't be scrolled from a shell, so this is how each section was screenshotted.
  - **Compared with the web by value, not by screenshot:** this setup has no browser to drive. The tests pin the hex values, and the 45 role names match the web's `theme.css` exactly.
  - **Fonts:** Inter's three files are copied from `@expo-google-fonts/inter` into `assets/fonts/` under their PostScript names, with `OFL-Inter.txt`. Archivo's licence is renamed to `OFL-Archivo.txt`. `tailwindcss`, `babel-preset-expo` and `@expo-google-fonts/inter` are dev dependencies.
  - **Native rebuild:** `npx expo prebuild` had to run before `expo run:*`. The run commands don't re-apply `app.json` to existing native folders.
- **Follow-ups:**
  - React Native's `Text` defaults to the system font. M04's kit text should default to `font-body`.
  - Turkish capitals at a line height of 1.0 (display at 34/34) are still untested; they rendered fine at 20/25. Check with the Welcome headline in M07 (`design-mobile.md` § Type).

## History
