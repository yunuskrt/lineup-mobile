# Lineup — Mobile Build Phases

Phase IDs use the `M` prefix. Line order is build order; the current phase is the first `- [ ]` line in the file.

Workflow per phase: `/todo current` → `/todo spec` → `/feature load <spec>` → `/feature start` → `/feature review` → `/feature test` → `/feature complete`.

This todo file is for developer-side use.

**The backend is ready for gameplay** (B01–B43 done). Mobile talks to the real API from its first networked phase (M06), against the local backend at `http://localhost:8080`. There is **no mock adapter** in this repo (user, 2026-11-20): the web's mock carries a copy of the rules, which no client may hold. Dev screens use the static samples copied from the web's `src/lib/dev/`.

**Decided (user, 2026-11-20):** phones only, portrait only; first launch shows a welcome, then the app opens on Play with bottom tabs (Play, Archive, Profile); native touches are haptics, a share sheet for room codes, and `lineup://` room links.

**Copy lists.** A phase marked `(copy list X)` starts with files the user pastes by hand from `lineup-web`. The lists are in `../lineup-web/context/docs/mobile-repo-setup.md` § Copy lists. Record every copied file in `context/web-carryover.md` (created in M02).

**Web references.** `../lineup-web/` and `../lineup-backend/` are readable from this repo and read-only. The table under the phases names the web files each phase mirrors: read them for behaviour, copy text, states and layout intent instead of restating them in the spec. Never import from them.

**Cross-repo dependencies** are marked `→ needs <ID>`.

---

## Part 1 — Foundation

- [x] **Phase M01 — Repo & Scaffold**: Expo Router on a dev build, strict TS, lint and prettier, `@/` alias, portrait, `lineup://` scheme.
- [x] **Phase M02 — Core Carry-over**: Copied schemas, types and pure helpers compile, Vitest green, component types moved to `types/`. (copy list A)
- [x] **Phase M03 — Theme & Fonts**: NativeWind theme from the web tokens and roles, Archivo widths and Inter, hard offset shadows, `/dev/theme`.
- [x] **Phase M04 — Native Kit**: Buttons, tiles, stickers, input, select sheet, checkbox, alert, empty, avatar, skeleton, dialog, toast; `/dev/kit`.
- [x] **Phase M05 — App Shell & Navigation**: Root stack, sticker tab bar (Play, Archive, Profile), full-screen game stack, safe areas, splash, 404.
- [x] **Phase M06 — API Client & Session**: Real transport, bearer token in SecureStore, env URL, Query on AppState and NetInfo, 401 sign-out. (copy list B)
- [x] **Phase M07 — Welcome & Auth**: First-launch welcome with the demo loop, sign in, sign up, continue as guest, guest upgrade.

## Part 2 — Game Pieces

- [x] **Phase M08 — Pitch & Match Header**: SVG pitch, formation slots, discs and headshots, ink scoreboard with crests and logo, `/dev/pitch`.
- [x] **Phase M09 — Clock, Lives & Turn**: Linear open-arc clock in three stages, lives section, turn sticker pair, `/dev/ring`, `/dev/lives`.
- [x] **Phase M10 — Guess Input & Feedback**: Live, pending, locked and cooldown input, suggestions above the keyboard, reveal, pulse vs shake.
- [x] **Phase M11 — Game Canvas & States**: Portrait board with pitch and rail, keyboard band, gate overlay, skeletons, `/dev/canvas?state=`.
- [ ] 🟡 **Phase M12 — Sound & Haptics**: Synthesized cues on a native Web Audio runtime, clock ticks, mute toggle, haptics doubling cues. (copy list C) — partially done: M12b haptics left

## Part 3 — Screens

