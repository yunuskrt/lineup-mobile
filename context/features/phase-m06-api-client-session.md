# Phase M06 — API Client & Session

## Status

Not Started

## Goals

- **Copy list B** (24 files, pasted by you from `lineup-web`; the list is in `../lineup-web/context/docs/mobile-repo-setup.md` § Copy lists):
  - B1 `src/lib/api/http/`: `api-client.ts`, `transport.ts`, `transport.test.ts`;
  - B2 `src/lib/api/`: `config.ts`, `config.test.ts`, `pro-switch.ts`, `pro-switch.test.ts`;
  - B3 `src/hooks/`: the 15 data and time hooks the list names;
  - B4 `src/components/providers/`: `query-client.ts`, `query-client.test.ts`.

  Each file is listed in `context/web-carryover.md`, with every mobile edit below.
- **Packages,** installed with `npx expo install`: `@tanstack/react-query`, `expo-secure-store` and `@react-native-community/netinfo`. The last two are native, so the dev build is rebuilt.
- **Mobile edits to the copies:**
  - `config.ts`:
    - reads `EXPO_PUBLIC_API_URL` in place of `NEXT_PUBLIC_API_URL`, with production meaning `!__DEV__`;
    - drops `API_MODE`, `MOCK_TIER` and `MOCK_PRO_ENABLED`;
    - its test follows.
  - `transport.ts`:
    - drops `credentials: 'include'`;
    - sends `Authorization: Bearer <token>` when a token is stored;
    - stores the token from any response's `set-auth-token` header;
    - keeps everything else: the timeout, the result parsing and drift reports. Paths only, never a body, a header or the token.
  - `use-auth.ts`: `clearSession` also deletes the stored token. It's the one place both sign-out and a 401 go through, so both end the session on the device.
  - every copy loses `'use client'`.
- **Token store** (`src/lib/api/http/token-store.ts`):
  - the session token in `expo-secure-store`, with an in-memory copy for the transport;
  - `loadToken`, `getToken`, `setToken` and `clearToken`;
  - never logged, never in a Query cache, never in a URL;
  - the SecureStore calls are wrapped, so a keychain failure reads as "no token" instead of a crash.
- **`src/lib/api/index.ts`, real only:** registers `createHttpApiClient(apiUrl())`. The duel client is registered in M16, with the socket.
- **`src/components/providers/QueryProvider.tsx`** (rebuilt), in the root layout:
  - one client from the copied `createQueryClient`;
  - Query's `focusManager` follows `AppState`, so data refetches when the app returns to the foreground;
  - its `onlineManager` follows NetInfo, so queries pause offline and resume online.
- **Boot gate:** the splash stays up until `loadToken` resolves, through `expo-splash-screen`'s `preventAutoHideAsync` and `hideAsync`. The first request then carries the token, and a signed-in player never flashes as signed out.
- **`/dev/session`:**
  - shows the session: signed out, a guest, or a user with their handle and tier;
  - says whether a token is stored, never the token itself;
  - shows the Pro switch read from `GET /config`;
  - buttons: Continue as guest, Sign out, Refetch, and "Use a revoked token". The last stores a dead token, then asks for the profile, so the 401 path can be watched clearing the session and the token.

## Mirrors

- Copy list B (above).
- `src/lib/api/register.ts` and `src/lib/api/index.ts`: the real branch only; the mock branch has no mobile counterpart.
- `src/components/providers/QueryProvider.tsx`
- `../lineup-backend/context/docs/auth-setup.md` § Bearer (mobile): `set-auth-token`, `Authorization: Bearer`, the same session as the cookie, and the bearer winning over a cookie.
- `../lineup-backend/src/contract/`: the contract the copied schemas follow. When it and the web disagree, the backend wins.

## Open Questions

Decided (user, 2026-11-21): **1 → `http://localhost:8080` on both, with `adb reverse tcp:8080 tcp:8080` on Android.**

1. **How the Android emulator reaches the backend.**
   - **Recommended: `EXPO_PUBLIC_API_URL=http://localhost:8080` for both platforms, plus `adb reverse tcp:8080 tcp:8080` on Android.** One value works on both simulators, and it's the same forward Metro already uses.
   - `http://10.0.2.2:8080` on Android works without the forward, but iOS needs `localhost`, so the value would change per platform.

## Out of Scope

- The welcome, sign-in and sign-up screens, and the guest upgrade UI (M07).
- The socket and the duel client (M16); the offline notice and the other system states (M21).
- Any screen that uses the data hooks (from M07 on).

## Notes

