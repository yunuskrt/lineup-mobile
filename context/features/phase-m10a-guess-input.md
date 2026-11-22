# Phase M10a — Guess Input

## Status

Not Started

## Goals

- **`src/components/game/GuessInput.tsx`:** the web's guess input as a native `TextInput`, in the four statuses (`GuessInputStatus`, copied in M02):
  - **live:**
    - white, 48pt tall, with the small hard shadow, an ink label "Guess a player" and the placeholder "Name a player…";
    - focused when it turns live;
  - **pending:** muted text and a spinner inside the field (`guess-input/Spinner.tsx`, still under reduced motion), read as "Checking";
  - **locked:** dim text, flat;
  - **cooldown:**
    - muted and flat;
    - `guess-input/CooldownLine.tsx` under the field counts to the server's retry time through the copied `cooldownLabel` (250ms tick), and decides nothing;
    - the copied `cooldownAnnouncement` is read once per lockout.
- **The keyboard stays up:**
  - while the field is pending, locked or in cooldown, it keeps its focus and the keyboard, and it ignores typing;
  - Send submits and the keyboard stays open for the next guess;
  - Return is `send`; autocorrect, spell check, autocomplete and auto-capitalisation are off; `maxLength` is the copied `MAX_GUESS_LENGTH`.

  A guess typed blind is a lost round (`coding-standards-mobile.md` § Native).
- **Submitting:**
  - the text goes through the copied `prepareGuess`; an empty guess sends nothing;
  - a sent guess closes the suggestion list until the text changes;
  - a tapped suggestion fills the field with the player's name and sends it.
- **Shake:** when `shakeKey` changes (a "Not in this XI"), the field shakes 0 → −6 → 6 → −4 → 4 → 0 over 240ms (`inputShake`, dropped under reduced motion). A `danger` border flashes and fades (`inputRejectTint`, kept). The text stays.
- **`src/components/game/SuggestionList.tsx`:** suggestions above the field, over whatever is behind it:
  - from the copied `suggest` over a `SuggestionIndex`, opening at 3 letters (`MIN_SUGGESTION_LETTERS`), only while live and focused;
  - each row is 44pt: the headshot (32pt), the name on one line, and a grey "Named" tag on a row already found, which is dimmed and can't be picked;
  - 3 rows show, then it scrolls (`design-mobile.md` § 6; 2 rows below 700pt of height);
  - a tap on a row never dismisses the keyboard;
  - a screen reader hears the count (the copied `suggestionCountLabel`) when the list opens.
- **`/dev/guess`** (`src/app/dev/guess.tsx`), from the web's `GuessPreview`:
  - a next-outcome picker (the copied `GUESS_OUTCOME_OPTIONS`);
  - force live, pending, locked or cooldown, plus Shake and Open list;
  - the input over the copied `SAMPLE_SUGGESTION_INDEX`, with Rhys Harlow already named;
  - a fake server: a send goes pending for 600ms, then applies the picked outcome through the copied `guessFeedback`. A correct guess locks the field for 900ms, then makes it live;
  - the sent guesses listed under it;
  - placed at the bottom of the screen, above the keyboard, as the band will sit;
  - a `?section=` filter.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/GuessInput.tsx` and `guess-input/` (`Spinner.tsx`, `CooldownLine.tsx`, `CooldownAnnouncement.tsx`).
- `src/components/game/SuggestionList.tsx`.
- `src/lib/suggestions.ts`, `src/lib/guess.ts`, `src/lib/feedback.ts` and `src/lib/system-states.ts` (all copied, with tests).
- `src/components/dev/GuessPreview.tsx` and `src/app/dev/guess/`.

No copy list.

## Open Questions

1. **The keyboard on the opponent's turn** (`design-mobile.md` § Open questions 1):
   - dismiss it, so the full board shows their reveals, and raise it on your turn;
   - or keep it up, to save the raise time.

   M10a measures the raise time on both platforms: from a live status to the keyboard in place, on `/dev/guess`, in milliseconds. It records the figures in the spec, for you to decide before M11 builds the band. **Recommended, unless the figures say otherwise: dismiss it.**

## Out of Scope

- The feedback toast, the reveal card and the already-found pulse (M10b).
- The keyboard band, the board's layout around it, and where the toast sits (M11).
- Sounds and haptics for a guess (M12).
- The player directory query that feeds the suggestions in a game (M14, M18). The dev page uses the static sample index.

## Notes

- Scope: the guess input and its suggestions, on a dev page. Not wired to a game.
- Depends on: M09 (the motion patterns), M08 (`PlayerHeadshot`), M04 (`Badge`, `useMotionPolicy`), M02 (the copied helpers).
- Constraints:
  - **Suggestions are a typing aid,** never a verdict. A pick is sent as a plain text guess, and the server decides (Hard Constraints 1 and 2). The index is the catalog's public directory, never the squad.
  - **Already-found speaks through the grid, not-in-XI through the input** (`theme.md` § States). The input only shakes; it never shows a verdict of its own.
  - **No hardware-keyboard highlight.** The web's arrow keys and Escape have no phone equivalent; rows are tapped. `stepHighlight` stays unused.
  - **Accessibility:**
    - the field is labelled "Guess a player";
    - pending is busy and locked is disabled to a screen reader;
    - the list is labelled "Suggested players";
    - a named row is disabled.
  - **Text scaling stays on** for the field and the rows; they grow in height, not in a fixed box.
  - Theme roles only, and `style=` only for Reanimated. One component per file, and the template.
- **Your part:**
  - On the iOS Simulator, open `lineup://dev/guess` and type with the software keyboard (⌘K toggles it).
  - Send each outcome, open the list and tap a suggestion, and force each status. The keyboard should never drop.
  - Claude checks Android, measures the raise time on both platforms, and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: any pure helper this phase adds (for example the rows shown by screen height). The copied `suggestions`, `guess`, `feedback` and `system-states` tests keep passing.
  - On both simulators, `/dev/guess`:
    - typing "har" opens the list with Rhys Harlow dimmed and tagged "Named";
    - a tap on another row sends that name, and the keyboard stays up;
    - a send goes pending with the spinner and returns live, with the keyboard up throughout;
    - "Not in this XI" shakes the field with a red border and keeps the text;
    - "Correct" clears it, locks it, then makes it live;
    - cooldown shows the counting line;
    - with reduced motion, there's no shake, but the red border and the spinner remain.

