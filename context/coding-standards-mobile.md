# Coding Standards — Mobile (Expo React Native)

For `lineup-mobile`. Read alongside `coding-standards.md`, which always applies.

This repo renders the game and transmits input. It has **no database access, no Prisma, no football provider calls, no game logic and no mock adapter.**

## Structure

```text
src/
  app/[route].tsx             screens and _layout.tsx navigators (Expo Router)
  components/[feature]/       components
  hooks/                      custom hooks
  lib/api/                    the API client — the only place fetch() appears
  lib/api/socket/             the Socket.IO duel client
  types/[feature].ts          repo-local types
  styles/                     theme, motion
```

- Routes mirror the web's paths: `/`, `/sign-in`, `/play`, `/play/solo`, `/play/duel`, `/profile`, `/archive`, `/pro` and `/dev/*`. Deep links and analytics events then name the same screens on every platform.
- **A file copied from the web keeps its web path** (`src/lib/room-code.ts` stays `src/lib/room-code.ts`), so the two copies are easy to compare.

## Web and Backend References

- `../lineup-web` and `../lineup-backend` are **read-only references**. Read them for behaviour, states, copy and the contract. Never edit them.
- **Never import from them.** This repo must build with the other two deleted.
- A file this repo needs is **copied in**, owned here from then on, and listed in `context/web-carryover.md`. Components are never copied: they are rebuilt natively, with the web as the reference.

## The API Client

Everything the app knows about the backend lives in `src/lib/api/`.

- One typed `ApiClient` interface in `src/lib/api/client.ts`, grouped by domain (`auth`, `catalog`, `solo`, `profile`), plus a `DuelClient` in `src/lib/api/duel-client.ts` for the realtime duel. Every call returns data parsed with this repo's own Zod schemas in `src/lib/api/schemas/`.
- Those schemas are this repo's transcription of the backend contract. When the backend changes, they change here too — there is no shared package to update once.
- **No component ever calls `fetch` directly.** A component that builds its own URL is a component that cannot be retried, re-pointed or given the session token.
- The client is an **interface with one implementation: the real one. There is no mock.** The web's mock carries a copy of the rules, which no client may hold. Dev screens use static samples instead.
- Base URL comes from `EXPO_PUBLIC_API_URL`. Never hardcoded.
- **Bearer tokens, no cookies.** The session token arrives in the `set-auth-token` response header on sign-up, sign-in, guest and upgrade. It is kept in `expo-secure-store` and nowhere else, and sent as `Authorization: Bearer <token>`. Never log it.

## Data Fetching

- **TanStack Query** for all server data — caching, retries, invalidation and loading states.
- Query's `focusManager` is wired to `AppState` and its `onlineManager` to NetInfo, so refetch-on-focus and pause-when-offline work as they do in a browser.
- **A reducer hook** for live duel session state, which arrives by socket rather than by request: `useDuel` over the pure reducer in `src/lib/duel-session.ts`, as on web. No store library.
- Never poll for state the socket already pushes.

## React

- Functional components only; no class components.
- Use hooks for state and side effects.
- Keep components focused on one responsibility.
- Extract reusable logic into custom hooks.

### Component and Screen Structure

Every React component and Expo Router screen must follow this basic structure:

```tsx
import React from 'react'

type Props = {}

const TestComponent = ({}: Props) => {
  return (
    ...
  )
}

export default TestComponent
```

The following must exist in every component/screen:

```tsx
import React from 'react';

type Props = {};

const ComponentName = ({}: Props) => {};
```

- Keep the `Props` type even when the component currently has no props.
- In every file `React` is the first import, and any other `react` names join it: `import React, { useState, type ReactNode } from 'react'`.
- **No `'use client'`.** It means nothing in React Native; don't copy it over from a web file.
- **One component per file.** A component used only by its parent moves into a subfolder named after the parent in kebab-case: `duel/LobbyPanel.tsx` stays, and its parts go to `duel/lobby-panel/Searching.tsx`, `duel/lobby-panel/RoomWaiting.tsx`… A component other files also use stays top-level in the folder as its own file (`pro/ProLockButton.tsx`).
- **Exempt:** `src/components/ui/` (the native kit), `src/components/dev/` and `src/app/dev/` may keep several components in one file. Each still follows the template (arrow const and a props type) but uses **named** exports, as a file can have only one default. A bare `Props` can't repeat in one file, so where a file holds several components each names its own `<Name>Props`; a single-component file uses `Props`.
- Non-component exports (constants, types) stay named exports, beside the component's default export.
- **Props types other files import** (`ResultActionsProps`, `NamedOrderProps`, `MarkProps`) stay exported under their name, and the file adds `type Props = <thatType>`.
- **Union or generic props** keep a single `props` parameter instead of destructuring, as destructuring a union loses narrowing. A generic component carries its parameter on the arrow: `const AuthForm = <S extends z.ZodType>(props: Props<S>) => …`.
- **Split parts share class constants** through a sibling `styles.ts` in the parts' subfolder (`duel/lobby-panel/styles.ts`), never by importing them back from the parent. Shared values that aren't classes (a transition, a stage config) go to a sibling `shared.ts`, and a value only one file uses stays in that file. Constants two parents share go to the folder's own `styles.ts` or `shared.ts` (`play/styles.ts`, `game/styles.ts`). A hook one part uses moves with that part; a hook two files share goes to `src/hooks/` (`use-seconds-left.ts`). A file left with no component after a split moves its constants into that subfolder and is deleted.
- **JSX comments:** single-line `{/* … */}` are fine inside markup; the 75-character limit still applies.
- Replace `ComponentName` with the actual component name.

