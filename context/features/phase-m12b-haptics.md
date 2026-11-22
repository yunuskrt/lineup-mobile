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

Decided (user, 2026-11-23): **1 → no**, the toggle mutes sound only and haptics follow the phone's setting; **2 → keep the map** as written.

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

- **Deviations recorded during implementation:**
  - **The map lives in its own pure file,** `src/lib/cue-haptics.ts` (`CUE_HAPTICS`, with tests), with its kind type in `src/types/haptics.ts`. `src/lib/haptics.ts` imports `expo-haptics`, which can't load in Node, so the test reads the map from the pure file. `cueHaptic(cue)` in `haptics.ts` plays it.
  - **How each kind plays:**
    - **iOS:** success, warning and error are notification feedback; light and medium are impact feedback;
    - **Android:** success is `Confirm`, warning `Long_Press`, error `Reject`, light `Keyboard_Tap` and medium `Context_Click`, through `performAndroidHapticsAsync`.
  - **Wiring:** `use-game-sounds` fires each event cue's haptic beside `play`, from the same event, so the mute doesn't touch it (decided). The clock cues have no haptic, so the clock loop is unchanged. The ledger notes it in `web-carryover.md`.
  - **`/dev/sound`:** each cue row shows its haptic kind, or "no haptic", and a "Play with haptic" chip (on by default) makes the cue buttons buzz as the board does.
- **Verified on Android:** the emulator records each effect it's asked for (`dumpsys vibrator_manager`), though it can't vibrate.
  - **`/dev/sound`:**
    - `correctNew` asked for constant 16 (CONFIRM), `notInXi` 0 (LONG_PRESS), `lifeLost` 17 (REJECT) and `turnToYou` 6 (CONTEXT_CLICK);
    - `tick` asked for nothing.
  - **The board, muted:** with the toggle muted, `/dev/canvas` `correct` still asked for 16 (CONFIRM), about 600ms in, from the board's own event path. The toggle was unmuted after.
- **Real-phone check deferred (user, 2026-11-23):** feeling each buzz on a phone is left for later, along with M12a's iPhone silent switch. The Android emulator's vibrator log stands in until then. Two ways to get the dev build onto the user's Xiaomi:
  - USB-C or wireless `adb`, then `npx expo run:android --device`;
  - an arm64 APK (`./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a`), installed by hand and connected to Metro by its QR code.

  Expo Go can't run the app, as it lacks `react-native-audio-api`.
- **Checks:** all pass. `npm run lint` keeps its one warning from Expo's generated `.expo/types/router.d.ts`.

## History
