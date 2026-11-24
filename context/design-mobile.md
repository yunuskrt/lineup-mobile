# Design — Mobile

How the web's **Matchday Sticker** look becomes a native iOS and Android app. Every UI phase reads this file. `theme.md` says what each screen does and says; this file decides how it looks. The web (`../lineup-web`) is the reference for copy, states and layout intent; this file wins on anything phone-specific.

The test for every screen: **it should feel made for a phone, not like the website shrunk.** Native navigation, native gestures, the web's colours and type.

## 1. The look

- **Light only.** A cream base (`surface`), never a dark mode. The status bar uses dark content, except over the ink scoreboard, where it uses light content.
- **Pastel blocks** (lavender, mint, butter, coral) for fills, picked states, heroes and stickers. Few per screen: most of the screen is cream and white.
- **2px ink outlines** on everything that's touchable or framed. Rules between sections are 2px ink as well.
- **Hard offset shadows, no blur:** 4pt down and right (2pt on small parts), in ink.
- **Tilted stickers:** short uppercase Archivo tags on a pastel fill with a small shadow, turned −3° (left, the default) or +2° (right). One or two per screen at most.
- **Chunky Archivo headings** in semi-expanded extra bold; numbers expanded black; everything else Inter.
- **Lucide icons** (`lucide-react-native`), stroke 2.25 to 2.5, in ink. Small icons sit in an outlined tile (`ICON_TILE`), never as illustrations. No doodles, photos of people, or 3D art.

## 2. Tokens

Every web token and role keeps its web name. Hex values come from `src/styles/tokens.css` and `theme.css`. The four mixed roles were worked out from their OKLCH `color-mix()`, and M03 confirmed them against `culori`, a CSS Color 4 implementation (`gate-scrim` with premultiplied alpha, as CSS mixes).

### Palette

| Group  | Tokens                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Base   | cream `#fefae0` · peach-cream `#faedcd` · sage-pale `#e9edc9` · sage `#ccd5ae` · caramel `#d4a373` · white `#ffffff`                                         |
| Blocks | lavender `#c4b5fd` · mint `#a7e3c4` · butter `#ffd972` · coral `#ff9f8a`                                                                                     |
| Duel   | duel-blue `#7fb2f5` · duel-orange `#ff9e6d`                                                                                                                  |
| Status | status-green `#4caf6e` · status-amber `#ffb938` · status-red `#f0564a`                                                                                       |
| Ink    | ink `#1f1b16` · umber `#5e554c` · taupe `#8a7f73`                                                                                                            |
| Deep   | blue-deep `#0c64d7` · orange-deep `#bc3f00` · green-deep `#317649` · amber-deep `#915e00` · red-deep `#cf1a0c`                                               |
| Tints  | tint-green `#e1fae7` · tint-amber `#fff4ee` · tint-red `#fdefee` · tint-blue `#e5f3fe` · tint-purple `#efeaff` · tint-yellow `#fcf5db` · tint-grey `#f1f1f1` |

### Roles

| Roles                                                                        | Value                                                     |
| ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| `surface`                                                                    | cream `#fefae0`                                           |
| `surface-raised`                                                             | peach-cream `#faedcd`                                     |
| `surface-card`                                                               | white `#ffffff`                                           |
| `surface-sage`, `skeleton-fill`                                              | sage-pale `#e9edc9`                                       |
| `line`, `fg`, `on-accent`, `focus`, `scoreboard`                             | ink `#1f1b16`                                             |
| `rule`                                                                       | ink 18% in cream → `#d2ccb7`                              |
| `marking`                                                                    | sage `#ccd5ae`                                            |
| `fg-muted`, `already-found-pulse`                                            | umber `#5e554c`                                           |
| `fg-dim`                                                                     | taupe `#8a7f73`                                           |
| `brand`, `block-lavender`                                                    | lavender `#c4b5fd`                                        |
| `block-mint`, `turf`                                                         | mint `#a7e3c4`                                            |
| `turf-check`                                                                 | mint 88% with ink → `#9bc7a5`                             |
| `block-butter`, `score-digits`                                               | butter `#ffd972`                                          |
| `block-coral`                                                                | coral `#ff9f8a`                                           |
| `accent-caramel`                                                             | caramel `#d4a373`                                         |
| `on-scoreboard`                                                              | cream `#fefae0`                                           |
| `you` · `opponent`                                                           | duel-blue `#7fb2f5` · duel-orange `#ff9e6d`               |
| `found`, `reveal-flash-you` · `warning` · `danger`                           | `#4caf6e` · `#ffb938` · `#f0564a`                         |
| `reveal-flash-opponent`                                                      | found 60% with opponent → `#aaac3b`                       |
| `you-text` · `opponent-text` · `found-text` · `warning-text` · `danger-text` | `#0c64d7` · `#bc3f00` · `#317649` · `#915e00` · `#cf1a0c` |
| `tag-green` … `tag-grey`                                                     | the seven tints, same order                               |
| `gate-scrim`                                                                 | ink at 40% → `#1f1b1666`                                  |

