# Phase M07 — Welcome & Auth

## Status

Not Started

## Goals

- **Welcome** (`src/app/index.tsx`, no tabs), drawn as in `design-mobile.md` § 6:
  - the "Lineup" wordmark, the Display "Know the XI." and a butter "Guess the Squad." sticker turned −3°;
  - the web's line "You get one team from a real match. Name its starting eleven before the clock runs down.";
  - the rules row: 11 named, 15s a turn and 3 lives, in the web's three block colours, with the web's rule text;
  - **Continue as guest** (primary) and **Sign in** (secondary), pinned at the bottom above the home indicator;
  - Continue as guest makes a guest and replaces the route with `/play`, and Sign in pushes `/sign-in`;
  - on 375 × 667 the rules row drops its long text and keeps the numbers and short labels.
- **First-launch rule:** `/` shows the welcome when no session token is stored, and redirects to `/play` when one is. See Open Questions 2.
- **Sign in** (`src/app/sign-in.tsx`, pushed, no tabs), mirroring the web's `AuthPanel`:
  - a `Sign in | Create account` switch, kept in the route as `?mode=sign-up`, read with the copied `authModeFrom`;
  - a full-bleed mint band holding the form;
  - Continue as guest under the band when there is no session;
  - with a guest session, the web's line "You're playing as {handle}." Its sign-up line is "Create an account to keep your history.", and its sign-in line is "Signing in to another account leaves this guest's games behind.";
  - signed in as a user: the web's `SignedInPanel`, with an avatar, "You're playing as {handle}.", Play and Sign out;
  - while the session loads, a skeleton of the form. If it fails, a `RetryNotice`.
