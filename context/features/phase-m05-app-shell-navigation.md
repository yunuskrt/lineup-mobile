# Phase M05 — App Shell & Navigation

## Status

Not Started

## Goals

- **Root layout** (`src/app/_layout.tsx`):
  - a `GestureHandlerRootView` around everything;
  - Expo Router's `ThemeProvider` on `DefaultTheme`, with `background` and `card` set to `surface`, `text` to `fg` and `border` to `line`, so no white shows between screens;
  - `expo-status-bar` set to dark content (the M01 follow-up: Android's status bar text is white over cream today);
  - a root `Stack` with no native header, where every push slides in from the right on both platforms (`animation: 'slide_from_right'`).
- **Routes**, mirroring the web's paths (`coding-standards-mobile.md` § Structure):

  | File                                                    | Path                                | Shell                                               |
  | ------------------------------------------------------- | ----------------------------------- | --------------------------------------------------- |
  | `src/app/index.tsx`                                     | `/`                                 | Redirects to `/play` (M07 adds the first-launch welcome) |
  | `src/app/(tabs)/_layout.tsx`                            | —                                   | `Tabs` with the sticker tab bar, no switch animation |
  | `src/app/(tabs)/play.tsx`, `archive.tsx`, `profile.tsx` | `/play`, `/archive`, `/profile`     | Tab screens                                         |
  | `src/app/sign-in.tsx`, `src/app/pro.tsx`                | `/sign-in`, `/pro`                  | Pushed over the tabs, no tab bar                    |
  | `src/app/(game)/_layout.tsx`                            | —                                   | A full-screen stack with the back swipe off         |
  | `src/app/(game)/play/solo.tsx`, `duel.tsx`              | `/play/solo`, `/play/duel`          | Game screens, no tab bar                            |
  | `src/app/+not-found.tsx`                                | any unknown path                    | The 404                                             |

  Every screen is a placeholder for now: its header, plus a `StateNotice` (info tone) naming the phase that builds it.
- **Sticker tab bar** (`src/components/shell/TabBar.tsx`, passed to `Tabs` as `tabBar`), with its button in `src/components/shell/tab-bar/TabButton.tsx`. It follows `design-mobile.md` § 4:
  - Play, Archive and Profile, with Lucide `Play`, `LayoutGrid` and `User` icons;
  - a cream bar with a 2pt ink rule on top, 56pt tall plus the bottom safe area;
  - the active tab's icon sits in a lavender pill with a 2pt ink outline and the small hard shadow, over an Inter 600 12 label in ink;
  - inactive tabs have an umber icon and label;
  - each tab is at least 44pt, gives a light haptic on press-in, and is announced as a selected tab.
- **Screen scaffold** (`src/components/shell/Screen.tsx`):
  - safe areas on every edge the tab bar doesn't cover;
  - the cream background;
  - a large left-aligned title (Title role) at the top of the scroll;
  - once the title scrolls past, a compact bar fades in: cream, the title at 20pt, and a 2pt ink rule under it;
  - an optional back chevron in a 44pt target.

  The collapse amount is a pure `'worklet'` function, `headerCollapse(scrollY, titleHeight)` in `src/lib/screen-header.ts`, so it's testable in Node (as `shouldDismiss` was in M04b).
- **Game stack:**
  - `gestureEnabled: false` on `(game)`, so iOS can't swipe back out of a run;
  - `src/hooks/use-game-back.ts`: Android's back button calls a handler instead of leaving the screen. The placeholders open an M04b `Dialog` with it; M14 and M18 pass the real quit and forfeit dialogs;
  - `src/components/shell/QuitChip.tsx`: the web's `QuitChip` as an ink ✕ in a 44pt target, labelled "Quit". It calls `onQuit` when given, and otherwise goes back to `/play`. M11 puts it on the scoreboard.
- **404:**
  - `src/components/shell/NotFoundView.tsx`: the web's 404 copy. That's the 404 number (Numbers role), the butter "Off the pitch" sticker and the title "Can not find the page", with one primary **Play** button that replaces the route with `/play`;
  - mobile has no home page, so the web's Home button is dropped;
  - the screen shows a back chevron when there's a screen to go back to.
- **Dev routes gated** (the M02 follow-up): `src/app/dev/_layout.tsx` renders `NotFoundView` unless `__DEV__`, as the web's `requireDevEnv` 404s its dev pages in production.
- **Splash:** `expo-splash-screen` turns cream (`surface`, `#fefae0`) in place of the template's blue, with the image from Open Questions 1. A test checks that `app.json`'s splash colour equals `ROLES.surface`.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/app/` route groups and layouts: `(game)` becomes the game stack. `(site)` with its `SiteNav` becomes the tabs.
- `src/components/shell/SiteNav.tsx` and `NavAccount.tsx`: their destinations map to the tab bar, where Profile stands in for the account link. The signed-in or guest state stays out until M06 and M07.
- `src/components/shell/QuitChip.tsx`, `src/components/shell/NotFoundView.tsx`, `src/app/not-found.tsx`
- `src/lib/dev/route.ts` (`requireDevEnv`): the dev gate

No copy list.

## Open Questions

Decided (user, 2026-11-21): **1 → a temporary "Lineup" wordmark**, replaced in M27.

1. **The splash image.** The template's splash shows Expo's logo, and the final app identity is M27.
   - **Recommended: cream with the current `splash-icon.png` until M27.** It's one config change, it needs no new asset, and M27 replaces the art anyway.
   - Make a temporary "Lineup" wordmark PNG now, in Archivo Expanded Black and ink on cream. It looks right sooner, but it's an asset that M27 throws away.

## Out of Scope

- Screen content: Welcome and Sign in (M07), Play (M13), the game (M11 and M14), Profile (M19), Archive and Pro (M20).
- The scoreboard's light status bar on the game screen (M11).
- The real quit and forfeit dialogs (M14, M18), and the session-aware account state (M06, M07).
- Pull to refresh (M19, M20), and the app icon and final splash art (M27).

## Notes

- Scope: the navigation frame every later screen drops into, with placeholder screens.
- Depends on: M04 (Dialog, StateNotice, Button, Text, the press haptic).
- Constraints:
  - `/play/duel` is one route for the whole session, never split into routes (`coding-standards-mobile.md` § Expo Router).
  - No `+api.ts` routes.
  - Portrait only, and safe areas on every screen.
  - Game screens disable the back swipe, and Android's back never leaves them directly.
  - 44pt targets; theme tokens only. Navigator options take `ROLES` values where NativeWind can't reach, with the one-line comment.
  - The template, one component per file, and `@/` imports.
  - Check the current Expo Router docs (Context7) for `Tabs`' `tabBar`, `+not-found` and the group layouts before building.
- **Your part:**
  - The splash change needs a fresh dev build: `npx expo prebuild`, then `npx expo run:ios` and `npx expo run:android`.
  - On the iOS Simulator: switch tabs, push Sign in and swipe back, open a game placeholder and try to swipe back (it must stay), and scroll a tab until its title collapses.
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests:
    - `headerCollapse`: 0 at the top, 1 once the title has scrolled past, clamped at both ends;
    - the splash colour check;
    - the tab list names `/play`, `/archive` and `/profile`, in that order.
  - On the iOS Simulator and the Android emulator:
    - a cold start lands on Play, with the tab bar as `design-mobile.md` § 4 draws it;
    - tabs switch without animation, and pushes slide in from the right on both;
    - the status bar text is dark on both;
    - `lineup://nowhere` opens the 404, and its Play button lands on the Play tab;
    - on Android, Back on a game placeholder opens the dialog and stays, and Back on Sign in returns to the tabs.
  - `/dev/*` still opens in the dev build. The release gate is `__DEV__`, checked in code; a release build is M27.

- **Deviations recorded during implementation:**
  - **The splash wordmark** is `assets/images/splash-wordmark.png`: "Lineup" in ink, drawn in Archivo Expanded Black on a transparent 1024pt square. It was rendered by a one-off CoreText script, because no image tools are installed; the script isn't kept. At `imageWidth` 200 it fits Android 12's round splash mask. The template's `splash-icon.png` is now unused but kept; M27 decides about it.
  - **`@/app.json` path alias** in `tsconfig.json`, beside `@/assets/*`, so the splash test imports `app.json` without a relative import or Node types.
  - **The root stack also turns off the swipe for `(game)`.** The group is the first screen of its own stack, so a swipe there would pop the whole group from the root stack.
  - **The 404's large title is "Not found"** (the web's page title, `NOT_FOUND_TITLE`). The 404 number and sticker sit under it, then "Can not find the page" as a section heading, because the screen frame always leads with its title.
  - **Placeholders:** Play carries buttons to Solo, Duel, Sign in and Pro, so every route can be reached by tapping until M13. Archive shows 12 skeleton rows, which gives it something to scroll for the title collapse. The game placeholders share `src/components/shell/GamePlaceholder.tsx`, and the others share `PlaceholderScreen.tsx`.
  - **The dev gate renders `Slot`** in a dev build, so the dev pages keep the root stack's push.
- **Verified on Android:**
  - a cold reload lands on Play, with the sticker tab bar and dark status bar text;
  - Archive scrolls, and its title collapses into the bar with its ink rule;
  - Sign in opens without the tab bar, and Back returns to the tabs;
  - Back on Solo opens the dialog and stays, and Leave returns to Play;
  - `lineup://nowhere` opens the 404, and its Play button lands on the Play tab;
  - `/dev/kit` still opens.
- **Verified by the user after the rebuild (2026-11-21):** on iOS, tabs switch, Sign in swipes back, Solo stays put on a swipe and its ✕ opens the dialog, and Archive's title collapses on scroll. The cream splash with the wordmark shows on both platforms; Claude captured it on Android too.

## History