- Scope: the app talks to the real backend, holds its session safely, and loses it cleanly. No user-facing screen changes beyond `/dev/session`.
- Depends on: M05 (root layout), M02 (the copied schemas, `client.ts`, `session-loss.ts`, `unwrap.ts`, `retry.ts`).
- Constraints:
  - Bearer tokens, no cookies. The token lives in `expo-secure-store` and nowhere else, and is never logged (`coding-standards-mobile.md` § The API Client).
  - No component calls `fetch`. Everything goes through `src/lib/api/`, and there is no mock adapter.
  - The client never asserts its own tier. Pro comes from the backend (Hard Constraints 15 and 16).
  - `EXPO_PUBLIC_` values are public; the API URL is the only one, and it isn't a secret.
  - Check the current docs (Context7) for `expo-secure-store`, NetInfo and Query's `focusManager` and `onlineManager` before wiring them.
  - On Hermes, check `AbortSignal.timeout` and `response.headers.get`. If the timeout is missing, the transport falls back to an `AbortController` with a timer, recorded as a deviation.
- **Your part:**
  1. Paste copy list B into the paths above. Claude checks the files and stops until they're in.
  2. Add `EXPO_PUBLIC_API_URL` to `.env.local`, as Open Questions 1 decides.
  3. Start the backend (`npm run start:dev` in `lineup-backend`), and run `adb reverse tcp:8080 tcp:8080` if Open Questions 1 picks it.
  4. Rebuild the dev build after the native packages: `npx expo prebuild`, then `npx expo run:ios` and `npx expo run:android`.
  5. On the iOS Simulator, run `/dev/session`: Continue as guest, quit and reopen the app (the guest stays), Sign out, and Use a revoked token.
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - The copied tests keep passing, adjusted only where a mobile edit changed the behaviour (the env name and the mock flags).
  - New tests:
    - the transport sends the bearer header when a token is stored, and none when not;
    - it stores the token from `set-auth-token`;
    - it never sends `credentials`;
    - `clearSession` clears the token.

    The token store is tested behind a fake SecureStore.
  - On both simulators, against the local backend:
    - Continue as guest makes a guest, and the session survives a full app restart;
    - Sign out returns to signed out and deletes the token;
    - a revoked token's 401 clears the session and the token;
    - with the network off (Android: `adb shell svc wifi disable` and `svc data disable`), queries pause and then resume when it's back;
    - backgrounding and returning refetches the session.
  - The backend sees the requests with `Authorization: Bearer` and no cookie.

- **Deviations recorded during implementation:**
  - **Registration lives in `src/lib/api/register.ts`, called once by the root layout,** not as a side effect of importing `src/lib/api/index.ts`. Importing a hook in a Node test would otherwise resolve the API URL and load `expo-secure-store`. `index.ts` only re-exports `getApiClient`.
  - **The token store is split in two:**
    - `token-store.ts` is pure: it keeps the in-memory token, with the keychain plugged in through `configureTokenPersistence`;
    - `secure-token-persistence.ts` is that keychain, `expo-secure-store` under the key `lineup.session-token`.

    The store's tests run in Node with a fake.
  - **`config.ts`'s `isOrigin` uses try/catch around `new URL`,** because React Native's `URL` has no `canParse`. That `URL` is a regex polyfill, so on a device it would accept an origin followed by a query string. This only affects validating `EXPO_PUBLIC_API_URL`; the tests run on Node's real `URL`.
  - **`AbortSignal.timeout` exists in React Native 0.88,** so the transport needs no timeout fallback.
  - **React Native's `fetch` (whatwg-fetch) adds `_=<time>` to every GET sent with `cache: 'no-store'` or `'no-cache'`.** Every GET is therefore fetched fresh, and the web's ETag revalidation doesn't happen on mobile. The backend ignores unknown query parameters, so the copied `cache` option stays as it is.
  - **`pro-switch.ts` loses `isProSwitchOff`,** a Next.js server-side fetch. Mobile reads the switch through `use-pro`, and `isSwitchOffIn` stays with its test.
  - **`use-auth.test.ts`:** the `ensureSession` tests fake their calls on top of a real HTTP client, since mobile has no mock to reuse, and a `clearSession` token test is added. Every copy and edit is in `context/web-carryover.md`.
  - **The transport sends `credentials: 'omit'` instead of leaving `credentials` out.** Without it, React Native keeps a native cookie jar and sends the backend's session cookie. On Android, a dead bearer token then fell back to that cookie, and the 401 test passed a request it should have refused. With `'omit'`, Android sends with `CookieJar.NO_COOKIES` and iOS turns off `HTTPShouldHandleCookies`.
  - **`/dev/session` opts out of React Compiler with `'use no memo'`.** `hasToken()` isn't React state, so the compiler cached its first value.
- **Verified on Android, against the local backend, with no cookie:**
  - `GET /config` reads the Pro switch (off);
  - Continue as guest makes a guest and stores the token;
  - the guest survives a cold restart;
  - Sign out clears the session and the token;
  - a revoked token gets a 401 that clears both;
  - offline, a Sign out waits and goes through when the network returns.
- **Verified by the user on iOS (2026-11-22):** Continue as guest stores a token, the guest survives a full app close, Sign out clears both, and a revoked token reads "Refused: unauthorized" and clears both.
- **Follow-up:** foreground refetch (the `focusManager` wiring) wasn't seen on a device; `/dev/session` shows no visible change when it fires. Check it once a real screen uses the data (Profile, M19).

## History
