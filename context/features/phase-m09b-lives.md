# Phase M09b — Lives

## Status

Not Started

## Goals

- **`src/components/game/Lives.tsx`:** three shirts from the copied `SHIRT_PATH`, in `react-native-svg`:
  - a life left is filled in the owner's colour (`you` or `opponent`) with a 1.5 ink outline;
  - a life lost is a dashed `fg-dim` outline (`2.5 2`) with no fill;
  - when a life is lost, the emptied shirt's fill fades out (`lifeFill`) and the shirt shakes −4 → 4 → −3 → 3 → 0 over 480ms (`lifeShake`);
  - two sizes: the default (about 20pt) and `isLarge` for the rail (about 28pt);
  - the group reads "2 of 3 lives left".
- **`src/components/game/Tally.tsx`:** the count in the Numbers role at 30, beside the large shirts. It's hidden from screen readers, as the shirts already say it.
- **`src/components/game/LivesCard.tsx`:** solo. A "Lives" section label over the tally. The hint line "Clock at 0 costs a life. The run ends at 0 lives." isn't shown on phones, as on the web below `lg`. The frame is `src/components/game/CardFrame.tsx`, shared with the duel card.
- **`src/components/game/DuelLivesCard.tsx`:** the duel's lives section, one player at a time:
  - a `You` or `Opponent` sticker with the handle (one line, truncated), over that player's tally;
  - it shows whoever's turn it is;
  - after a life is lost, it holds on that player for 480ms (`MOTION_DURATION_MS.lifeLost`), so the shirt is seen emptying;
  - two dots (`duel-lives-card/Dot.tsx`) let the player peek at either side until the turn changes;
  - both layers share one cell, so nothing shifts when it switches. The switch cross-fades over 240ms (`livesSwitch`);
  - before pairing (`opponent` null), the opponent's dot is disabled;
  - the copied `droppedLifeActor` and `shownLivesActor` decide only which player is shown.
- **`src/components/game/ReconnectChip.tsx`:**
  - "Reconnecting, 18s" in a `warning` sticker with Lucide `WifiOff`, by the duel card's label;
  - its seconds are ticked from the server's deadline through the copied `reconnectSecondsLeft` (250ms), and decide nothing;
  - while it's up, the opponent's dot turns `warning`.
- **`src/components/game/LifeLostFlash.tsx`:**
  - a full-screen `danger` overlay, 0 → 25% → 0 over 480ms, that never takes a touch;
  - it fires when `flashKey` changes, never on mount (`useChangedSinceMount`);
  - it's kept under reduced motion (`lifeLostFlash` is `keep`).
- **`/dev/lives`** (`src/app/dev/lives.tsx`), from the web's `LivesPreview`:
  - **Solo:** Lose a life (with the flash) and Reset;
  - **Duel:** Hand over, Clock runs out, You lose a life, They lose a life, Opponent reconnecting, Before pairing and Reset. It uses the web's two handles, the long one to test truncation;
  - **Static:** both owners at 3, 2, 1 and 0;
  - a `?section=` filter, as on the other dev pages.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/game/Lives.tsx`, `Tally.tsx`, `CardFrame.tsx`, `LivesCard.tsx`, `DuelLivesCard.tsx` and `duel-lives-card/Dot.tsx`.
- `src/components/game/LifeLostFlash.tsx`, and `ReconnectChip.tsx` (listed under M18; pulled forward, as the duel card shows it).
- `src/lib/duel-status.ts` (copied): `droppedLifeActor`, `shownLivesActor`, `reconnectSecondsLeft`.
- `src/styles/motion.ts` (copied): `lifeLost` 480ms, `turnHandover` 240ms, and the reduced-motion policy.
- `src/components/dev/LivesPreview.tsx` and `src/app/dev/lives/`.

No copy list.

## Out of Scope

- Placing the lives in the rail or band, beside the clock and the turn sticker (M11).
- Mounting the flash on the game screen, and the whistle sounds and haptics (M11, M12).
- The opponent's reconnecting line under the board and the forfeit (M18).

## Notes

- Scope: every lives display and the life-lost flash, on a dev page. Not wired to a game.
- Depends on: M09a (the turn sticker beside the lives on the dev page), M04 (Badge, `useMotionPolicy`).
- Constraints:
  - **Exactly 3 lives,** shown from the server's count (`MAX_LIVES`). A life is lost only when the server says so. The client never decides it (Hard Constraint 9).
  - **You are blue and the opponent is orange,** with ink outlines, as the pastels alone are under 3:1. The sticker names whose lives are shown.
  - **Reduced motion** drops the shake. The fill fade, the switch and the flash stay, as they carry information.
  - **The peek dots** are 44pt targets around a 12pt dot (hit slop). A tap mustn't dismiss the keyboard or blur the guess input, as on web.
  - **Text scaling** is capped on the tally (`maxFontSizeMultiplier`).
  - One component per file, and the template. `CardFrame` and `Tally` stay top-level in `game/`, as two parents use them.
- **The design's hearts are sketch symbols.** The lives are the web's shirts.
- **Your part:** on the iOS Simulator, open `lineup://dev/lives`. Try each button, and turn Reduce Motion on and off. Claude checks Android and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: any pure helper this phase adds. The copied `duel-status.test.ts` keeps passing.
  - On both simulators, `/dev/lives`:
    - losing a life empties one shirt with a shake and a red flash;
    - with reduced motion, there's no shake, but the fill and the flash remain;
    - the duel card follows the turn and holds on a dropped life, and the dots peek;
    - the reconnect chip counts down, and turns the opponent's dot amber;
    - before pairing, the opponent's dot is disabled;
    - the long handle truncates on one line;
    - the static shirts read clearly in both colours.

## History
