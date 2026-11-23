# Phase M15a — Summary Panel

## Status

Completed

## Goals

- **`src/components/game/RunSummary.tsx`** replaces the "Built in M15" notice once a solo run ends (`view.end` set). It renders, in order:
  - **`run-summary/Outcome.tsx`:**
    - the title (`summaryTitle`: Run over, Run ended, Perfect clear) and "You named N of 11.";
    - beside them, the lives left (`Lives`). On a perfect clear, the count as a large number with "life left" or "lives left"; in practice, a **Practice** sticker in their place;
    - a perfect clear fills the block with `found`, edge to edge, as the web's.
  - **`run-summary/Stats.tsx` and `Stat.tsx`:** Accuracy (`accuracyLabel`) and Best streak, as two halves split by a 2pt ink rule.
  - **`src/components/game/NamedOrder.tsx` and `named-order/Row.tsx`:** "Named in order", the results table, built for both modes:
    - **solo:** order, headshot, name, the time (`findTimeLabel`) and a check. The fastest time is marked, in weight and for screen readers ("fastest"). A Total row ("7 named, 4 missed") closes it, and an empty run reads "You didn't name anyone this time.";
    - **duel:** the same rows with the finder's colour bar and name, no fastest mark and no Total. M18 checks this variant.
  - **`src/components/game/MissedReveal.tsx`,** in its own ruled section. It is hidden when nothing was missed:
    - **Pro:** a secondary button, "Reveal the full XI". After the tap, the line "Showing the N you missed." replaces it;
    - **Free** (the server sends `missed: null`): the button shown locked, with "Pro shows every player you missed." and See Pro, using M13a's `ProLockButton` and `ProLockCaption`.
  - **`run-summary/SummarySkeleton.tsx`:** the loading state (`end.status === 'loading'`). It has placeholders at the exact size of the outcome, the stats, three table rows and the actions, and the skeleton breath, which is static under reduced motion.
- **The missed slots fill one by one,** in a dimmed missed style:
  - goalkeeper first, `MISSED_REVEAL_STAGGER_MS` (60ms) apart, over `MOTION_SECONDS.missedReveal`;
  - the change is in `pitch/squad-grid/GridSlot.tsx` and `SquadGrid.tsx`, as the web's `missedRank`;
  - under reduced motion they all appear at once (`useMotionPolicy`, `missedReveal`);
  - a summary opened already revealed draws them at once.
- **The summary layout in `GameCanvas`** (`design-mobile.md` § 6, SUMMARY):
  - the board stays, with the scoreboard as in play;
  - the turf shrinks to about 40% of the window's height (30% on a short screen), showing found and missed;
  - under a 2pt ink rule, the summary scrolls;
  - the actions sit in a **pinned row** at the bottom that clears the home indicator. M15a pins a placeholder there (the M11 "Built in M15" notice, renamed to M15b) and keeps the existing `onBackToPlay` button, so a real run still has a way out.
- **`GameCanvas` takes `onRevealMissed`,** and `SoloGame` passes `useSoloRun`'s `revealMissed`.
- **`src/lib/canvas-parts.ts`:** `laterRailPart` stops naming the solo summary. A new line names only the actions (M15b), and its tests follow.
- **Screen readers:**
  - once the summary is ready, focus moves to the title, as M13a's `StepHeading` does (`sendAccessibilityEvent`, after a short delay);
  - after the reveal, the "Showing…" line is announced.
- **`/dev/canvas/solo`:** Reveal the full XI works in the preview. It flips `isMissedRevealed` on the snapshot, as the web's `CanvasStatePreview`. These states, all already in `canvas-states.ts`, render:
  - `summary-loading`, `run-over`, `run-over-pro`, `run-over-pro-revealed`;
  - `perfect-clear`, `quit`, `quit-empty`;
  - `run-over-capped`, `run-over-picked`, `practice-summary`.

## Mirrors

