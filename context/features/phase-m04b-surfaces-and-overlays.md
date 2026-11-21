# Phase M04b — Surfaces & Overlays

## Status

Not Started

## Goals

- **Surfaces**, in `src/components/ui/` with named exports:
  - `alert.tsx`: a tinted block with an icon and text, in the web's tones, outlined in ink;
  - `empty.tsx`: the web's Empty: a dashed outline, a butter icon tile with the small shadow, a title, a line and an action slot;
  - `avatar.tsx`: a circle with a 2pt outline, an image through `expo-image` or initials as the fallback, in the neutral, `you` and `opponent` tones;
  - `skeleton.tsx`: `skeleton-fill` at radius `sm`, sized by its caller, with the web's opacity pulse (`SKELETON_PULSE`), static under reduced motion.
- **The shell notices** (`src/components/shell/`):
  - `StateNotice.tsx`: Empty with a coral, butter or mint tile per tone (error, empty, info), an optional title, and a compact size;
  - `RetryNotice.tsx`: a StateNotice with a secondary Retry button.
- **Overlays:**
  - `dialog.tsx`: the web's AlertDialog as a React Native `Modal`. A centred white card with the outline, the hard shadow and radius `md`, over `gate-scrim`. Long-title type, 14pt muted text, full-width stacked buttons with the safe choice on top. Android's back button and a tap on the scrim cancel. It fades and scales in from 0.96 over 160ms (fade only under reduced motion).
  - `toast.tsx`: a sticker-style toast (white, outlined, small shadow) that rises and fades. It stays `toastVisible` long, and only fades under reduced motion (`toastRise` dropped, `toastFade` kept). It's presentational; M10's feedback toast places it.
  - `select.tsx`: a select row (label, value, count badge, chevron) that opens a **bottom sheet** of options with checkboxes, plus a search field when the list is long. The sheet follows Open Questions 1.
- **`/dev/kit`** gains these sections, with every state: each alert tone, Empty with and without an action, the notices, avatars with image and initials, skeleton shapes, an open dialog, a toast, and an open select.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/ui/`: `alert.tsx`, `empty.tsx`, `avatar.tsx`, `skeleton.tsx`, `alert-dialog.tsx`, `select.tsx`
- `src/components/shell/StateNotice.tsx`, `src/components/shell/RetryNotice.tsx`
- `src/components/game/FeedbackToast.tsx`: the toast's look and timing
- `src/styles/classes.ts`: `SELECT_TRIGGER`, `FILTER_SEARCH`
- `src/styles/motion.ts` (copied): `SKELETON_PULSE`, `toastVisible`, the policy

No copy list.

## Open Questions

Decided (user, 2026-11-21): **1 → `@expo/ui`'s native `BottomSheet`**, after a device spike; the custom `Modal` sheet is the fallback if the keyboard or scrolling fail.

1. **The select sheet.**
   - **Recommended: `@expo/ui`'s universal `BottomSheet`.** It's native on both platforms (a SwiftUI sheet on iOS, a Compose bottom sheet on Android), takes React Native children, and sets its background with `containerColor`. Long lists go in `RNHostView`. Keyboard behaviour inside it is undocumented, so the phase starts with a device spike: a search field and 40 rows. If either fails, fall back to the other option.
   - The other option is a custom sheet on React Native's `Modal`: Reanimated slide-up, `gate-scrim`, drag to dismiss with Gesture Handler. It needs no new native package and gives full control of the sticker look (ink top edge, grabber), at the cost of native sheet physics.
   - Not recommended: Expo Router's `formSheet`, which must be its own route, and `@gorhom/bottom-sheet`, whose docs claim Reanimated up to v3, while this repo runs v4.

## Out of Scope

- The game's feedback toast, with its verdicts and placement over the band (M10).
- Screen-level empty and error states, and their copy (each screen's phase).
- The splash and the 404 page (M05).

## Notes

- Scope: every surface and overlay the screens compose, on M04a's text, buttons, tiles, badges and checkbox.
- Depends on: M04a.
- Constraints:
  - As in M04a: the template, named exports in `ui/`, theme classes, `style=` only for Reanimated, `boxShadow` and run-time values, 44pt targets.
  - The dialog and the sheet trap focus for screen readers and announce their title (M23 checks it in full).
  - The toast never carries the only copy of a message; whatever it says is shown elsewhere too (`theme.md` § Sound and § States).
- **Your part:**
  - If Open Questions 1 picks `@expo/ui`, rebuild the dev build after it's added (`npx expo prebuild`, then the two `run` commands).
  - On the iOS Simulator: open a dialog and a select, swipe the sheet down, and type in its search field. Claude can't tap iOS.
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests cover the pure parts: the alert and avatar tone maps, avatar initials, and the select's search filter and selection logic.
  - Run it on the iOS Simulator and the Android emulator:
    - open `lineup://dev/kit?section=<id>` for each new section; every state matches `design-mobile.md`;
    - on Android, Claude opens the dialog and the sheet and taps through them (`adb shell input tap`). Back cancels both; the search filters the rows above the keyboard;
    - with Android's animations off, the dialog only fades, the toast doesn't rise and the skeleton is still.
  - What to tap: on the iOS Simulator, open the dialog and cancel it, open the select, search, pick two options, and swipe the sheet down.

