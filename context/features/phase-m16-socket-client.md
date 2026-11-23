# Phase M16 — Socket Client

## Status

Completed

## Goals

- **Copy list E** (you paste it): `lineup-web/src/lib/api/socket/`, all 4 files, into `src/lib/api/socket/`:
  - `duel-client.ts`, `duel-client.test.ts`, `messages.ts`, `messages.test.ts`;
  - word for word. Each gets a row in `context/web-carryover.md` under a new "Copy list E" section;
  - `src/lib/api/duel-client.ts` (the `DuelClient` interface), `duel-emitter.ts` and `protocol.ts` are already here from earlier lists, and match the web.
- **`socket.io-client`** is installed with `npx expo install socket.io-client`, at the web's major (`^4.8`). It's plain JavaScript, so no new dev build.
- **`src/lib/api/register.ts`** registers the real duel client beside the API client, as the web's real mode:
  - `setDuelClient(createSocketDuelClient(apiUrl(), () => api.auth.getGatewayToken()))`;
  - the "joins in M16" comment goes;
  - there is still no mock: `createMockDuelClient` is never copied.
- **The handshake works from a phone:**
  - each attempt asks `GET /auth/token` for a fresh gateway token, with the bearer session from M06;
  - it sends `{ token, protocolVersion }` and nothing else;
  - the gateway accepts a connection with no `Origin` header, which is what React Native sends (`../lineup-backend/src/duel/socket-origin.ts`).
- **Refusals reach the caller as `ApiError`s,** from the copied client:
  - **protocol gate:** `protocol_refused` ("This version of Lineup is out of date…");
  - **auth:** `unauthorized` (retried once with a fresh token);
  - **takeover:** the server's `error` event ("You're connected somewhere else."), then `onClose`, never a reconnect by itself.

  The screens for these are later phases: the duel gates in M17 and M18, the update-required screen in M21.
- **Reconnects:** a dropped transport reports `dropped`, socket.io retries (5 attempts), and a return reports `restored`. Running out of attempts closes with the network error.
- **App background and foreground** (`coding-standards-mobile.md` § Realtime). The socket can die while the app is in the background, and the server's 20-second window keeps running:
  - **first, measure** what the copied client does on return, on both platforms, after about 10 seconds in the background with a duel running. There are three possible outcomes: still connected, a `dropped` then `restored`, or a stale socket that only notices at the next ping;
  - **if it doesn't come back promptly on its own,** add the smallest mobile-only piece that makes it do so: an `AppState` listener that makes the socket reconnect at once on `active`. If that needs a method on the client (a `resume()` that closes the engine so socket.io reconnects now), the copied file is adapted, and both the ledger and the spec record it;
  - after that, the board shows whatever the server says on return, which may be a lost life or a forfeit. That rendering is M18's.
- **`/dev/socket`,** a dev screen for trying the connection before the lobby (M17) exists:
  - **controls:** Connect, Disconnect, Find an opponent (`enterQueue`), Leave queue and Forfeit;
  - **status line:** idle, connecting, connected, dropped, restored, or closed with the error's code and message;
  - **event log:** the last 20 events, each with its name and a one-line summary (for example "roundStarted: your turn, 3–3 lives" or "playerRevealed: Andrea Pirlo");
  - **never shown:** the token, or a raw payload. The squad never arrives anyway;
  - it's added beside `/dev/session`, wherever the dev pages are listed.

## Mirrors

From the M16 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- Copy list E: `src/lib/api/socket/` (`duel-client.ts`, `messages.ts` and their tests).
- `src/lib/api/duel-client.ts` and `src/lib/api/duel-emitter.ts`, already here.
- `src/lib/api/register.ts`, the real-mode branch.
- `context/docs/w30-manual-testing.md`, the web's socket test: the frames, the takeover, the reconnects. This phase's checks follow its parts, with the dev screen in place of the duel gate.
- Backend, read-only: `src/duel/socket-origin.ts`, `src/duel/socket-auth.service.ts` (the token and the protocol check) and `src/duel/duel.gateway.ts` (the takeover).

## Out of Scope

- **`use-duel` and the lobby** (copy list F): M17.
- **The duel board, the drop and resume overlays, and forfeit on Back:** M18.
- **The update-required screen** with its store link: M21. Here, `protocol_refused` only shows on `/dev/socket`.
- **Redis, scaling, and anything on the backend:** the backend is done for gameplay.

## Notes