Text on a pastel fill is always `on-accent` (ink). Coloured text uses the `-text` roles, never the fill colours.

### Type (phone sizes)

The web's base sizes, not its `md:` ones. Line heights are in points, because React Native has no relative line height.

| Role                                             | Face                                        | Size / line                  |
| ------------------------------------------------ | ------------------------------------------- | ---------------------------- |
| Display (Welcome headline)                       | Archivo SemiExpanded ExtraBold              | 34 / 34                      |
| Title (screen titles, "Run ended")               | Archivo SemiExpanded ExtraBold              | 30 / 38                      |
| Section                                          | Archivo SemiExpanded ExtraBold              | 24 / 30                      |
| Card title, big call to action                   | Archivo SemiExpanded ExtraBold              | 20 / 25                      |
| Long title (over ~20 characters, dialogs, gates) | Archivo Bold (normal width)                 | 20 / 25                      |
| Numbers (clock, score, stats)                    | Archivo Expanded Black, tabular             | clock 64, score 32, stats 30 |
| Wordmark "Lineup"                                | Archivo Expanded Black                      | 24                           |
| Room code                                        | Archivo SemiExpanded ExtraBold, tracked out | 20                           |
| Sticker                                          | Archivo SemiExpanded ExtraBold, uppercase   | 12                           |
| Text                                             | Inter 400 / 500                             | 16 / 24                      |
| Small, buttons                                   | Inter 500 (buttons 600)                     | 14 / 20                      |
| Caption, section label (uppercase, muted)        | Inter 500                                   | 12 / 16                      |
| Player names                                     | Inter 600                                   | 12 to 14                     |

Uppercase is for stickers and section labels only. If Turkish capitals (İ Ş Ğ) clip at a line height of 1.0 on Android, M03 adds a couple of points.

### Space, radii, lines, shadows

