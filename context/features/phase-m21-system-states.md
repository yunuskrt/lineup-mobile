# Phase M21 — System States

## Status

Completed

## Goals

- **The update-required screen**, `src/components/game/UpdateRequired.tsx`, replaces M17a's `duel-game/ProtocolHold.tsx` (and its "Built in M21" notice) on `state.phase === 'refused'` in `DuelGame`:
  - full screen inside the safe areas, as the web's `ProtocolRefused`: a page, not a gate, since there is no duel to show;
  - the `RefreshCw` icon, the title "Update Lineup to keep playing", and the web's first sentence, "This version is out of date, so the duel server turned it away.", then a store line in place of the web's "Reload…": "Get the latest version from the App Store." on iOS, "…from Google Play." on Android;
  - a primary large **Update** that opens this app's store page, and a secondary large **Back to play** (step 3 of `/play`, the choices kept, as today);
  - the title takes the screen reader's focus when the screen appears, as the web's heading focus.
- **The store link**, `src/lib/store-link.ts`: the store page URL for the running platform, read from the app config (`ios.appStoreUrl`, `android.playStoreUrl` in `app.json`, through `expo-constants`), opened with `Linking`:
  - `android.playStoreUrl` is set now from the package id (`https://play.google.com/store/apps/details?id=gg.lineup.app`);
  - `ios.appStoreUrl` needs the App Store id, which exists only after the store set-up (M27, M28). Until then, iOS shows no Update button, and the store line and Back to play remain: never a dead end;
  - a link that fails to open says so in place ("Couldn’t open the store.") and keeps Back to play.
- **The offline notice**, `src/components/shell/OfflineNotice.tsx`, with `src/hooks/use-is-offline.ts`:
  - the hook reads TanStack Query's `onlineManager`, which M06 already feeds from NetInfo, so the notice and the paused queries agree on one signal;
  - a slim `warning` bar (tag-amber fill, 2pt ink rules, a `WifiOff` icon) reading "You’re offline. Lineup needs a connection to play.", announced once when it appears;
  - it sits under the header of every `Screen` (tabs and pushed screens) and on Welcome, and pushes the column down rather than covering it; it goes when the connection returns;
  - **not on the game board**: there, the existing states already speak (a failed guess's toast, the duel's reconnecting gate, the connection-lost result).
- **Dev states:**
  - `/play/duel?state=refused` shows the update screen, in development only, at 390 × 844 and 375 × 667;
  - the offline notice has a dev toggle on `/dev/kit`'s surfaces section (forced on, without going offline).
- **Rate limit, checked end to end:** the cooldown is already built (M10a input, M14a and M17a wiring through the copied `system-states.ts`). This phase proves it against the real backend: fire more than 12 guesses in 3 seconds in a solo run and see the input lock with "Too many guesses. Try again in Ns", then come back live. A gap found here is fixed in this phase.
- **Tests** for `store-link.ts` (per platform, set and unset URLs). `system-states.test.ts` is a web copy and stays as it is.

## States

The rows of `context/theme.md` § System, and where each one lives on mobile:

| State               | Where                                                                  | In this phase       |
| ------------------- | ---------------------------------------------------------------------- | ------------------- |
| Protocol refused    | `UpdateRequired` on `/play/duel`                                       | Built               |
| Empty filter result | The solo gate's widen actions (M14b); a duel leaves to `/play` (M17a)  | Already built       |
| You reconnecting    | The duel's reconnecting gate with its forfeit countdown (M18b)        | Already built       |
| Connection lost     | The duel result marked as a forfeit, "Disconnected" (M18a)             | Already built       |
| Rate limited        | The input's cooldown line (M10a)                                       | Checked end to end  |
| Offline             | Not in `theme.md`: mobile-only, from the todo line                     | Built               |

## Mirrors

From the M21 row of the Web References table in `context/todo.md`, read-only in `../lineup-web/`:

- `src/components/game/ProtocolRefused.tsx`: the copy, the icon, the two actions and the heading focus.
- `src/lib/system-states.ts`: already copied (word for word); the cooldown, empty-pool and reconnecting helpers this phase relies on.
- `context/theme.md` § System.
- No copy list. The web has **no offline notice**, so its copy and look are new here.

## Open Questions

