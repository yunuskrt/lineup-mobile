# Phase M04a — Press & Controls

## Status

Completed

## Goals

- **Motion helpers:**
  - `src/hooks/use-motion-policy.ts`: the web hook rebuilt on Reanimated's reduced-motion signal, returning `(effect) => boolean` through the copied `motionFor` in `src/styles/motion.ts`.
  - `src/hooks/use-entrance.ts`: the web's group entrance, as a mount entrance on a phone. It returns a Reanimated `entering` animation per index (rise `LANDING_RISE_PX`, `landingRise` duration, `LANDING_STAGGER_MS` stagger), or none when `landingEntrance` is dropped.
- **Press haptic:** `src/lib/haptics.ts`, a light impact through `expo-haptics`, using the call its SDK 58 docs give for each platform.
- **The pressable plate** (`src/components/ui/pressable-face.tsx`), which every pressable control sits on:
  - a fixed ink plate under the face, 4pt or 2pt down and to the right;
  - on press-in, the face slides onto it in 80ms and back in 140ms, as a Reanimated transform with a light haptic;
  - under reduced motion the face stays put and the plate hides, as on web (`PRESS`);
  - disabled controls sit flat and don't buzz.
- **The static shadow box** (`src/components/ui/shadow-box.tsx`) for surfaces that don't press: `SHADOW_HARD` as `boxShadow`, or the plate where `boxShadow` can't draw (Open Questions 1).
- **Controls**, each in `src/components/ui/` with named exports, as the exempt kit folder allows:
  - `text.tsx`: the kit's `Text`, defaulting to `font-body text-16 text-fg` (the M03 follow-up). React Native's own `Text` is the system font.
  - `button.tsx`: primary (lavender) and secondary (white); default 44pt with 14pt text, large 56pt with 16pt, and a 44pt icon size. A disabled state, and a busy state that keeps the label.
  - `choice-tile.tsx` (`CHOICE_TILE`): a white outlined tile that presses like a button, flat while busy. Plus `icon-tile.tsx` (`ICON_TILE`): an outlined square holding a Lucide icon.
  - `badge.tsx`: the web's `tag` and `sticker` variants with every tone. A sticker is uppercase Archivo with the small shadow, tilted −3° (left, the default) or +2°.
  - `filter-chip.tsx` (`FILTER_CHIP`): a pill, lavender when on.
  - `input.tsx`: white, 48pt, taupe placeholder, the small hard shadow when focused, a `danger` border when invalid, quieter when read-only.
  - `checkbox.tsx`: a 20pt box, lavender with a check when on, with hit slop to 44pt.
