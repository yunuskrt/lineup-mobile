# Lineup — Mobile

Know the XI. Guess the Squad.

## Architecture

Three separate repositories, one backend:

| Repo             | Stack             | Role                                                   | Deploys to        |
| ---------------- | ----------------- | ------------------------------------------------------ | ----------------- |
| `lineup-backend` | NestJS            | REST, auth, Socket.IO, Prisma, rules engine, ingestion | Railway / Fly.io  |
| `lineup-web`     | Next.js           | Browser client — renders and transmits input           | Vercel            |
| `lineup-mobile`  | Expo React Native | iOS + Android client — renders and transmits input     | EAS → both stores |

Both clients talk to the same backend, so a browser player and a mobile player share one matchmaking pool.

**This repo** is the iOS and Android client. It speaks the same two protocols as the web: REST for auth, catalog, solo and profile, and Socket.IO for duels. The backend can't tell the two clients apart.

**No code is shared between repos.** No package, no submodule, no cross-repo import, and this repo must build with the other two deleted. Pure TypeScript the web already has (schemas, types, helpers, their tests) is **copied in** and owned here from then on; every copy is listed in `context/web-carryover.md`. Components are never copied: they are rebuilt natively, with the web as the reference.

**Read-only references.** `../lineup-web` and `../lineup-backend` are readable from this session (`.claude/settings.json`). Read them to mirror behaviour, states, copy and the contract. Never edit them, never import from them. When the web and the backend disagree, the backend's `src/contract/` is right.

Build order: web → backend → **mobile**. Both other repos are far ahead; the backend is done for gameplay.

## Context Files

- @context/project-overview.md
- @context/coding-standards.md
- @context/coding-standards-mobile.md
- @context/ai-interaction.md
- @context/current-feature.md
- @context/monetization.md
- @context/theme.md
- @context/design-mobile.md

`project-overview.md` is the shared spec and must stay identical in all repos. When it changes, it changes everywhere.

@context/todo.md is for developer-side use. **Do not modify the project context based on this file.**

## Commands

Set up in M01:

- **Dev server** (Metro, for the dev build): `npx expo start`
- **iOS dev build**: `npx expo run:ios`
- **Android dev build**: `npx expo run:android`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`
- **Test**: `npm test`
- **Build check** (bundles both platforms): `npm run build`

The backend runs at http://localhost:8080 and the web at http://localhost:3000. The iOS Simulator reaches the Mac as `localhost`, the Android emulator as `10.0.2.2`, and a real phone through the Mac's network address.

**IMPORTANT:**

- **Do not add 'co-authored by Claude'** to any commit message
- History entries in `current-feature.md` must not exceed 75 characters
- Do not edit `todo.md` unless told to via prompt or skill
- When running `/feature complete`, ask once whether to tick the phase in `todo.md` in the same commit (default yes)
- No game logic in this client — the backend is authoritative, always. No mock adapter, no copy of the rules
- The squad is never requested, stored or logged; only revealed players arrive
- Manual steps are mine: `.env.local` edits, starting or restarting the backend, Metro or a simulator, rebuilding the dev build, and store or account set-up. Stop, say exactly what to do, and wait, unless I tell you to do it yourself
- After a `/code-review`, repeats, design points and out-of-scope findings become follow-up notes in the spec; don't suggest running the review again
- **Questions to me are bilingual.** Whenever you ask me something, with `AskUserQuestion` or on your own initiative, write each question and each option in English and then in Turkish (e.g. "Recommended bundle id / Önerilen paket kimliği")
