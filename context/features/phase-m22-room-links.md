# Phase M22 — Room Links

## Status

Completed

## Goals

- **Incoming room links**, `src/app/+native-intent.tsx` (Expo Router's hook for links the system hands the app), over a pure `src/lib/room-link.ts`:
  - `lineup://play/duel?room=<code>` opens **step 1 of `/play` with Duel picked and the code in the join box** (`/play?mode=duel&room=<code>`), the join row the M13c code box already fills from `joinCodeFrom`; one tap on Join goes, and the server decides the rest (a wrong, full or own code is refused as M17b shows);
  - the code is cleaned with the copied `roomCodeInput` (uppercase, letters and digits, six at most); a link with no code, or `room=create`, opens step 1 with Duel picked and an empty box; any other incoming path passes through untouched;
  - the same rewrite is written against the path only, so M28's `https://…/play/duel?room=` universal links reuse it unchanged.
- **Cold start and warm:**
  - **cold:** the link launches the app straight to that step, past Welcome (a guest is made when Join is pressed, as today: no signup wall); with a session or without one;
  - **warm, outside a game:** from any tab or pushed screen, the link moves to that step and the box takes the new code (M13c's `initialCode` already follows the params);
  - **warm, in a game** (solo or duel, any phase): the link **never moves the player off the board**. The code is held in `src/lib/pending-room.ts` and fills the join box the next time Play shows; a live duel can't be forfeited by a tapped link.
- **Share sends the link** (`src/lib/room-share.ts`): "Join my Lineup duel with code K7QM2X: <link>", the link being the web app's `roomLink(EXPO_PUBLIC_WEB_URL, code)`, which opens the duel in any browser today and the app once M28's universal links land. With `EXPO_PUBLIC_WEB_URL` unset, Share keeps M17b's code-only line. The gate's "Send them the code or the link" (copied `lobby.ts`) is then true.
- **Tests:** `room-link.test.ts` (the rewrite: code, lower case, extra characters, missing code, `create`, other paths, the universal-link form), `pending-room.test.ts` (hold, take once), and the share message with and without the web URL.

## Contract

No backend change. A link carries only the code; joining is the existing `room:join` socket command, and the backend refuses a wrong, full, expired or own code as before. Nothing in a link is trusted beyond the code's shape.

## Mirrors

From the M22 row of the Web References table in `context/todo.md`, read-only in `../lineup-web/`:

- `src/lib/room-code.ts`: `ROOM_PARAM`, `roomLink`, `roomIntentFrom`, `joinCodeFrom`, `roomCodeInput`. Already here word for word (copy list F), so the link's shape is the web's.
- The web's own link (`/play/duel?room=<code>`) joins at once; mobile opens the join row first (Open Question 1).
- No copy list.

## Open Questions

1. **What a tapped link does.** Default: step 1 of `/play`, Duel picked, the code in the box, one tap on Join (the todo line's "join with the code filled"). Alternative: join at once, as the web's link does ("Joining room K7QM2X…").
2. **What Share sends.** Default: the code and the web link from a new `EXPO_PUBLIC_WEB_URL` (your `.env.local` edit), code only while it's unset. Alternatives: the code and a `lineup://` link (works only with the app installed, and many chat apps don't make it tappable), or the code only, as now.
3. **A link during a game.** Default: held, filling the join box the next time Play shows. Alternative: a confirm over the board ("Leave this game to join room K7QM2X?"), which in a duel means forfeiting.

## Out of Scope

- **Universal links** on the shared domain (`apple-app-site-association`, `assetlinks.json`): M28. This phase handles the custom scheme and keeps the rewrite path-based for them.
- **Room links for creating a room** from outside the app; `room=create` stays an in-app intent.
- **A Copy link button** on the room card: Share already carries the link.

## Notes

- Scope: opening `lineup://` room links in every app state, and putting the link in Share.
- Depends on: M13c (the join row and its `initialCode`), M17b (rooms, Share, refusals), M01 (the `lineup` scheme).
- Constraints:
  - **The server decides** (Hard Constraint 1): a link fills a box; the code is checked only by the backend's `room:join`.
  - **Guest play needs no signup** (Hard Constraint 12): a cold link works with no account.
  - **Never fail silently** and **never a dead end** (`coding-standards.md`, `theme.md`): a held code shows up later; a refused code returns to the box with the code kept.
  - **Game screens keep their back rules** (`coding-standards-mobile.md` § Native): a link must not become a way off the board.
  - Check `+native-intent` against the current Expo Router docs (Context7) before writing it.
- **Your part:**
  - optional: add `EXPO_PUBLIC_WEB_URL=http://<your Mac's address>:3000` to `.env.local` and restart Metro, so Share carries a link a second device can open;
  - on the iOS Simulator: `xcrun simctl openurl booted "lineup://play/duel?room=K7QM2X"` with the app closed, on a tab, and during a solo run; then a real room made in the browser, joined from its link.
- Verification (Claude, Android emulator):
  - `adb shell am start -a android.intent.action.VIEW -d "lineup://play/duel?room=K7QM2X"` cold (after a force-stop), warm on Archive and Profile, and during a solo run and a duel lobby: step 1 with the code filled, or the code held and shown on the next visit to Play;
  - a room made in the browser at `localhost:3000`, joined from its link on the emulator: the match starts on both;
  - a wrong code from a link: refused, back to the box with the code kept;
  - Share with and without `EXPO_PUBLIC_WEB_URL`;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Deviations recorded during implementation:**
  - **Held, not navigated:** `redirectSystemPath` returning `null` makes Expo Router ignore the link (`expo-router/build/link/linking.js`), so a link during a game returns `null` and holds the code. The decision is the pure `redirectRoomLink` in `room-link.ts`; `+native-intent.tsx` only applies it.
  - **"In a game" is mount-based**, through `useGameOpen` (`src/hooks/use-game-open.ts`) in `SoloGame` and `DuelGame`, counted in `pending-room.ts`: a screen pushed over a board (`/pro` from a lock) still counts, so a link can't dismiss the board beneath it.
  - **Play takes the held code when it comes into focus** (`useIsFocused` and an effect event; `useFocusEffect` with `useCallback` broke the effect-event lint rule). It overrides the step that Back to play asked for: the link is the newer intent.
  - Links are split by hand, not with `URL`: a custom scheme's host is the first route segment (`lineup://play/duel` has host `play`).
  - **The web URL** is read once in `src/lib/web-url.ts` (`EXPO_PUBLIC_` variables inline only when read whole) and checked by `webUrlOf` in `room-share.ts` (http or https, no trailing slash).
  - **Cold links in a dev build** pass through the dev launcher first; after picking the server, the link opens as rewritten. A release build has no launcher.
  - **The real-room check used a scripted host**, a guest creating a room over the socket from Node (as M17b's scripted opponent), not a browser tab.
- **Follow-ups (review):**
  - A warm link replaces Play's params with `mode=duel&room=`, so filters picked before it reset to Any. Harmless for a join (the creator's filters apply), but a player who goes on to Find an opponent instead starts from Any.
  - A cold link skips Welcome on a first launch; Welcome shows on a later launch only if no guest was made. As intended (no signup wall), noted so M24 can judge it.
- **Verified on Android (2026-11-24):** cold (after a force-stop, through the dev launcher): `lineup://play/duel?room=k7qm2x` opened step 1 with Duel picked and K7QM2X in the box. Warm: from Archive (AB3CDE) and Profile (XY4ZWQ), the box took each new code. During a solo run (side pick) and a live duel, the link left the board alone; after quitting, and after the duel's Back to play, Play opened step 1 with the held code. A scripted host's room (DP7T6Q) joined from its link: paired, coin flip and match ready on the host, and the duel started on the phone. A wrong code from a link was refused ("Couldn't join the room"), and Back to play kept it in the box. Share without `EXPO_PUBLIC_WEB_URL` sent "Join my Lineup duel with code ZTSS2A." With it set (user, `http://192.168.0.106:3000`, after a clean prebuild), Share sent "Join my Lineup duel with code DUY49C: http://192.168.0.106:3000/play/duel?room=DUY49C". That link opened the web duel route in the emulator's Chrome, which stayed on its loading board: the local backend's CORS doesn't allow the web on the network address, a local set-up matter outside this repo.
- **Verified on iOS by the user (2026-11-24):** a cold link (through the dev launcher, picking the server), a warm link from a tab, and a link during a solo run, held and shown in the join box after quitting.

## History