- [ ] **Phase M13 — Play Setup**: `/play` steps (Mode, Filters, Start), Practice card, club search, runs-left line, join by code, Create room.
- [ ] **Phase M14 — Solo Run**: Side pick, 15s server-clock loop, quit dialog, lost-run, cap and picked-match gates, practice runs. (copy list D)
- [ ] **Phase M15 — Run Summary**: Summary sections, results table, missed reveal for Pro, Play again, Play a duel, Practise again.
- [ ] **Phase M16 — Socket Client**: Token handshake, protocol gate, takeover, reconnects, app background and foreground. (copy list E)
- [ ] **Phase M17 — Duel Lobby & Rooms**: Searching, pairing, filters, coin flip, no opponent; create, share, join and expired rooms. (copy list F)
- [ ] **Phase M18 — Duel Play & Result**: Alternating turns, their turn, drop and resume overlays, forfeit on back, result and replay actions.
- [ ] **Phase M19 — Profile**: Record, stat tiles, paged history, pull to refresh, guest strip with upgrade, sign out, `?state=`.
- [ ] **Phase M20 — Archive & Pro**: Archive search, filter sheet, fixture rows with Play and Practise, Pro locks, `/pro` table, `?state=`.
- [ ] **Phase M21 — System States**: Update-required screen with store link, empty pool widen, rate limit, connection lost, offline notice.
- [ ] **Phase M22 — Room Links**: `lineup://play/duel?room=<code>` opens the join with the code filled, cold start and warm.

## Part 4 — Quality & Release

- [ ] **Phase M23 — Accessibility Pass**: VoiceOver and TalkBack labels and order, text scaling caps, 44pt targets, contrast suite, reduced motion.
- [ ] **Phase M24 — Visual Polish Pass**: Every screen on a small iPhone, a large iPhone and a mid-range Android: spacing, transitions, press feel.
- [ ] **Phase M25 — Observability**: Sentry, error boundaries and the gameplay analytics events, named as on web. → needs W33
- [ ] **Phase M26 — E2E Suite**: Maestro flows for auth, solo and a cross-platform duel against a browser player.
- [ ] **Phase M27 — App Identity & EAS**: Icon, splash, bundle ids, EAS profiles, internal builds on TestFlight and Play internal testing.
- [ ] **Phase M28 — Store Release**: Production API URL, universal links on the shared domain, privacy labels, listings, submit. → needs B45, W35

---

## Web References

Read-only, in `../lineup-web/` unless a path says otherwise. Components are rebuilt natively; `lib/`, `types/` and `hooks/` arrive through the copy lists.

