# Context

These are the context files referenced by the `CLAUDE.md` file. The nine files listed first are loaded into the AI's memory on startup, along with `AGENTS.md` from the repo root. Everything else is fed to the AI on demand via commands like `/feature` and `/todo`.

Loaded on startup:

- `project-overview.md` - Full project spec including features, data models, tech stack and UI/UX; identical in every repo
- `coding-standards.md` - Code conventions, patterns and rules for the AI to follow, shared by all four repos
- `coding-standards-mobile.md` - The Expo and React Native rules, read alongside `coding-standards.md`
- `ai-interaction.md` - Workflow and communication guidelines for working with the AI
- `current-feature.md` - Living document tracking the feature currently being worked on, plus the history of completed ones
- `monetization.md` - Monetization, pro/free features, subscription details, revenue options
- `theme.md` - The sound spec, plus a behaviour reference for every screen state; it sets no colour, type, layout or motion
- `design-mobile.md` - The look: how the web's Matchday Sticker style becomes a native app, with tokens, native patterns and a sketch of every screen
- `todo.md` - Ordered roadmap of build phases, the copy lists and the web files each phase mirrors, used with the `/todo` command

Read on demand:

- `web-carryover.md` - Every file copied in from the web, created in M02 and updated with each copy list
- `docs/` - Reference documentation for the engines and designs the phases were built against, and manual-testing guides
- `features/` - Feature spec files used with the `/feature` command. A spec names the web files it mirrors; other references (context docs, existing source) are optional and decided per spec when it is written
- `fixes/` - Fix spec files used with `/feature load`, shaped like `features/`. They reshape or correct screens already built, outside the `todo.md` phases
- `research/` - Research files used with the `/research` command to generate documentation; created the first time `/research` runs

Outside this repo, `../lineup-web` and `../lineup-backend` are readable references for behaviour, copy, states and the contract. They are never edited, and nothing is imported from them.

Outside this folder, `AGENTS.md` in the repo root points the AI at the versioned Expo docs, so it avoids APIs that changed between SDK releases.