1. **iOS before the store listing.** With no App Store id until M28, iOS shows no Update button (default). The alternative is an App Store search link for "Lineup", which may land on another app.
2. **Where the offline notice shows.** Default: under every `Screen` header and on Welcome, not on the game board. The alternative is everywhere, the board included, as a bar over the scoreboard.
3. **The "Catching up…" state** after a long background on Android (M18b's follow-up: the board is stale for about 3 seconds while buffered events replay). Default: left to M24, as a design call. Alternative: build it here, as a system state.

## Out of Scope

- **A REST version check:** only the duel handshake carries `protocolVersion` (Hard Constraint 8); the backend refuses nothing over HTTP for age.
- **The store listings themselves**, and universal links: M27 and M28.
- **New empty-pool, reconnecting or connection-lost screens:** they exist (see States).

## Notes

- Scope: the update screen with its store link, the offline notice, and the rate-limit check against the real backend.
- Depends on: M17a (`ProtocolHold`, the refused phase), M06 (`onlineManager` on NetInfo), M10a (the cooldown input).
- Constraints:
  - **Every socket handshake is version-checked** (Hard Constraint 8): an old build is refused with an upgrade prompt, never left to desync. The client never decides it's too old; it renders the server's `protocol_refused`.
  - **Never a dead end** (`theme.md`): every state here keeps a way back.
  - **Never fail silently on a game action** (`coding-standards.md`): a rate-limited guess shows its lock and its reason.
  - **Offline is presentation:** the notice decides nothing; queries pause through Query's own `onlineManager`, as today.
  - **No new colours:** the bar uses the `warning` and tag roles (`design-mobile.md` § 3).
- **Your part:** on the iOS Simulator:
  - the update screen through `/play/duel?state=refused` (no Update button until the App Store id exists);
  - optional: the offline notice, by turning off the Mac's network for a moment.
- Verification (Claude, Android emulator):
  - **refused:** a temporary local `PROTOCOL_VERSION = 0`, never committed (as in M16), then Duel: the update screen shows; Update opens Google Play (or the browser on an image without the Play Store); Back to play returns to step 3; back at 1, the duel connects again;
  - **offline:** airplane mode on (`adb shell cmd connectivity airplane-mode enable`): the notice shows on Play, Archive, Profile and a pushed screen, not on the board; off again: it goes and the queries resume;
  - **rate limit:** a burst of more than 12 guesses in 3 seconds in a real solo run: the cooldown line counts down and the input returns;
  - the dev states at both sizes;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.
- **Deviations recorded during implementation:**
  - **The offline notice also shows on the board while it loads** (user, 2026-11-24): offline, a solo start pauses with Query and the board sat on its skeleton without a word. `GameCanvas` shows the bar under the scoreboard only while `view.match` is null; a live round keeps its own states. This changes Open Question 2's default.
  - `UpdateRequired` is its own layout (icon tile, a focusable heading, the line, the actions), not the kit's `Empty`: the heading needs a ref for the screen reader's focus. The title uses the long-title type (Archivo Bold 20), as it runs past 20 characters.
  - The store line follows the web's first sentence in the same paragraph, as the web's single description.
  - `ProtocolHold.tsx` is deleted with the hold, and with it `laterPartLine`, its test and the `LaterPart` type: nothing else used them.
  - `/play/duel?state=refused` is handled in the route file and renders `UpdateRequired` with no socket opened; Back there goes back, or to Play when nothing is behind it (`leavePreview`): on iOS a plain `router.back()` from a cold link threw "GO_BACK was not handled" and stayed put (found by the user).
  - Welcome takes the notice above its scroll: offline, the notice holds the top inset and the column starts under it.
  - The `/dev/kit` entry is a forced notice in its own `offline` section (`/dev/kit?section=offline`), not a switch.
  - **One announcement per drop** (review): each mounted `Screen` carries a notice and the tabs stay mounted, so each announced the line. `announceOfflineOnce` in `use-is-offline.ts` reads it once until the connection returns; a forced dev notice doesn't announce. Tested in `use-is-offline.test.ts`, with `react-native` mocked.
  - **Rate limit:** the emulator couldn't send guesses fast enough to trip 12 in 3 seconds (a pending guess drops the next Enter). An HTTP burst of 15 guesses on a practice run as `m16-test` got 15 × 200, so the local backend's limiter didn't trip; its `.env` sets `RATE_LIMITS_ENABLED`, value unread. With the user's restart on `RATE_LIMITS_ENABLED=true`, the same burst got 12 × 200 and 3 × 429 `rate_limited` with `retryAfterMs: 3000`. The limit is per user, so a burst for `m16-test` from curl followed by one guess in the app drove the app's own lock (see Verified).
- **Follow-ups (review):**
  - Welcome's demo-in-view check keeps the frame's old top for a moment when the notice appears or goes (the frame's own layout doesn't change, so it isn't remeasured): off by the top inset until the next layout. Harmless for a pause decision; M24 if it shows.
  - In the adb tests the keyboard dropped after a guess sent by `keyevent 66`; M10a's real typing kept it up. Likely the injected key, not the app; worth a look on a device in M24.
- **Verified on Android (2026-11-24):** refused: with a temporary `PROTOCOL_VERSION = 0` (reverted, no diff), Find an opponent showed the update screen, Update opened the Play Store app, Back to play returned to step 3 with Duel kept, and back at 1 the duel queued. Offline (airplane mode): the bar showed on Play, Archive, Profile, a pushed screen and the loading board, not in a live round; online again, it went and the paused solo start went on to the side pick. Rate limit: after the curl burst, a guess from the app showed "Too many guesses. Try again in 3s" and the input came back live after about 4 seconds. The dev states at 390 and 375.
- **Verified on iOS by the user (2026-11-24):** `/play/duel?state=refused` shows the App Store line and Back to play with no Update button; Back to play from a cold link threw and stayed until the `leavePreview` fix.

## History