| Phase | Mirror these                                                                                                                                                                                                                                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M01   | `package.json` scripts, `tsconfig.json` paths, `eslint.config.mjs` (the `Props` and `React` rules), `.prettierrc`, `.prettierignore`                                                                                                                                                                  |
| M02   | Copy list A; `src/components/game/GuessInput.tsx` (`GuessInputStatus`), `src/components/game/QuitDialog.tsx` (`QuitDialogCopy`), `vitest.config.mts`                                                                                                                                                  |
| M03   | `src/styles/tokens.css`, `src/styles/theme.css`, `src/styles/classes.ts` (`TYPE_*`, `CODE_BOX`), `src/app/globals.css`, `src/app/layout.tsx` (fonts), `src/app/dev/theme/`, `context/screenshots/notes.md`                                                                                            |
| M04   | `src/components/ui/`, `src/styles/classes.ts` (`buttonVariants`, `CHOICE_TILE`, `PRESS`, `FILTER_CHIP`), `src/styles/motion.ts`, `src/hooks/use-motion-policy.ts`, `src/hooks/use-entrance.ts`, `src/lib/entrance.ts`, `src/components/shell/StateNotice.tsx`, `src/components/shell/RetryNotice.tsx` |
| M05   | `src/app/` route groups and layouts, `src/components/shell/` (`SiteNav`, `NavAccount`, `QuitChip`, `NotFoundView`), `src/app/not-found.tsx`                                                                                                                                                           |
| M06   | Copy list B; `src/lib/api/register.ts`, `src/lib/api/index.ts`, `src/components/providers/QueryProvider.tsx`; `../lineup-backend/context/docs/auth-setup.md` § Bearer (mobile); `../lineup-backend/src/contract/`                                                                                     |
| M07   | `src/components/home/` (`HomeFold`, `HomeRules`, `ShowcaseFrame`), `src/hooks/use-demo-playback.ts`, `src/lib/landing-demo.ts`, `src/lib/landing.ts`, `src/components/auth/`, `src/app/(site)/(pages)/sign-in/`                                                                                       |
| M08   | `src/components/pitch/`, `src/components/game/MatchHeader.tsx` and `match-header/`, `ClubCrest.tsx`, `CompetitionLogo.tsx`, `src/lib/formation.ts`, `src/lib/match-header.ts`, `src/app/dev/pitch/`                                                                                                   |
| M09   | `src/components/game/CountdownRing.tsx`, `Lives.tsx`, `LivesCard.tsx`, `DuelLivesCard.tsx`, `LifeLostFlash.tsx`, `src/lib/countdown.ts`, `src/app/dev/ring/`, `src/app/dev/lives/`                                                                                                                    |
| M10   | `src/components/game/GuessInput.tsx` and `guess-input/`, `SuggestionList.tsx`, `FeedbackToast.tsx`, `src/components/pitch/RevealCard.tsx`, `src/lib/feedback.ts`, `src/lib/suggestions.ts`, `src/app/dev/guess/`, `src/app/dev/feedback/`, `src/app/dev/reveal/`                                      |
| M11   | `src/components/game/GameCanvas.tsx` and `game-canvas/`, `CanvasGate.tsx`, `NamedOrder.tsx`, `FoundCount.tsx`, `PracticeCard.tsx`, `src/lib/canvas.ts`, `src/lib/dev/canvas-states.ts`, `src/app/dev/canvas/`, `src/app/dev/loading/`                                                                 |
| M12   | Copy list C; `src/styles/sound.ts`, `src/lib/sound-cues.ts`, `src/components/game/SoundToggle.tsx`, `src/app/dev/sound/`, `context/theme.md` § Sound                                                                                                                                                  |
| M13   | `src/app/(site)/(pages)/play/`, `src/components/play/`, `src/lib/play-steps.ts`, `src/lib/filters.ts`, `src/lib/solo-allowance.ts`, `src/hooks/use-start-navigation.ts`                                                                                                                               |
| M14   | Copy list D; `src/app/(game)/play/solo/`, `src/components/game/SoloGame.tsx`, `SidePickCard.tsx`, `QuitDialog.tsx`, `src/lib/solo-run.ts`, `src/lib/practice.ts`                                                                                                                                      |
| M15   | `src/components/game/RunSummary.tsx` and `run-summary/`, `MissedReveal.tsx`, `ResultActions.tsx`, `src/lib/summary.ts`, `src/lib/result-actions.ts`                                                                                                                                                   |
| M16   | Copy list E; `src/lib/api/duel-client.ts`, `src/lib/api/duel-emitter.ts`, `context/docs/w30-manual-testing.md`                                                                                                                                                                                        |
| M17   | Copy list F; `src/components/duel/LobbyPanel.tsx` and `lobby-panel/`, `src/components/play/CreateRoom.tsx`, `JoinRoom.tsx`, `src/lib/lobby.ts`, `src/lib/room-code.ts`                                                                                                                                |
| M18   | `src/app/(game)/play/duel/`, `src/components/game/DuelGame.tsx`, `DuelResultPanel.tsx`, `ReconnectChip.tsx`, `Tally.tsx`, `src/lib/duel-session.ts`, `src/lib/duel-result.ts`, `src/lib/duel-status.ts`, `context/docs/w31-manual-testing.md`                                                         |
| M19   | `src/components/profile/`, `src/lib/profile.ts`, `src/lib/dev/profile-states.ts`                                                                                                                                                                                                                      |
| M20   | `src/components/archive/`, `src/components/pro/`, `src/lib/archive.ts`, `src/lib/pro.ts`, `src/lib/dev/archive-states.ts`                                                                                                                                                                             |
| M21   | `src/lib/system-states.ts`, `src/components/game/ProtocolRefused.tsx`, `context/theme.md` § System                                                                                                                                                                                                    |
| M22   | `src/lib/room-code.ts` (`roomLink`, `ROOM_PARAM`)                                                                                                                                                                                                                                                     |
| M23   | `src/styles/contrast.ts`, `src/styles/contrast.test.ts`                                                                                                                                                                                                                                               |
| M24   | `context/screenshots/` (the reference boards), and this repo's own `context/design-mobile.md`                                                                                                                                                                                                         |
| M25   | The W33 spec in `context/features/`, once written                                                                                                                                                                                                                                                     |
| M26   | The W34 Playwright flows, once written                                                                                                                                                                                                                                                                |

---

## Deferred

Not phases yet — promoted into a part above only when scoped.

- Tablet layout and landscape (user, 2026-11-20: phones, portrait only; iPad runs the phone layout)
- Payments: Pro purchase through native IAP and RevenueCat (web has no purchase flow yet either)
- Compliance: minors and COPPA decision, Play Families policy
- Push notifications, leaderboards, friend invites, ranked ELO, daily challenge, achievements
- Social sharing of results, spectating