- **The forms** (`src/components/auth/`, rebuilt from the web's):
  - `AuthForm` validates with the copied request schemas and `authFieldErrors`, shows field errors under each field, and focuses the first invalid one;
  - `SignInForm`: email and password;
  - `SignUpForm`: handle, with the hint "Your name in duels.", then email and password;
  - the server's error uses `authErrorMessageOf` in an `Alert`;
  - fields set `textContentType` (iOS) and `autoComplete` (Android), so password managers fill them. Return moves to the next field, and Go submits;
  - submitting locks the fields, and the button reads "Signing in…" or "Creating account…";
  - success dismisses back to `/play`.
- **Guest upgrade:** with a guest session, Create account calls the upgrade, not a fresh sign-up, through the copied `signUpTarget` in `useSignUp`. The guest's history stays.
- **Keyboard:** the form scrolls above the keyboard, and the submit button stays in view on 375 × 667. Taps on the button work with the keyboard up (`keyboardShouldPersistTaps`).
- **The Profile tab placeholder** gains a Sign in or Create account button, matching the session, so the upgrade can be reached until M19.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/home/HomeFold.tsx` and `HomeRules.tsx`: the welcome's copy and rules.
- `src/components/home/ShowcaseFrame.tsx`, `src/hooks/use-demo-playback.ts` and `src/lib/landing-demo.ts`: the demo loop. Its timeline is already copied; see Open Questions 1.
- `src/lib/landing.ts` (copied).
- `src/components/auth/` and `src/app/(site)/(pages)/sign-in/`: states, copy and field order.
- `src/lib/auth.ts` (copied): messages, field errors, `signUpTarget` and `authModeFrom`.

No copy list.

## Open Questions

Decided (user, 2026-11-22): **1 → no demo now; it moves to M11** (Game Canvas), once the pitch and input exist. **2 → no session token means the welcome.**

1. **The demo loop.** On the web it draws the pitch filling and the guess input typing. Those are M08's pitch and M10's input, which don't exist yet.
   - **Recommended: build the welcome without the demo frame now, and add the demo once the pitch and input exist.** It fits in M11 (Game Canvas), and M07 records the move. Building it now would mean a throwaway pitch.
   - Build a simplified demo now on a placeholder board, to be replaced in M11.
2. **How the app knows it's a first launch.**
   - **Recommended: no session token means the welcome.** It needs no new storage: a guest or a signed-in player goes straight to Play. After Sign out, the next launch shows the welcome again, which offers the right two choices.
   - A stored "seen the welcome" flag, which shows it exactly once per install, even after a sign-out. It needs a storage package (AsyncStorage, a native rebuild) or a misuse of the keychain.

## Out of Scope

- The demo loop (Open Questions 1), the Profile screen and its guest strip (M19).
- Password reset and email verification; the web has neither.
- Any social sign-in. Accounts are email and password only (`project-overview.md` § F).

## Notes

- Scope: the first screens a player sees, and every way into a session.
- Depends on: M06 (session hooks, token store), M05 (Screen, routes), M04 (kit).
- Constraints:
  - Guest play needs no sign-up, and upgrading never destroys history (Hard Constraint 12). The upgrade goes through the backend's upgrade route, never a new account.
  - Client validation is a convenience; the backend revalidates. Show the server's message as it comes, through `authErrorMessageOf`.
  - Never log the password or the token. A password field is `secureTextEntry` and never auto-corrected.
  - 44pt targets, text scaling on, safe areas, and the template.
  - Copy matches the web's, except for phone-only lines (the button labels above).
- **Your part:**
  - Keep the backend running (`npm run start:dev`) and `adb reverse tcp:8080 tcp:8080` on Android. No rebuild is needed: there are no new native packages.
  - On the iOS Simulator:
    - fresh install state: Sign out on `/dev/session`, then relaunch to see the welcome;
    - Continue as guest;
    - from Profile, Create account (the upgrade);
    - Sign out, then Sign in with that account;
    - try a wrong password, and type with the keyboard up.
  - Claude stops and says when.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests cover the pure parts this phase adds: the first-launch rule (token or not), the field config (order and content types), and any helper beside `src/lib/auth.ts`.
  - On both simulators, against the local backend:
    - no token: the welcome; with a token: Play;
    - Continue as guest lands on Play as a guest;
    - Create account as a guest upgrades the same user: the handle changes, and `/dev/session` shows a User;
    - Sign out, then Sign in with that account, lands on Play;
    - a wrong password shows the server's message, and a bad email shows the field error, focused;
    - with the keyboard up, the submit button stays visible on a 375 × 667 screen, and one tap submits.

- **Deviations recorded during implementation:**
  - **The demo loop moves to M11 (user, 2026-11-22).** The welcome ships with the fold and the rules. M11 adds the demo once the pitch and input exist; `todo.md`'s M11 line doesn't say so yet.
  - **The rules are three stacked tiles, not a three-column row.** At 390pt, three columns can't fit the web's sentences. Each tile holds the number, a short label ("named", "a turn", "lives") and the web's sentence. Below 700pt of height (`isShortScreen` in `src/lib/welcome.ts`), the sentence drops.
  - **Kit changes:**
    - `Input` takes a `ref` (`TextInputInstance`), so Return can move to the next field;
    - `Screen` takes `avoidsKeyboard` (a `KeyboardAvoidingView` with `padding`);
    - every `Screen` scroll uses `keyboardShouldPersistTaps="handled"`.
  - **Where the parts live:**
    - the welcome is `src/components/home/Welcome.tsx`, built from `HomeFold` and `HomeRules`, with `home-rules/RuleTile.tsx`; `src/app/index.tsx` picks it or the redirect;
    - field configs are in `src/lib/auth-fields.ts`, with their type in `src/types/auth-form.ts`;
    - `ContinueAsGuest` takes `onDone`, as the welcome replaces the route while the sign-in screen dismisses back to Play.
  - **Sign in's title follows the session:** "Signed in" for a user, otherwise the mode's title. The Profile placeholder gives a signed-in user a "Signed in" button to that panel.
  - **Review fix:** the welcome's statement is one accessible heading (`accessible` on its wrapper), and a label on the rules' wrapper that was never announced is removed.
- **Verified on Android, against the local backend:**
  - no token: the welcome (fold, rules, two pinned buttons); with a token, a cold start lands on Play;
  - an empty submit shows both field errors, with the first field focused;
  - Return moves to the next field, and Go submits;
  - a wrong account shows the server's "Email or password is incorrect.";
  - Continue as guest lands on Play;
  - Profile → Create account shows the guest line and upgrades the guest to a User;
  - Sign out, then Sign in with that account, lands on Play;
  - the signed-in panel shows the avatar, the handle, Play and Sign out.

  A first sign-in try failed only because the test's tap put the email into the wrong field. Retyped, it passed.
- **Verified by the user on iOS (2026-11-22):** the welcome after a sign-out and a relaunch; Continue as guest; Profile → Create account upgrades the guest to a User; Sign out and Sign in with the account; a wrong password's alert; and, on a small screen, the submit button in view and working with the keyboard up.

## History
