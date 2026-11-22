# Phase M08a — Pitch & Squad

## Status

Not Started

## Goals

- **`src/components/pitch/Pitch.tsx`:**
  - the web's pitch in `react-native-svg`, on the same 100 × 120 view box;
  - mown checks inside the lines, the markings and corner arcs;
  - `turf`, `turf-check` and `marking` roles from `ROLES`;
  - always upright, with the goal at the bottom (`design-mobile.md` § 3);
  - `pitch/PitchEnd.tsx` for the boxes, as on web.
- **`src/components/pitch/SquadGrid.tsx`:** the eleven slots placed by the copied `slotLayout(formation)`, over the pitch, at a 5 : 6 ratio that fits its box. It always shows eleven slots, revealed or not (`theme.md` § Rules). Its states:
  - **loading:** eleven skeleton slots in `LOADING_FORMATION`, pulsing as one (static under reduced motion), so nothing shifts on arrival;
  - **revealed and missed players,** placed by slot.
- **Disc and slot sizes as pure functions** (`src/lib/squad-grid.ts`), from the pitch width and the formation:
  - the disc gets smaller as lines are added: about 44pt on a 390pt phone and 36pt on a 375pt one, the web's three steps by line count;
  - the slot width comes from the widest line.

  They replace the web's container-query classes, which React Native has no equivalent for.
- **`src/components/pitch/SquadSlot.tsx`**, the web's four states:
  - `loading`: a skeleton disc and label;
  - `empty`: `squad-slot/EmptyDisc.tsx` and the position pill (GK, DF, MF, FW), read as "Goalkeeper, not yet named";
  - `filled`: the headshot and the name label, white in solo. In a duel, the label takes the finder's colour (`you` blue, `opponent` orange) and is read as "named by you" or "named by your opponent";
  - `missed`: dimmed, after a run.

  Names clamp to two lines. Text scaling is capped on the slots (`maxFontSizeMultiplier`), as they're fixed-size game pieces.
- **`src/components/pitch/PlayerHeadshot.tsx`:** an `expo-image` photo in the disc, falling back to the copied `PERSON_PATH` silhouette, through the copied `useImageFallback`.
- **`/dev/pitch`** (`src/app/dev/pitch.tsx`), the web's specimens from `src/lib/dev/samples.ts`:
  - every fixture formation (4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 3-4-3, 4-1-4-1, 4-1-2-1-2), each empty, partial and full;
  - a duel split by finder, missed slots and the loading grid;
  - a `?section=` filter, as the other dev pages.

## Mirrors

From the Web References table in `context/todo.md`; read-only in `../lineup-web/`:

- `src/components/pitch/`: `Pitch.tsx` and `pitch/`, `SquadGrid.tsx` and `squad-grid/`, `SquadSlot.tsx` and `squad-slot/`, `PlayerHeadshot.tsx`, `styles.ts`, and `squad-grid.test.ts` (the sizing rules to port).
- `src/lib/formation.ts` (copied): `parseFormation`, `slotLayout`, `positionForSlot`, `LOADING_FORMATION`.
- `src/app/dev/pitch/`.

No copy list.

## Out of Scope

- The reveal card, the new-fill flash and the already-found pulse (M10).
- The match header (M08b), and the whole board with its rail and keyboard band (M11).

## Notes

- Scope: the squad's pitch and slots, in every state, on a dev page. Not wired to a game yet.
- Depends on: M04 (Skeleton, the motion policy), M02 (formation and samples).
- Constraints:
  - The squad is never requested; the grid draws only the revealed players it's given (Hard Constraint 2).
  - You blue, the opponent orange, never red against green. The label says who, not only the colour.
  - Theme roles only, including inside the SVG, through `ROLES`.
  - `style=` only for run-time sizes (disc and slot) and Reanimated.
  - One component per file, and the template.
- **Your part:** on the iOS Simulator, open `lineup://dev/pitch` and scroll the formations. Claude checks Android with screenshots and stops when it needs you.
- Verification:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format:check` and `npx expo-doctor` all pass.
  - Tests: `src/lib/squad-grid.ts` follows the web's rules. Three-line formations get the largest discs, four-line ones smaller and five-line the smallest, and the slot width follows the widest line.
  - On both simulators, `/dev/pitch`:
    - every formation shows eleven slots, upright, with no label overlapping its neighbour;
    - the duel specimen tells the finders apart by colour and label;
    - the loading grid is still with Android's animations off.

- **Deviations recorded during implementation:**
  - **Pitch lines are ink (`line`), not `marking`,** as the web draws them. They're 2pt at any size: the stroke width is worked out from the pitch's drawn width (`strokeFor` in `pitch/pitch/styles.ts`). On Android, `vectorEffect="non-scaling-stroke"` drew them thinner than the 2pt frame.
  - **A missing photo shows initials, not the silhouette,** as the web's `PlayerHeadshot` does through its Avatar. The silhouette is the empty slot's disc (`EmptyDisc`).
  - **Sizes are the web's formulas, in points** (`src/lib/squad-grid.ts`):
    - disc: `clamp(min, share × pitch width, max)` by line count, which is 46.8pt for three lines on a 390pt pitch, 31.2 for four and 25.4 for five;
    - slot width: by the widest line, capped at 160;
    - label: 11, 12 or 14 by pitch width;
    - `fitPitch`: the largest 5 : 6 pitch in the box.

    The spec's "about 44 and 36pt" were the design's rough figures for three lines.
  - **Kit change:** `Avatar` takes `diameter` (a run-time size, with initials at 36% of it), `isDecorative` (hidden when a parent names the player) and `className`.
  - **The loading grid pulses through each slot's `Skeleton`**, started together, rather than one wrapper animation. It's still static under reduced motion.
  - **`GridSlot` shows the filled slot directly.** M10 swaps in the reveal card. The missed slots appear at once; their staggered reveal is M15's.
  - **`/dev/pitch` shows every formation full** (the overlap worst case), then the empty and partial states on 4-2-3-1, rather than all 21 combinations.
  - **The headshot's fallback is the kit `Avatar`'s own `onError`,** not the copied `useImageFallback`; the effect is the same. Initials stay under the photo, so a slow or failed photo shows them.
  - **Long names in five-across lines (3-5-2) break mid-word,** as the web's `break-words` does. It's readable; noted for M24.
- **Verified on Android, `/dev/pitch`:**
  - all 7 formations upright, with eleven slots and no labels overlapping, including 3-5-2 and five-line 4-1-2-1-2;
  - the duel shows both finders' colours, and the empty slots show the silhouette and position;
  - missed slots are dimmed and dashed;
  - the loading grid shows eleven skeleton slots in 4-4-2.

  The sample photos are web-only paths, so initials show (the fallback).
- **Verified by the user on iOS (2026-11-22):** `/dev/pitch`, with every formation upright, the lines as thick as the frame and no labels overlapping.

## History