- Scope: the transport, registered and proven from a phone, with nothing on the real screens yet.
- Depends on: M06 (the bearer session, `getGatewayToken`, `NETWORK_ERROR`, `reportDrift`), and copy lists A and B (the duel schemas, `DuelClient`, the emitter, `PROTOCOL_VERSION`).
- Constraints:
  - **No game logic** (Hard Constraints 1 and 7). The client sends commands and renders events, and the server's events are the truth. The dev screen summarises; it never infers.
  - **The squad is never requested, stored or logged.** The event log shows names only as `playerRevealed` sends them.
  - **Never log the token** (`coding-standards-mobile.md` § The API Client).
  - **Every handshake is version-checked** (Hard Constraint 8). `PROTOCOL_VERSION` is 1 here, as on the web and the backend.
  - **Events are parsed with this repo's schemas;** an unknown or malformed one is reported (`reportDrift`) and dropped, never guessed at.
  - **One duel connection per user:** a second device or tab takes over. It never reconnects by itself after a takeover.
- **Your part:**
  1. **Copy list E.** Paste the 4 files from `lineup-web/src/lib/api/socket/` into `src/lib/api/socket/`, then tell me.
  2. **Backend:** running on `http://localhost:8080`, with `RATE_LIMITS_ENABLED=false` in its `.env` (as W30 Part 0), so `GET /auth/token` can't block a reconnect test. The web dev server is on `http://localhost:3000` in real mode, for the browser opponent.
  3. **On the iOS Simulator** (`lineup://dev/socket`):
     - Connect, then Find an opponent while a browser at `localhost:3000` does the same. Both should pair, and `paired`, the coin flip and `matchReady` appear in the log;
     - **takeover:** sign in with the same account on the web and open a duel there. The phone's status turns closed, "You're connected somewhere else.";
     - **background:** with a duel running, send the app to the background for about 10 seconds and come back;
     - **reconnect:** stop the backend while connected, then start it again.
- Verification (Claude, Android emulator):
  - **the handshake and pairing:** a guest on the phone against a second client, a Node script run from the scratchpad with `socket.io-client` (the backend has it). The script makes a guest, fetches its token and enters the queue;
  - **the takeover:** a test account made with `curl`, signed in on the phone through Sign in. The script then signs in to it too and connects, and the phone shows the takeover;
  - the background return, and a drop and restore, by switching the emulator's network off and on. Stopping the backend is your step;
  - **`protocol_refused`:** a temporary local `PROTOCOL_VERSION = 0`, never committed, shows the refusal on `/dev/socket`;
  - **the copied tests pass,** plus a test for any mobile-only piece the background goal adds;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

**Deviations recorded during implementation**

- **`/dev/socket` gained "Submit filters (Any)":** a pairing reaches the coin flip and `matchReady` only once both players submit filters, so the five controls weren't enough. It sends every competition and club over the catalogue's whole era.
- **The emulator can't cut an open socket:** the app reaches the backend through `adb reverse`, and neither airplane mode nor removing the tunnel closes a stream that is already open. The drop-and-restore check moves to your backend stop and start.
- **`src/lib/dev/socket-log.ts`** (with `src/types/socket-log.ts` and a test) holds the log's summaries, the 20-entry cap and the status label, so the dev screen stays thin.

**Background measurement**

- **Android emulator:** 10 seconds in the background mid-duel left the socket connected. Events kept arriving, and the opponent never saw a reconnect. No `AppState` piece is needed for Android.
- **iOS Simulator (user, 2026-11-23):** 10 seconds in the background mid-duel also left the socket connected, with new events on return.
- **So the `AppState` piece wasn't built,** and the copied client stays word for word. A real iPhone may suspend sooner than the Simulator; that check rides with M18's drop and resume overlays, and M26's device runs.

**Test data on the local backend**

- The account `m16-test` (`m16-test@lineup.test`) and a few `guest-…` users made by the opponent script.

- **Verified on Android (Claude, 2026-11-23):**
  - **the handshake:** Connect turned connected for the signed-in user;
  - **pairing:** against the Node opponent, through the filter submits, the coin flip and `matchReady` (Galatasaray 1–2 Beşiktaş), then rounds, lives lost and `finished`;
  - **the takeover:** the script connected as `m16-test`, and the phone logged the server's `error` ("You're connected somewhere else."), then closed. The script held the connection for its full 25 seconds, so the phone never reconnected by itself;
  - **`protocol_refused`:** with a temporary `PROTOCOL_VERSION = 0` (reverted, no diff), the refusal showed; back at 1, Connect worked again;
  - the copied tests (46) and the log helper's tests (10) pass.
- **Verified on iOS by the user (2026-11-23):** pairing against a browser, the takeover from the web as `m16-test`, the background return (still connected), and a backend stop and start.

## History
