# Phase M17b — Rooms

## Status

Not Started

## Goals

- **The rest of `LobbyPanel`,** in `src/components/duel/lobby-panel/`:
  - **`RoomWaiting`:**
    - the code is the most prominent thing, six dashed boxes in a dashed card, as `duel/04-room-code-b`. It's easy to read aloud, and screen readers read it letter by letter;
    - **Copy code** and **Share** sit under it. Copy confirms in place ("Copied", with a check, for 2 seconds). Share opens the system share sheet;
    - then the room's filters, a quiet "Closes in 9:41" (`ClosesIn`, ticking on the server clock), and Cancel;
    - **no countdown clock:** nothing is lost while you wait;
  - **`RoomExpired`:** "No one joined", with Create a new room and Back to play;
  - **joining:** "Joining room K7QM2X…", an ambient wait with Cancel. `joining` now gets its own line, where M17a reused Searching;
  - **room filters:** the coin flip named for the room, "Playing your room" or "Playing {creator}'s room", with no coin-flip wording. The copied `lobby.ts` decides the line.
- **Copying the code** uses `expo-clipboard`, installed with `npx expo install expo-clipboard`. It's a native module, so the dev build needs a rebuild (your step). If copying fails, the row says so with the web's line, adapted for a phone with no text selection: "Copying isn't allowed here. Read the code out instead." The code stays on screen.
- **Sharing** uses React Native's `Share.share`. The message carries the code; see Open Questions for the link.
- **The hand-offs from `/play`, end to end:**
  - **Create room** (M13c) opens `/play/duel?room=create` with the filters; `use-duel` creates the room and shows `RoomWaiting`;
  - **Join** with a code (M13c) opens `/play/duel?room=K7QM2X`; the duel joins it, with the creator's filters applied whole (Hard Constraint 19).
- **Join refused:** wrong, full or your own code. The gate says which and offers Back to play, which returns to `/play` step 1 with Duel picked and the code kept in the box (`keepsJoinCode`, `JOIN_ROW_ID`). Never "something went wrong".
- **Hosting locked** (Free, switch on): a refused create says "Hosting a room needs Pro", with Back to play and See Pro. Joining always works.
- **New room after an expiry** (`newRoom`): the route's params follow the new room (`router.setParams`), so a reload keeps it.
- **`/dev/canvas/duel`:** these room states render: `room-waiting`, `room-expired`, `room-joining`, `room-filters`, `room-not-found`, `room-full`, `room-own` and `room-pro-required`.

## Open Questions

1. **What does Share send?** The options:
   - **(a)** the code only: "Join my Lineup duel with code K7QM2X." The link arrives with M22's room links;
   - **(b)** the code and a `lineup://play/duel?room=K7QM2X` link, which only works for people who have the app;
   - **(c)** the code and the web app's link (`<web URL>/play/duel?room=K7QM2X`), which works in any browser, from a new `EXPO_PUBLIC_WEB_URL` you'd add to `.env.local`.

   The default is **(a)**, so no link is promised before M22 decides links.

## Mirrors

From the M17 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/duel/lobby-panel/` (`RoomWaiting`, `CopyButton`, `ClosesIn`, `RoomExpired`).
- `src/components/play/CreateRoom.tsx` and `JoinRoom.tsx`, already rebuilt in M13c, for the hand-offs.
- `src/lib/room-code.ts` (`roomClosesLabel`, `roomIntentFrom`, `withRoom`) and `src/lib/lobby.ts`, already copied.
- `src/components/game/DuelGame.tsx` (`follow`, `keepsJoinCode`, `playHref`).
- `context/theme.md` § Lobby & matchmaking (room waiting, room filters, joining, join refused, hosting locked, room expired).
- `context/design-mobile.md` § 6, LOBBY · room waiting ("Share opens the system share sheet").

## Out of Scope

- **Opening a `lineup://` room link** (cold start and warm): M22.
- **The room game's play and result,** with New room and the locked New room: M18. M15b's `ResultActions` already holds those layouts.

## Notes

- Scope: private rooms from both sides, the host and the friend, up to the match starting.
- Depends on: M17a (`DuelGame`, `LobbyPanel`, the copied `use-duel`), M13c (Create room, Join by code) and M13a (`ProLockButton`, `ProLockCaption`, `PRO_PATH`).
- Constraints:
  - **The creator's filters apply whole,** and both players are told (Hard Constraint 19).
  - **The room expires on the server;** "Closes in" is presentation only (`roomClosesLabel`).
  - **Pro hosts, anyone joins.** With the switch off, there's no lock and no word "Pro".
  - Touch targets of at least 44pt for Copy, Share and Cancel.
- **The Pro switch is off locally,** so hosting-locked is checked on `/dev/canvas/duel?state=room-pro-required`.
- **Your part:**
  1. **After `expo-clipboard` is installed,** rebuild the dev build (`npx expo run:ios`, and I'll say when Android needs `npx expo run:android`), then restart Metro.
  2. **On the iOS Simulator,** with the backend and the web running:
     - Create room, then Copy code and Share;
     - join that code from a browser at `localhost:3000`, and the room's filters line names your room;
     - the other way round: create on the web and join on the phone with the code;
     - a wrong code, which shows the refusal and sends you back with the code kept.
- Verification (Claude, Android emulator):
  - **the host side:** create, copy, share, and the Node opponent joining by the code;
  - **the guest side:** the Node opponent creates a room and the phone joins it;
  - a wrong code and your own code, both refused;
  - the room dev states at 390 × 844 and 375 × 667;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

## History