- **Spacing:** the web's 4pt scale (4, 8, 12, 16, 24, 32, 48, 64). **Layout snaps to 8pt.** 4 and 12 are only for padding inside a control.
- **Screen gutter** 16. Ruled sections have 24 above and below each rule, as on web.
- **Radii:** sm 6 (stickers, skeletons, checkboxes) · md 10 (buttons, inputs, tiles, dialogs) · lg 16 (lists, the sheet's top corners) · full (chips, avatars, the active tab).
- **Lines:** outlines and rules are always 2pt ink; the `rule` colour is for quiet dividers inside a white list.
- **Shadows:** `shadow-hard` is 4/4 and `shadow-hard-sm` is 2/2, ink, no blur, no spread.

## 3. Standing preferences (from the web, the user's)

- **Screens are open columns of ruled sections.** Never one box around the page. Lists and tiles may be outlined; the screen itself never is.
- **The game is one united board:** scoreboard, turf and rail, full-bleed edge to edge, split by ink rules. No separate white cards on top of it.
- **Actions are buttons**, secondary where they aren't the main action. Never underlined text links.
- **The pitch is always upright:** the goal at the bottom, never turned sideways.
- **You are blue, the opponent is orange.** Never red against green. The label and the position say it too.
- **The clock goes normal → warning → critical.** Normal is the owner's colour at weight 6 (on a 100-unit arc). Warning (7–4s) is amber at weight 9. Critical (3–0s) is red at weight 12, pulsing 1 → 0.6 → 1 each second. Each stage has a 3-unit ink edge. The sweep is linear and runs under reduced motion.
- **New colours are the user's call.** Suggest, don't decide. This file adds none.

## 4. Native patterns

- **Tab bar:** Play, Archive and Profile, in the sticker style. A cream bar with a 2pt ink rule on top, 56pt plus the bottom safe area. The active tab's icon sits in a lavender pill (2pt ink outline, small hard shadow), with an Inter 600 12 label in ink. Inactive tabs are an umber icon and label. The bar is hidden on the game, Welcome, Sign in and Pro.
- **Screen headers:** no page title (user, 2026-11-24): the tab bar names the tabs, and each screen opens on its first section, 16pt under the top edge. Pushed screens, and Play past step 1, get a 44pt row with a plain chevron (the web ruled out the back-arrow tile); tab screens with nothing to go back to have no row. A 2pt ink rule fades in under the top edge once the column scrolls. **The auth screens alone keep a large left-aligned title** (Title role) that collapses into a compact bar when scrolled past: cream, the title at 20, the rule fading in under it.
- **Bottom sheets replace popovers and selects:** the filter pickers, the archive filters and the club search. A sheet is the kit's `Sheet` (M04b), a `Modal` that slides up over `gate-scrim`, with an ink top edge and grabber, and drags down to dismiss; it rises above the keyboard. Inside, it's cream, with a title row over an ink rule, a search field when the list is long, and ruled rows with checkboxes. The native `@expo/ui` sheet was tried and dropped (user, 2026-11-21).
- **Dialogs feel native and keep the sticker look.** A centred white card with a 2pt ink outline, the hard shadow and radius md, over `gate-scrim`. Long-title type, 14pt muted text. Buttons are full width and stacked, with the safe choice on top. Android's back button and a tap on the scrim cancel. It fades and scales in from 0.96 over 160ms (fade only under reduced motion).
- **Press feedback:** a pressable's face sinks 4pt into its shadow, which disappears. That's 80ms down and 140ms back, with a light haptic on press-in. Under reduced motion the shadow just drops, with no shift, as on web. Disabled controls stay flat and don't buzz.
- **Pull to refresh** on Profile history and the Archive list, with the spinner in ink.
- **Skeletons** are `skeleton-fill` at radius sm, the exact size of what loads, with a slow opacity breath (static under reduced motion). The only spinner is the pending one inside the guess input.
- **Safe areas** on every screen. The scoreboard runs up under the status bar on the game screen. Every pinned bottom action clears the home indicator.
- **The game keyboard:** with the keyboard up, the rail becomes a **band** pinned above it: the clock and lives on one row, the input under them. The scoreboard compacts to one line. The pitch scales down to fill what's left, staying upright and in full view. Suggestions open above the band, over the bottom of the turf. Feedback toasts sit just above the band.
- **Targets** are at least 44 × 44pt, with hit slop around small visuals (dots, the sound toggle).
- **One transition style:** every push slides in from the right, on both platforms (set explicitly so Android matches iOS). Sheets rise from the bottom. Tabs switch without animation.
- **Controls:**
  - Buttons: primary is lavender, secondary white. Default is 44pt tall with 14pt text; large is 56pt with 16pt text. Primary actions run full width at the bottom of a screen.
  - Inputs: white, 48pt tall, with a taupe placeholder. A focused field gains the small hard shadow; an invalid one gets a `danger` border.

## 5. Drawing it

- **Shadows, static surfaces:** React Native's `boxShadow` (New Architecture only, which Expo SDK 58 is) with offset 4/4, blur 0, ink. Its outset shadows need **Android 9+**. M03 checked the direction: 4/4 lands down and to the right on both platforms. It's `SHADOW_HARD` and `SHADOW_HARD_SM` in `src/styles/shadow.ts`.
- **Shadows, pressables:** two layers. A fixed ink plate sits under the face, and the face moves onto it. The press is then a pure transform that Reanimated runs on the UI thread, and it works on every Android version.
- **Fallback:** below Android 9, static surfaces use the plate too (`ShadowBox`). Android 7 and 8 stay supported (user, 2026-11-21).
- **Archivo** ships as **static files in `assets/fonts/`**, one per width and weight, because React Native can't vary a font's width:
  - `ArchivoSemiExpanded-ExtraBold.ttf`: titles, sections, card titles, stickers, the room code (`font-display`);
  - `ArchivoExpanded-Black.ttf`: numbers and the wordmark (`font-display-black`);
  - `Archivo-Bold.ttf`: long titles (`font-display-bold`).
  - The Expanded ExtraBold file was dropped in M03: nothing uses it at phone sizes.
- **Embedding:** the files are embedded at build time with the `expo-font` config plugin, so there's no flash and no loading gate. Each file is named after its **PostScript name**, so one family name works on both platforms: Android names a family after the file, iOS after the font itself. A family is one face; never set `fontWeight` on it. The licences ship beside them (`OFL-Archivo.txt`, `OFL-Inter.txt`).
- **Inter** comes from its Expo Google Fonts package, weights 400, 500 and 600 only, as `Inter-Regular`, `Inter-Medium` and `Inter-SemiBold` (`font-body`, `font-body-medium`, `font-body-semibold`). The name `sans` is taken: NativeWind's preset claims it for the system font, and a test guards against reusing any name it claims.
- **Slashed zero:** not available. Archivo has the `zero` feature but no stylistic set React Native's `fontVariant` can reach, so the clock and the score use plain zeros (user, 2026-11-21). `tabular-nums` does work, through `fontVariant` (`TABULAR_NUMS` in `src/styles/classes.ts`).
- **Pitch and clock** are drawn with `react-native-svg`, as Lucide already needs it.

## 6. Screens

Phone frame: 390 × 844 (status bar 47, home indicator 34). Every sketch is portrait. **On 375 × 667** (iPhone SE: status bar 20, no home indicator, 177pt less height), each screen keeps its order and loses the extras listed under it.

```text
WELCOME (first launch, no tabs)      SIGN IN (pushed, no tabs)
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Lineup                       │     │ ‹                            │
│ Know the XI.                 │     │ Sign in                      │
│ ⟋GUESS THE SQUAD.⟋ butter    │     │ [ Sign in | Create account ] │
│──────────────────────────────│     │▒▒ mint band, full bleed ▒▒▒▒▒│
│  11    │  15s   │   3        │     │▒ Email                      ▒│
│ named  │ a turn │ lives      │     │▒ [________________________] ▒│
│──────────────────────────────│     │▒ Password                   ▒│
│ ┌ demo loop: board frame ──┐ │     │▒ [________________________] ▒│
│ │ pitch fills, input types │ │     │▒ [        Sign in        ]  ▒│
│ └──────────────────────────┘ │     │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│ [   Continue as guest    ]   │     │ [   Continue as guest    ]   │
│ [        Sign in         ]   │     │                              │
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Welcome:** the guest button is primary and Sign in secondary, both pinned at the bottom. 375: the rules row drops its labels, and the demo frame shortens to the pitch alone.
- **Sign in:** the mint band is a full-width colour band, not a box; the guest upgrade reuses Create account. 375: the band scrolls under the keyboard, and the submit button stays in view.

```text
PLAY · step 1 (tab)                  PLAY · step 3
┌──────────────────────────────┐     ┌──────────────────────────────┐
│                              │     │ ‹                            │
│ (1 Mode)──(2 Filters)──(3)   │     │ (✓ Solo)─(✓ UCL, any)─(3)    │
│──────────────────────────────│     │──────────────────────────────│
│ ┌▣ Solo ──────────────────┐  │     │ MODE  Solo        [Edit]     │
│ │ Name the XI alone       │  │     │──────────────────────────────│
│ └─────────────────────────┘  │     │ COMPETITION  UCL  [Edit]     │
│ ┌▣ Duel ─── picked: lavender┐│     │ CLUB  Any · ERA  Any         │
│ └─────────────────────────┘  │     │──────────────────────────────│
│ ┌▣ Practice ─────── ⟋PRO⟋ ┐  │     │ 3 of 5 solo runs left today  │
│ └─────────────────────────┘  │     │                              │
│ Have a room code? [______]   │     │ [         Start          ]   │
│ [          Next          ]   │     │ [      Create room       ]   │
├──────────────────────────────┤     ├──────────────────────────────┤
│ ◉Play    ▦ Archive  ☺ Profile│     │ ◉Play    ▦ Archive  ☺ Profile│
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Steps:** the indicator is three numbered pills; filled pills show a check and their choice. Back is a secondary button beside Next, or the header chevron. **Step 2** is ruled rows (Competition, Club, Era), each a select row with a count badge that opens a sheet. The join row appears only with Duel picked.
- 375: mode tiles lose their one-line descriptions; Start and Create room sit side by side.

```text
GAME · your turn, keyboard up        DUEL · their turn, keyboard down
┌──────────────────────────────┐     ┌──────────────────────────────┐
│▓ BAR 2–1 MIL · UCL 2006  ✕ ♪▓│     │▓ ⛨ BAR   2 – 1   MIL ⛨   ✕ ♪▓│
│░░░░░░░░░░ 4 / 11 ░░░░░░░░░░░░│     │▓    UCL Final · 2006        ▓│
│░░      ●     ○     ●       ░░│     │░░░░░░░░░░ 5 / 11 ░░░░░░░░░░░░│
│░░   ○     ●     ○     ○    ░░│     │░░    ●      ○      ●       ░░│
│░░      ○     ●     ○       ░░│     │░░ ○     ●      ○      ●    ░░│
│░░            ●             ░░│     │░░    ○      ●      ○       ░░│
│ ┌ Messi  ·  Xavi  ·  Puyol ┐ │     │░░            ●             ░░│
│ ├──────────────────────────┤ │     │──────────────────────────────│
│ (◜12◝)  ♥ ♥ ♡   ⟋YOUR TURN⟋  │     │  ◜ 9 ◝    │ LIVES  ♥ ♥ ♡     │
│ [ Type a player…       ➜ ]   │     │  orange   │ ⟋THEIR TURN⟋     │
╞════════ keyboard ════════════╡     │ Waiting for Ana…             │
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Your turn:** the clock is about 48pt beside the lives. Up to 3 suggestion rows, then the list scrolls. Found discs take the finder's colour; empty slots show their position.
- **Their turn:** the clock is full size (about 144pt), and the full board shows, with the scoreboard as on web (crest over name, score between, context under).
- **Solo:** the same board with no turn stickers; the band always shows. Quit (✕) sits at the scoreboard's left end and sound (♪) at its right, so the score stays centred (user, 2026-11-22).
- **Both, 375:** the scoreboard is always the one-line strip, suggestions drop to 2 rows, and discs go from about 44pt to 36pt.

```text
SUMMARY (the board stays)            LOBBY · room waiting
┌──────────────────────────────┐     ┌──────────────────────────────┐
│▓ ⛨ BAR   2 – 1   MIL ⛨      ▓│     │ ✕ Leave                      │
│░ pitch: found + missed  ░░░░░│     │ Your room                    │
│░ (about 40% of the height) ░░│     │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│──────────────────────────────│     │  [K][7][Q][M][2][X]          │
│ Run ended                    │     │  [ Copy code ] [  Share  ]   │
│  7       2        82%        │     │ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│ named   lives    accuracy    │     │ Closes in 9:41               │
│──────────────────────────────│     │──────────────────────────────│
│ NAMED IN ORDER   table  ↓    │     │ FILTERS  UCL · Any · Any     │
│──────────────────────────────│     │──────────────────────────────│
│ [Play again] [Change filters]│     │  (You)      VS     ( … )     │
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Summary:** it scrolls under a pinned action row. The duel result uses the same frame, with the win, loss or draw title in the colours `theme.md` gives. The Pro missed-reveal button sits in its own ruled section.
- **Lobby:** the code card is dashed, as in `duel/04-room-code-b`; Share opens the system share sheet. **Searching** is the same column with no code card: an ambient "Looking for an opponent…", your handle, then Cancel. The coin flip names whose filters won in a sticker.
- **375:** Summary's pitch drops to about 30%; the lobby's VS row shrinks to the handles alone.

```text
PROFILE (tab)                        ARCHIVE (tab)
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ (A) ana_k                    │     │ 2,341 matches                │
│ ┌ lavender hero ──────────┐  │     │ [ ⌕ Search a club or match ] │
│ │  12      3       7      │  │     │ (Competition ▾) (Era ▾) (…)  │
│ │  won    drew    lost    │  │     │ ┌──────────────────────────┐ │
│ └─────────────────────────┘  │     │ │ Barça ⛨  2 – 1  ⛨ Milan  │ │
│──────────────────────────────│     │ │ UCL Final · 2006         │ │
│ 71%      │ 6     │ 4         │     │ │ [ Play ] [ Practise ]    │ │
│ accuracy │ streak│ clears    │     │ ├──────────────────────────┤ │
│──────────────────────────────│     │ │ …                        │ │
│ HISTORY   ruled list, pages ↓│     │ └──────────────────────────┘ │
├──────────────────────────────┤     ├──────────────────────────────┤
│ ▶ Play   ▦ Archive  ◉Profile │     │ ▶ Play   ◉Archive   ☺ Profile│
└──────────────────────────────┘     └──────────────────────────────┘
```

- **Profile:** the guest strip (Create account) sits above the hero for guests. Sign out is a secondary button at the end of the column. 375: the stat row wraps to two lines.
- **Archive:** filter chips open sheets. For Free with the split on, the rows show locked actions with See Pro, as `theme.md` § Pro lock says. 375: each row's actions move to one Play button with a "more" sheet.
- **Pro** (pushed from any lock or Profile, no tabs): the header chevron, a tilted PRO sticker (no title) over the one-line pitch, then the Free vs Pro plan as a ruled table (Feature · Free · Pro), then one primary button pinned at the bottom. 375: the table's first column wraps to two lines.

## Open questions (the user decides)

1. ~~Keyboard on the opponent's turn.~~ Settled in M10a: dismiss it, so the full board shows their reveals, and raise it on your turn. The raise measured about 0.2s on the Android emulator and 0.6s on the iOS Simulator (user, 2026-11-22).
2. ~~Android below 9.~~ Settled in M04a: supported, with the plate fallback (user, 2026-11-21).
3. ~~Plain zeros, if the slashed zero can't be switched on.~~ Settled in M03: plain zeros (user, 2026-11-21).