From the M15 row of the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/RunSummary.tsx` and `run-summary/` (`Outcome`, `Stats`, `Stat`, `SummarySkeleton`, `styles.ts`).
- `src/components/game/NamedOrder.tsx` and `named-order/Row.tsx`. M11a moved `NamedOrder` here.
- `src/components/game/MissedReveal.tsx`, and `src/components/pro/ProLock.tsx` for the lock's shape.
- `src/components/pitch/SquadGrid.tsx` and `squad-grid/GridSlot.tsx` (`missedRank`, `missedEntrance`).
- `src/lib/summary.ts`, already copied: `summaryTitle`, `accuracyLabel`, `namedOrder`, `namedTotalsLabel`, `findTimeLabel`, `missedOnPitch`.
- `src/components/dev/CanvasStatePreview.tsx` (`revealMissed`).
- `context/theme.md` § Solo (perfect clear, run over, missed revealed, practice).

No copy list: `summary.ts`, `result-actions.ts` and their tests arrived with copy list A.

## Out of Scope

- **The actions:** Play again, Change filters, Play a duel, Play it again, Practise again and Back to the archive, in `ResultActions` and wired in `SoloGame`. That is M15b.
- **The duel result** (`DuelResultPanel`) and the duel rows checked on a real duel: M18.
- **Profile history:** M19.

## Notes

- Scope: everything the summary shows, without its actions.
- Depends on: M14 (`SoloGame`, `useSoloRun`'s `revealMissed` and the summary request), M11 (`GameCanvas`, the dev summary states) and M08a (the missed slot style).
- Constraints:
  - **The server sends the summary** (Hard Constraint 1). The client renders `SoloSummary` as it arrives and computes nothing but labels. The missed players come only from the server, and only to Pro (Hard Constraints 2 and 16).
  - **The loser always sees the answers they named:** found and missed are on the pitch, and nothing is hidden behind the actions.
  - **With the switch off, no lock and no word "Pro"** appear: everyone is Pro and sees the Reveal button.
  - **Known shapes:** the skeleton matches the real parts' sizes, so nothing shifts on arrival.
  - **Text scaling stays on.** Only the stat numbers and the perfect-clear count, being fixed game pieces, take `maxFontSizeMultiplier`.
  - The component template, one component per file, sibling `styles.ts` for shared classes, and comments under 75 characters.
- **Content follows the web, layout follows `design-mobile.md`.** The sketch's stat row (named, lives, accuracy) is indicative. The web's split (named and lives in the outcome, accuracy and best streak in the stats) is what's built, because `theme.md` lists streak and accuracy.
- **Your part:** with the backend running, on the iOS Simulator:
  - play a run to the end, by quitting and by running out of lives, and read the summary;
  - tap Reveal the full XI (the switch is off, so you're Pro) and watch the missed slots fill goalkeeper first;
  - try it with Reduce Motion on.
- Verification (Claude, Android emulator):
  - every dev state above, at 390 × 844 and at 375 × 667;
  - a real run quit to its summary;
  - the Reveal stagger;
  - `npm run lint`, `typecheck`, `test`, `build` and `npx expo-doctor`.

**Deviations recorded during implementation**

- **`RunSummary` owns the scroll and the pinned row,** taking `actions` and `bottomInset`. M15b swaps `actions` for `ResultActions`.
- **`run-summary/ActionsSkeleton.tsx` was added:** two button placeholders for the pinned row while loading, since the actions sit outside the scroll.
- **`ProLockButton` takes `isFullWidth`,** as the web's `ProLock`, so the locked Reveal spans the rail.
- **`Outcome` focuses its own title:** it mounts only once the summary is ready, which stands in for the web's `isReady` effect.
- **`OUTCOME_BOX`, `STATS_BOX` and `SUMMARY_SECTION` live in `run-summary/styles.ts`:** only these parts share them for now. M18 moves `OUTCOME_BOX` if `DuelResultPanel` needs it.
- **"Opened already revealed draws at once"** uses a `SquadGrid` flag set on mount (`hadMissedOnMount`); the web animates either way.
- **`laterRailPart` returns null for solo,** and a `LATER_SUMMARY_ACTIONS` constant names the pinned-row placeholder ("Built in M15b: the summary actions.").
- **The keyboard band never applies to a summary** (`isBand` needs `soloEnd === null`), as the input is gone.
- The quit chip stays while the summary loads, as on web; a finished run's quit leaves without asking.

**Follow-ups**

- **At 375 × 667 the turf's 30% leaves a cramped pitch, with labels overlapping.** For M24, with M11b's small-phone pitch.
- **A long single word in a pitch label breaks mid-word** ("Christoph e", "Sh evchenko"), found and missed alike. This is M08a's two-line label, now seen more on a revealed pitch; for M24.
- The stagger was confirmed from device frame captures: the defence first, then the midfield, the forwards last.
- **Verified on iOS by the user (2026-11-23):** a run quit and a run out of lives to their summaries, Reveal the full XI filling goalkeeper first, and Reduce Motion showing them all at once.

## History