- **Deviations recorded during implementation:**
  - **Not live, the field stays editable and ignores typing.** It isn't `editable={false}` and isn't marked `disabled`:
    - React Native's controlled `TextInput` puts the text back to `value`, so a key typed while pending doesn't stay;
    - with `accessibilityState.disabled`, Android disabled the native view and the keyboard dropped on lock;
    - a screen reader hears the status as the field's value instead ("Checking", "Locked", "Too many guesses, wait"), with `busy` while pending.
  - **The suggestion list is in the column above the label, not floating.** Android delivers touches only inside a view's parent, so a list hanging out of the input's box couldn't be tapped there. M11 anchors the band to the bottom, so the list grows up over the turf.
  - **Send keeps the keyboard** through `submitBehavior="submit"`, the current replacement for `blurOnSubmit`.
  - **The dev page pads above the keyboard on both platforms** (`KeyboardAvoidingView` `padding`). With edge to edge, Android doesn't resize the window, as `Screen` found in M07.
  - **New helper:** `src/lib/suggestion-list.ts`, with tests. It shows 3 rows, 2 below 700pt of height, 44pt each.
  - **Where the parts live:** the shake and red border are `guess-input/ShakeFrame.tsx`; the spinner and the cooldown line are their own parts. The web's `CooldownAnnouncement` is one `announceForAccessibility` call per lockout.
  - **Not carried:** the web's `drivenHighlight` (the landing demo opening the list without focus). M11 adds it with the demo, if needed.
  - **The "Named" tag sits in a wrapper:** the kit `Badge` aligns itself to the top of a row.
  - **Review fix:** the spinner is hidden from screen readers, as the field's value already says "Checking".
- **Keyboard raise time (Open Questions 1), from the field turning live to `keyboardDidShow`:**
  - Android emulator (Pixel, Gboard): 148, 234, 184, 217 and 266 ms; median 217 ms;
  - iOS Simulator (iPhone 15 Pro, software keyboard): 609 ms, one run;
  - the two aren't like for like: iOS sends `keyboardDidShow` when the slide-up animation ends, while Android sends it once the window's insets change.
- **Verified on Android, `/dev/guess`:**
  - the input sits above the keyboard;
  - "har" opens 3 rows that scroll, with Rhys Harlow dimmed and tagged "Named";
  - a tap on Tom Hargreaves sends it, goes pending with the spinner, and returns live, with the keyboard up throughout;
  - text typed while pending is ignored;
  - Correct clears it, locks it with the keyboard still up, then makes it live;
  - cooldown counts "Too many guesses. Try again in 7s";
  - Shake moves the field with a red border, and the text stays.

  With animations off (after a relaunch), the red border flashes with no shake, and the spinner still shows. The emulator's "show the keyboard with a hardware keyboard" setting was turned on for the test and restored.
- **Verified by the user on iOS (2026-11-22):** `/dev/guess` with the software keyboard: suggestions, picks, each outcome and status, and the keyboard timing.
- **Decided (user, 2026-11-22), Open Questions 1:** dismiss the keyboard on the opponent's turn, and raise it on yours. M11 builds the band that way; `design-mobile.md` § Open questions records it.
- **Follow-up (M11):** `GuessInput` focuses itself whenever it turns live. Dismissing the keyboard on the opponent's turn needs the band to hide the field and call `Keyboard.dismiss()`, and to let it refocus when the turn comes back.

## History