- **Icons:** `lucide-react-native`, on `react-native-svg`, at stroke 2.25 to 2.5 in ink.
- **`/dev/kit`** (`src/app/dev/kit.tsx`, with `?section=` as `/dev/theme` has): every control in every state, and each pressable shown resting and pressed.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/styles/classes.ts`: `buttonVariants`, `PRESS`, `CHOICE_TILE`, `ICON_TILE`, `FILTER_CHIP`, `TEXT_INPUT`
- `src/components/ui/`: `button.tsx`, `badge.tsx`, `input.tsx`, `checkbox.tsx`
- `src/styles/motion.ts` (copied in M02): the durations and the reduced-motion policy
- `src/hooks/use-motion-policy.ts`, `src/hooks/use-entrance.ts`, `src/lib/entrance.ts`

No copy list.

## Open Questions

Decided (user, 2026-11-21): **1 → support Android below 9**, with the plate fallback in `ShadowBox`.

1. **Android below 9** (`design-mobile.md` open question 2). The minimum is API 24 (Android 7), and `boxShadow` outset shadows need Android 9.
   - **Recommended: support it.** `ShadowBox` draws the plate below Android 9, so static surfaces still get a shadow; pressables use the plate everywhere anyway.
   - The other option raises the minimum to API 28 with `expo-build-properties`, so `ShadowBox` is `boxShadow` alone.

## Out of Scope

- The surfaces and overlays: alert, empty, the state notices, avatar, skeleton, dialog, toast and the select sheet (M04b).
- A switch, tabs and the room-code boxes: built with their screens (M07, M13, M17).
- Sound and cue haptics (M12). The press haptic here is the only one.

## Notes

- Scope: the press feel and the controls every screen uses, on the M03 theme.
- Depends on: M03, for the tokens, `SHADOW_HARD`, `classes.ts` and the fonts.
- Constraints:
  - The kit follows the template, with named exports; a file holding several components names their props `<Name>Props`.
  - Classes come from the theme; `style=` only for Reanimated styles, `boxShadow` and run-time values, each with its one-line comment.
  - 44pt targets; a smaller visual gets hit slop.
  - Native packages are installed with `npx expo install` (`react-native-svg`, `lucide-react-native`, `expo-haptics`); check each one's SDK 58 docs first.
- **Your part:**
  - Rebuild the dev build after the native packages are added (`npx expo prebuild`, then `npx expo run:ios` and `npx expo run:android --no-bundler`).
  - Tap a few controls on the iOS Simulator, since iOS can't be tapped from a shell.
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests cover the pure parts: the variant maps (button, badge tones), the shadow-fallback decision, and the motion policy hook's mapping.
  - Run it on the iOS Simulator and the Android emulator:
    - open `lineup://dev/kit` on both; every control in every state matches `design-mobile.md`;
    - on Android, Claude holds a press (`adb shell input swipe` in place) and screenshots the face sunk onto its plate;
    - with Android's animations off, the face doesn't move and the plate hides.
  - What to tap: on the iOS Simulator, press a primary button, a tile and a chip, and feel the face sink and the light haptic.

- **Deviations recorded during implementation:**
  - **The press effect is `pressShift`, a native addition** in `src/lib/motion-policy.ts` (`policyFor`), dropped under reduced motion. `motion.ts` has no press effect and stays a word-for-word web copy, so the mobile policy extends it instead of editing it. `useMotionPolicy` accepts web and native effects.
  - **The entrance is split** like the runtime check: `src/lib/entrance.ts` (`entranceTiming`, testable in Node) and `src/hooks/use-entrance.ts`, which wraps it in a Reanimated `entering` worklet. It runs on mount, not in view: the web's `useInView` has no use on a phone screen this size.
  - **The press haptic is per platform:** `impactAsync(Light)` on iOS and `performAndroidHapticsAsync(AndroidHaptics.Virtual_Key)` on Android, as the `expo-haptics` SDK 58 docs recommend.
  - **Filter chips stay flat, as on web** (`FILTER_CHIP` has no shadow), with a pressed tint (`active:bg-surface-raised`) and the light haptic instead of a plate.
  - **Dev-only props** show states a screenshot can't catch: `isPressedPreview` on `PressableFace`, `Button` and `ChoiceTile`, and `isPlatePreview` on `ShadowBox`.
  - **The input's focus shadow is `boxShadow` only.** Swapping in the plate on focus would change the tree, remount the field and drop the keyboard, so Android 7 and 8 show no focus shadow.
  - **`DevScreen` and `DevSection`** moved to `src/components/dev/DevSection.tsx`; `/dev/theme` and `/dev/kit` share them.
  - **Kit class maps** live in `src/components/ui/styles.ts`. The copied `cn` from `src/lib/utils.ts` merges caller classes over kit defaults; it already treats `text-12`…`text-72` as sizes and replaces font families correctly (checked before use).
- **Verified on Android** (`lineup://dev/kit?section=…`, held press via `adb shell input swipe`): every section renders; a chip toggles; a held press sinks the face onto its plate. With the animation scales at 0, the face stays put and the plate hides. The settings were restored afterwards.
- **Verified on iOS by the user** (2026-11-21): a held press sinks the face and springs back; a tile presses and selects; a chip tints and toggles; the input shows its cursor and focus shadow (the Simulator's hardware keyboard hides the on-screen one; ⌘K shows it); Replay runs the entrance.

## History
