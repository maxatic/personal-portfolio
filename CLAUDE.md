# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An AI-chat-first personal portfolio (originally the toukoum.fr template, personalized for Max
Issaliyev). Instead of a scrolling static page, visitors converse with an AI avatar that calls
tools to answer questions about projects, skills, experience, etc. Built on TanStack Start
(React 19 + Vite + Nitro), deployed to Cloudflare Workers.

## Commands

```bash
npm run dev        # vite dev server (http://localhost:3000)
npm run build      # production build
npm run build:dev  # build in development mode
npm run preview    # preview a production build
npm run lint       # eslint .
npm run format     # prettier --write .
```

There is no test suite configured in this repo.

Package manager: the README mentions pnpm, but this repo has both `bun.lock` and
`package-lock.json` checked in — check which lockfile is current before assuming one.

### Required env vars (`.env`, see `.env.example`)
- `OPENAI_API_KEY` — only referenced in README; the actual chat handler reads `LOVABLE_API_KEY` (see below).
- `GITHUB_TOKEN` — used by `src/lib/api/github.functions.ts` for GitHub integration features.

## Architecture

### Vite config is mostly managed for you
`vite.config.ts` wraps `@lovable.dev/vite-tanstack-config`, which already bundles
tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (Cloudflare target), the dev-only
component tagger, `VITE_*` env injection, the `@` path alias, and React/TanStack deduping.
**Do not re-add any of these plugins manually** — duplicates break the app. Only extend via the
`vite`/`tanstackStart` keys passed to `defineConfig`.

### Routing
TanStack Router, file-based under `src/routes/`. `src/routeTree.gen.ts` is **generated** by the
router plugin on dev/build — never hand-edit it. Key routes: `index.tsx` (home/chat shell),
`chat.tsx`, `design.tsx` (design-system showcase, see below), `__root.tsx` (root layout).

### Ported-from-Next.js code
This codebase was ported from a Next.js app; a handful of `next/*` imports remain in legacy
components and are aliased to local shims in `src/compat/` (`next/image`, `next/link`,
`next/navigation`) via the Vite resolve.alias config. `next` itself is not an installed
dependency — don't add real Next.js imports.

### Chat / AI tool-calling pipeline
This is the core feature. Flow: client `useChat` (AI SDK React) → `chatStream` server function
(`src/lib/api/chat.functions.ts`, a `createServerFn` POST handler) → `streamText` from the `ai`
SDK, using a Lovable AI Gateway provider (`src/lib/ai-gateway.server.ts`, OpenAI-compatible) →
`google/gemini-3-flash-preview` model, with `maxSteps: 2` and tool-call streaming.

- **System prompt**: `src/lib/chat/prompt.ts` (`SYSTEM_PROMPT`), prepended to every conversation.
- **Tools**: one file per tool under `src/lib/chat/tools/` (`getProjects`, `getSkills`,
  `getExperience`, `getCertifications`, etc.), each built with `tool({ description, parameters: z.object({...}), execute })`
  from the `ai` SDK + `zod`. To add a new fact the assistant can surface, add a tool file here,
  then import and register it in the `tools` object in `chat.functions.ts`.
- **Rendering tool results**: `src/components/chat/tool-renderer.tsx` maps each tool's returned
  data to a UI card/component (e.g. certifications list, project cards).
- Server-only files use the `.server.ts` suffix (`ai-gateway.server.ts`, `config.server.ts`) so
  Vite excludes them from the client bundle — never import them from client components, and
  always read `process.env` inside a function/handler (not at module scope), since on Cloudflare
  Workers env binds per-request.

### Design system
The UI follows a ChatGPT/OpenAI-style design language (monochrome, hairline borders, soft
radii) — full spec in `DESIGN_SYSTEM.md`, live showcase at the `/design` route
(`src/routes/design.tsx`). All design tokens are CSS variables in `src/styles.css`, exposed to
Tailwind as `bg-*`/`text-*`/`border-*` utilities — **always use the semantic token, never a raw
hex/oklch value**, or dark mode and the alternate theme break.

The site ships **two interchangeable token sets** toggled live via `design-toggle.tsx` and
persisted to `localStorage("ds")`: the default ChatGPT palette, and an `.ds-anthropic`-scoped
warm/editorial palette. Both reuse the exact same components/markup — only the CSS variables
differ — so new components should only ever reference semantic tokens, never hardcode colors.

shadcn/ui is configured via `components.json` (style: `new-york`, base color `zinc`, icon
library `lucide`); generated primitives live in `src/components/ui/`.

### Misc
- `src/components/_saved/` holds components removed from active use but kept for reference —
  not part of the app's render tree.
- `src/lib/error-capture.ts` / `error-page.ts` / `lovable-error-reporting.ts` wire up
  SSR/client error reporting used by the Lovable platform integration.