Because `type Props = {}` would otherwise be rejected by `@typescript-eslint/no-empty-object-type`, that rule is configured with `allowObjectTypes: "always"` in `eslint.config.js`. The `react-jsx` transform doesn't need `import React`, so `@typescript-eslint/no-unused-vars` ignores that one name (`varsIgnorePattern: "^React$"`). Don't "fix" the empty `Props` type or drop the `React` import to satisfy a linter — the template wins.

## Expo Router

- Every file in `src/app/` is a screen and `_layout.tsx` files define navigators. Both follow the template above. Non-route code stays outside `src/app/`.
- Use dynamic routes for item, collection and other resource screens.
- **No API routes (`+api.ts`).** They would be a proxy to the backend — a hop that hides errors and drifts from the contract.
- `/play/duel` is one route for the whole realtime session. Matchmaking, gameplay and result are phases rendered inside it. A route transition mid-duel risks tearing down the socket and the React tree holding session state.

## Native

- **Portrait only.**
- **Safe areas on every screen**: no content under the notch, the status bar or the home indicator.
- **Game screens disable the back swipe.** Android's back button opens the quit dialog (solo) or the forfeit dialog (duel) and never leaves the screen directly.
- **The guess input and the pitch stay visible above the keyboard.** A guess typed blind is a lost round.
- **Touch targets are at least 44pt** in both directions.
- **Text scaling stays on.** Cap it with `maxFontSizeMultiplier` only on fixed-size game pieces (pitch discs, the clock, the scoreboard), where larger text would break the layout.
- **Haptics and sound only double what the screen already shows.** Nothing is conveyed by either alone.

## Styling

- NativeWind classes are the primary styling solution, on the theme from `context/design-mobile.md`.
- Use the kit in `src/components/ui/` where applicable: native parts rebuilt from the web's kit and styled to the theme.
- **No hard-coded colours.** Every colour comes from the theme tokens, in classes and in style objects alike.
- No `style=` or `StyleSheet` otherwise. Three exceptions, each with a one-line comment saying which applies:
  - a value known only at run time (a share of a bar, an arc's progress);
  - a Reanimated animated style;
  - something NativeWind can't express.

## Motion

- **Reanimated** for all animation.
- Reduced motion is applied **per component through one hook**, `useMotionPolicy` in `src/hooks/use-motion-policy.ts`, as on web. No component reads the system setting itself.
- **The clock's sweep is linear and never stops under reduced motion.** It is information, not decoration: reduced motion removes flourishes, never the time left.

## Realtime

- `socket.io-client` in `src/lib/api/socket/`, connected once and held for the duel session.
- The handshake sends the gateway token (from `GET /auth/token`) and this repo's `PROTOCOL_VERSION` constant.
- Events are parsed on arrival with this repo's own schemas (`src/lib/api/schemas/`). An unrecognised event is logged and ignored, never guessed at.
- The countdown is rendered from the server's start timestamp. The client never decides that time ran out — it renders the backend saying so.
- **The socket can drop when the app goes to the background.** The server's 20-second reconnect window still applies, and the clock keeps running server-side. Reconnect on return to the foreground and render what the server sends, which may be a lost life or a forfeit.

## Testing

- Vitest in Node for `lib/` and the pure helpers hooks use. The `*.test.ts` files copied from the web stay and keep passing.
- Components and screens are not unit tested.
- Maestro for flows, including a duel against a browser player.
- **Claude's own visual checks use simulator screenshots**, saved to the scratchpad and read back as images:
  - iOS: `xcrun simctl io booted screenshot <file>.png`
  - Android: `adb exec-out screencap -p > <file>.png`

## Checks

Every phase passes all five before it's done:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx expo-doctor
```

## Current APIs

- Expo and React Native change quickly, and memory is often a version behind. **Check the current docs (Context7) before using an API.**
- Install native packages with `npx expo install`, never `npm install`, so their versions match the SDK. A new native package needs a fresh dev build.
