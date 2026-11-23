# Phase M13c — Start & Rooms

## Status

Not Started

## Goals

- **`src/components/play/StartStep.tsx`:** step 3, replacing M13a's stub. It holds the "Ready to play" heading, the summary, Start, the allowance line, the archive line and, for a duel, Create room.
- **`src/components/play/PlaySummary.tsx`** and **`play-summary/Rows.tsx`:**
  - a ruled block with **Mode**, then **Competition**, **Club** and **Era** (the copied `filterSummary`);
  - each block has a secondary **Edit mode** or **Edit filters** button, which go to step 1 or 2;
  - values still loading show a skeleton at the value's size.
- **`src/hooks/use-start-navigation.ts`:** the web hook rebuilt for Expo Router:
  - `ensureSession` first, so a player with no session gets a guest. Then `router.push` to the game route;
  - `go` reports false if the session couldn't be made, with its error.
- **`src/components/play/PlayStart.tsx`:**
  - Start reads **Start solo run**, **Find an opponent** or **Start practice**, and "Starting…" while busy;
  - it's disabled at the solo cap (the server still refuses);
  - under it go the allowance line (M13a's `SoloAllowanceNote`) and `StartError`;
  - with `warningFor`, the kit's `Dialog` asks first, with `PRACTICE_OVER_RUN_COPY`. It stays silent until M14 gives `hasOpenRun` a store.
- **The game href:**
  - built from the filter params with the copied `withPractice` and `withQuery`, to `/play/solo` or `/play/duel`;
  - both routes stay placeholders until M14 and M17. Each placeholder shows the params it received, so the hand-off can be checked.
- **The archive line**, solo and not capped: "Or pick the exact match from the archive", as a secondary button to the Archive tab (not a text link, per `design-mobile.md` § 3).
- **`src/components/play/CreateRoom.tsx`:** "Play a friend", with **Create room** (Duel only), to `/play/duel?room=create` with the filters (`withRoom`, `CREATE_ROOM`):
  - **Hosting is Pro:** with access `locked`, it's M13a's `ProLockButton` with "Pro hosts rooms. Anyone can join." and See Pro. With `pending`, it's locked with no caption;
  - "Creating…" while busy, and `StartError`.
- **`src/components/play/JoinRoom.tsx`**, on step 1 with Duel picked (`theme.md` § Play setup: joining skips the filters, as the creator's set applies):
  - "Have a room code?" over six code boxes on one hidden `TextInput`, shown in `TYPE_ROOM_CODE`. The copied `roomCodeInput` cleans typing and pasting, and the keyboard capitalises with no autocorrect. The return key is Go;
  - **Join** goes live on `isRoomCode`, to `/play/duel?room=<code>` with any filter params (`withRoom`);
  - `ROOM_CODE_HINT` shows when a look-alike is typed (`hasLookAlike`);
  - the line "To host, choose your filters and create a room at the last step.";
  - a code arriving in the params (`joinCodeFrom`) fills the boxes. M22 links to it.
- **`src/components/play/StartError.tsx`:** the session error in `danger-text`, hidden while a retry runs. Screen readers hear it.
- **375pt:** Start and Create room sit side by side (`design-mobile.md` § 6).
- **`/dev/play`** gains Start at 3 left and at the cap, and Create room open, locked and pending.

## Mirrors

From the M13 row of the Web References table in `context/todo.md`, plus the room parts the M17 row also names; read-only in `../lineup-web/`:

- `src/components/play/`:
  - `StartStep.tsx`, `PlayStart.tsx`;
  - `PlaySummary.tsx` and `play-summary/`;
  - `StartError.tsx`, `CreateRoom.tsx`, `JoinRoom.tsx`.
- `src/hooks/use-start-navigation.ts`.
- `src/lib/room-code.ts`, `src/lib/lobby.ts` (`filterSummary`), `src/lib/practice.ts` and `src/lib/solo-allowance.ts`, all copied in M02.

No copy list.

## Out of Scope

- **What happens after the hand-off** is in later phases:
  - the solo run: M14;
  - the room's waiting screen, joining and refusals: M17;
  - `lineup://` room links: M22.
- **The share sheet** for a room code is M17's room-waiting screen.
- **Practice over a run in play**, for real: M14 moves `hasOpenRun` to device storage. The dialog is wired here and stays quiet until then.

## Notes

- Scope: step 3 and the join row on step 1. That finishes M13.
- Depends on: M13a and M13b, M07 (`useEnsureSession` through the guest flow), M04b (`Dialog`).
- Constraints:
  - **Nothing purchasable affects a duel** (Hard Constraint 15). Joining a room is open to everyone; only hosting is Pro. Free duels are never capped.
  - **The cap is the server's.** The client disables Start from the server's count, and the server still refuses.
  - **Never a dead end.** The cap offers Play a duel and See Pro, and a locked host still leaves Join live.
  - **Guest play needs no sign-up** (Hard Constraint 12). Start makes a guest when there's no session.
  - **Room codes** are 6 characters with no look-alikes. Normalising them is the copied helper's job; the server still checks.
- **Your part:** with the backend running, on the iOS Simulator:
  - start a solo run and a duel from step 3, and read the params on each placeholder;
  - pick Duel, type a code with an O in it, and see the hint;
  - Create room;
  - sign out first and Start, and a guest should be made.

  Claude checks Android first and stops when it needs you.
- **Deviations recorded during implementation:**
  - **The game href is `gameHref`** in `src/lib/game-href.ts`, with tests. It builds the query string as `withQuery` does, typed as an Expo Router `Href`:
    - a `{ pathname, params }` object was tried first;
    - pushing it joined the club array into one `club=a,b` value, which M17 would have read as no club;
    - repeated keys in a URL string arrive as separate values.
  - **Create room is split,** so its button can leave its section on a short screen:
    - `useCreateRoom` (`src/hooks/use-create-room.ts`) and the `CreateRoomState` type (`src/types/create-room.ts`);
    - `CreateRoomButton` (the button, or the lock);
    - `CreateRoomNotes` (the lock caption and the error);
    - `CreateRoom` (the "Play a friend" section);
    - `HOST_CAPTION` in `play/shared.ts`.
  - **375pt:** on a short screen, a duel's Start and Create room share a row at the default size (44pt):
    - at the large size, "Find an opponent" wraps in half a row;
    - Back leaves that row. The header chevron and Android's back button still step back;
    - the lock caption and any error go under the row.
  - **The practice warning uses the kit's `Dialog` directly.** `QuitDialog` arrives in M14. It closes after Start either way, as the screen stays under the game.
  - **The archive button also shows for Practice**, as on web: its mode is solo.
  - **The join row:**
    - Play keeps the last room code the params brought. The canonicalising effect drops `room` once the filters load;
    - a later code, from a warm link, replaces it. `JoinRoom` is keyed by it, so the boxes start afresh;
    - the boxes are drawn over a hidden `TextInput` (opacity 0). The box the next letter lands in gets the small hard shadow;
    - there's no `maxLength`, so a longer paste is cleaned before it's cut.
  - **The Play screen avoids the keyboard** (`Screen`'s `avoidsKeyboard`), so the code boxes stay above it. The hint under them can sit behind the keyboard while typing.
  - **`StartError` is read aloud** through `AccessibilityInfo.announceForAccessibility`, the web's `role="alert"`.
  - **`GamePlaceholder` lists what it received** under "Received", for both game routes.
  - **`LaterStep` is deleted:** step 3 was its last use.
  - **The summary's Edit buttons never shrink.** A longer value cut "Edit mode" to "Edit".
  - **Verified on Android:**
    - step 3 for solo, duel and practice: the summary, Edit mode and Edit filters, and the archive button;
    - each Start label, handing over:
      - solo: `competition`, `from` and `to`;
      - practice: `practice=1`;
      - Create room: two `club` values and `room=create`;
    - the join row:
      - "K7OM2X" showing the hint with Join off;
      - "K7QM2X" joining with Go;
      - a `room=h4wn7p` link filling the boxes;
    - `/dev/play`'s Start at 3 left and at the cap, and Create room open, locked and pending;
    - at 375 × 667, Start and Create room side by side.
  - **Verified on iOS by the user (2026-11-23):** solo and duel starts with their params on the placeholders, the look-alike hint, Create room, and a guest made by Start after signing out.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass;
  - the copied `room-code`, `lobby`, `practice` and `solo-allowance` tests keep passing.

## History