- **Deviations recorded during implementation:**
  - **The select sheet is a custom `Modal` sheet, not `@expo/ui` (user, 2026-11-21).** On the Android spike, the native sheet opened, scrolled and took taps, but two things went wrong:
    - at half height the keyboard covered its search field;
    - an injected tap on a row with the keyboard up only closed the keyboard.

    Full height fixed the first, and `keyboardShouldPersistTaps` didn't fix the second. The user chose the agreed fallback, and `@expo/ui` is uninstalled. The same injected tap behaved identically on the `Modal` sheet, while the user's real taps worked on both platforms, so that symptom came from `adb shell input tap` with the keyboard open, not from the app.
  - **The sheet is its own component,** `src/components/ui/sheet.tsx`:
    - a `Modal` with its own `GestureHandlerRootView`, which Android needs for gestures in a modal window;
    - a `KeyboardAvoidingView`, so it rises above the keyboard;
    - an ink top edge and an ink grabber;
    - a Gesture Handler 3 pan (`usePanGesture`) on the header that dismisses past 120pt or a flick. The rule is `shouldDismiss` in `src/lib/sheet-gesture.ts`, a `'worklet'` function so it's testable in Node.

    Long lists take 90% of the screen and short ones fit their content. The select's list uses `keyboardShouldPersistTaps="always"`.
  - **Two more native motion effects** in `src/lib/motion-policy.ts`, both dropped under reduced motion:
    - `dialogScale`: the dialog's scale-in; its fade stays;
    - `sheetSlide`: the sheet fades in place of sliding.
  - **Shared values in hook configs use `.set()`.** React Compiler's `react-hooks/immutability` rule rejects `.value =` writes inside callbacks passed to a hook.
  - **Avatar fix:** `expo-image` ignores `className`, so the image fills the circle through `StyleSheet.absoluteFill`, the "NativeWind can't express" exception. Initials always sit underneath, so a loading or failed image shows them.
  - **Alert has the web's two tones** (`warning`, `neutral`). The avatar reuses the copied `initials` helper; the select reuses the copied `searchKey` and `toggleId`, and adds `filterOptions`, `selectValueLabel` and `needsSearch` in `src/lib/select.ts`.
  - **The new `/dev/kit` sections** live in `src/components/dev/KitSurfaces.tsx` (`SurfaceSections`), to keep `kit.tsx` manageable.
  - **Review fix: the dialog's scrim is a sibling of the card, not its parent.** A `Pressable` is `accessible` by default, so wrapping the card in one made VoiceOver read the dialog as a single "Close" element with unreachable buttons. The card now carries `accessibilityViewIsModal` and `onAccessibilityEscape` (cancel). The avatar gained `accessible`, so its name is read. Re-verified on Android: a tap on the card keeps it open, the scrim closes it, and the buttons are separate accessibility nodes.
- **Verified on Android:**
  - every new section renders;
  - the dialog opens, and Back cancels it;
  - the sheet opens above the keyboard, filters, scrolls 40 rows, ticks boxes, closes on Back, snaps back from a short drag and dismisses on a long one;
  - the toast shows and fades;
  - the skeleton pulses, and is still with the animation scales at 0 (settings restored).
- **Verified by the user with real taps (2026-11-21):** on Android and iOS, one tap ticks a searched option with the keyboard up. The sheet drags closed, and a tap outside closes the dialog.

## History
