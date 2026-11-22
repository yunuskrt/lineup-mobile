# Phase M12b — Haptics

## Status

Not Started

## Goals

- **`src/lib/haptics.ts`, extended:** a `CUE_HAPTICS` map from each sound cue to a haptic, or to none, and a `cueHaptic(cue)` that plays it. It uses `expo-haptics`, already installed for the press haptic:
  - iOS uses the notification and impact feedback styles;
  - Android uses its own `AndroidHaptics` effects, as `pressHaptic` already does.
- **The proposed map** (Open Questions 2):

  | Cue | Haptic |
  | --- | --- |
  | `correctNew` | success |
  | `theirReveal` | light impact |
  | `notInXi` | warning |
  | `alreadyNamed` | light impact |
  | `lifeLost` | error |
  | `theirLifeLost` | none |
  | `turnToYou` | medium impact |
  | `opponentFound` | success |
  | `resultWin`, `perfectClear` | success |
  | `resultDraw` | warning |
  | `resultLoss`, `runOver` | error |
  | `tick` | none |
  | `finalBeep` | none |

  A buzz each second would turn the clock into a vibration; the beeps and the critical stage already carry the urgency.
- **Haptics double the cues, not the sound:** `use-game-sounds` fires the haptic with the cue, from the same event. Whether muting the sound also stops the haptics is Open Questions 1.
- **The OS has the last word:** a phone with system haptics off, or with no haptic hardware, stays still, and a failed call is swallowed (as `pressHaptic` does).
- **`/dev/sound`** gains a haptic next to each cue button, and a "Play with haptic" switch, so each pair can be felt.

## Mirrors

No web counterpart: the web has no haptics. The references are `context/design-mobile.md` § 4 (press feedback, with a light haptic on press-in) and `coding-standards-mobile.md` § Native.

No copy list.

## Open Questions

Decide at `/feature load`; the defaults stand otherwise.

1. **Does the mute toggle stop haptics too?**
   - **Recommended:** no. The toggle mutes sound, as its label says, and haptics follow the phone's own setting. A player in a quiet room can mute and still feel a find.
   - **Alternative:** one toggle for both.
2. **The map above:** keep it, or change any row.

## Out of Scope

- The press haptic on buttons. It's been in the kit since M04a.
- Any setting screen for haptics. The OS setting governs.

## Notes

- Scope: the cue-to-haptic map, firing it with the cues, and trying it on `/dev/sound`.
- Depends on: M12a (the cues and `use-game-sounds`).
- Constraints:
  - **Haptics only double what the screen already shows** (`coding-standards-mobile.md` § Native). Nothing is felt that isn't shown.
  - **No cue decides anything,** and neither does its haptic.
  - The life-lost haptic comes from the server's life-lost event, as the whistle does, never from the clock reaching 0.
- **Your part:** haptics can't be felt on a simulator. The iOS Simulator has none, and the Android emulator only vibrates if it's set up to.
  1. Run the dev build on a real iPhone or Android phone (`npx expo run:ios --device` or `npx expo run:android --device`).
  2. Open `lineup://dev/sound` and feel each cue.
  3. On `/dev/canvas`, try `correct`, `not-in-xi` and `life-lost`.

  Claude checks the code paths in the Android emulator's log and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: `CUE_HAPTICS` covers every cue in `SOUND_CUES`, and the ticks and beeps have none.
  - On a real phone, each mapped cue buzzes as listed and the unmapped ones stay still. Muting follows Open Questions 1.

## History
