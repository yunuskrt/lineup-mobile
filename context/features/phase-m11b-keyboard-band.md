# Phase M11b — Keyboard Band

## Status

Not Started

## Goals

- **The band, on your turn and in solo** (`design-mobile.md` § 4, "The game keyboard", and the "your turn, keyboard up" sketch in § 6). With the keyboard up:
  - the rail becomes a band pinned above the keyboard:
    - on top, one row with the clock (`CountdownRing` at `size="band"`, 56pt), the lives and the turn sticker;
    - the input under it;
  - the scoreboard compacts to the one-line strip (`MatchHeader isCompact`);
  - the pitch scales down to fill what's left. It stays upright with all eleven slots in view, and nothing scrolls;
  - **suggestions** open above the band, over the bottom of the turf. The band is anchored to the bottom, so the list grows upward (M10a follow-up). Every row stays tappable on Android, so the list stays inside a parent's bounds;
  - **toasts** sit just above the band.
- **Their turn, dismissed (user, 2026-11-22):**
  - on the handover to the opponent, the band hides the field and calls `Keyboard.dismiss()`. The full board shows their reveals, with the full-size clock (M11a's layout);
  - when the turn comes back, the field returns live and refocuses, and the keyboard rises (about 0.2s on Android and 0.6s on iOS, per M10a);
  - this needs a change to M10a's `GuessInput`: it focuses itself only on becoming live, so the band must let it refocus when it shows again.
- **Keyboard state, in one hook** (`src/hooks/use-keyboard-band.ts`, or a better name):
  - **what it reports:** whether the keyboard is up, and its height;
  - **events:** iOS uses the keyboard's `Will` events, so the band moves with it; Android uses `Did`, as it has no `Will`;
  - **Android layout:** the window doesn't resize under edge to edge (M10a), so the band is placed from this hook, not by the window.
- **The band stays put through every input status:**
  - pending, locked (life lost, correct new) and cooldown keep the keyboard up (M10a);
  - the band doesn't flicker between layouts as the status changes.
- **The gate and the band:**
  - a gate opening dismisses the keyboard (M11a);
  - when it closes onto a live input, the field refocuses.
- **Peek-dot check (M09b follow-up):**
  - the board uses `keyboardShouldPersistTaps="handled"`;
  - a tap on a duel lives' peek dot keeps the keyboard up and the guess focused.
- **375pt (iPhone SE):**
  - suggestions show 2 rows (M10a's `visibleSuggestionRows`);
  - discs go from about 44pt to 36pt;
  - the whole board still fits above the keyboard.
- **`/dev/canvas`** covers it: `idle`, `suggesting`, `pending`, `not-in-xi`, `already-found` and `life-lost` open with the band up. Duel `idle` and `their-turn` show the switch.
- **A dev control for the handover:** a "Pass the turn" button on duel states. It's a dev overlay on `/dev/canvas/[mode]`, not in the board, and it toggles `turn` between you and the opponent, so the dismiss and the refocus can be tried back to back.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/game-canvas/ActiveRail.tsx` (the toast over the band's top on phones; both layers in one cell, so there's no shift on the handover).
- `src/components/game/GameCanvas.tsx`.

Most of this phase has no web counterpart: the band is phone-only, so `design-mobile.md` § 4 and § 6 are the reference. No copy list.

## Out of Scope

- The welcome's demo loop (M11c).
- The real duel's turn events (M18). The handover here is driven by dev states and the dev button.
- Sounds on the handover (`turnToYou`, M12).

## Notes

- Scope: the keyboard-up layout and the turn-driven keyboard, on `/dev/canvas`. M11a's `KeyboardAvoidingView` stand-in is removed.
- Depends on: M11a (the board).
- Constraints:
  - **The guess input and the pitch stay visible above the keyboard** (`coding-standards-mobile.md` § Native). A guess typed blind is a lost round.
  - **The clock is information:** in the band it's smaller, never hidden, and its sweep never stops under reduced motion.
  - **Whose turn it is stays visible** in the band, by sticker as well as colour.
  - **Touch targets are at least 44pt,** and that holds in the band too.
  - Layout changes follow the keyboard. If any added motion is decorative, it goes through `useMotionPolicy`.
  - Theme roles only; `style=` for run-time sizes (the keyboard's height). One component per file.
- **Your part:**
  - on the iOS Simulator with the soft keyboard on (I/O → Keyboard → Toggle Software Keyboard), open `lineup://dev/canvas` and try the band states;
  - in a duel, try "Pass the turn" a few times;
  - type to open suggestions and tap one;
  - tap a peek dot while typing;
  - then repeat on an iPhone SE simulator.

  Claude checks Android first and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: any pure helper (for example, the pitch's scaled size for a given space).
  - **On both simulators, with the keyboard up:**
    - the band sits right on the keyboard;
    - the scoreboard is the strip and all eleven slots are visible;
    - suggestions grow up over the turf and each row is tappable;
    - the toast shows above the band.
  - **On both, the handover:**
    - "Pass the turn" to the opponent drops the keyboard and shows the full board with the orange clock;
    - passing it back raises the keyboard with the field focused.
  - **On both, the rest:**
    - a peek-dot tap leaves the keyboard up;
    - the board fits at 375pt.

## History
