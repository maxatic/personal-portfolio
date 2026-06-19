# Repository Guidelines

## Project Structure & Module Organization

This is a TanStack Start + Vite React portfolio. Application code lives in `src/`.
Routes are in `src/routes`, reusable UI and page sections are in `src/components`,
server/client helpers are in `src/lib`, and hooks are in `src/hooks`. Static assets
used by the app are stored in `public/`; README-only media lives in `assets/`.
Generated router output is `src/routeTree.gen.ts`; avoid hand-editing it unless the
router tooling requires it.

## Build, Test, and Development Commands

- `npm run dev` starts the local Vite development server.
- `npm run build` creates a production build.
- `npm run build:dev` builds with development mode settings.
- `npm run preview` serves the built app for local verification.
- `npm run lint` runs ESLint over the repository.
- `npm run format` formats files with Prettier.

The README references `pnpm`; the repository also includes `package-lock.json` and
`bun.lock`. Use the package manager already chosen for the branch, and avoid mixing
lockfile updates in unrelated changes.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Prefer the `@/` alias for imports from
`src`, and keep Next.js compatibility imports mapped through `src/compat` rather than
adding a Next.js dependency. Prettier is configured for double quotes, semicolons,
trailing commas, and a 100-character print width. Component files generally use
PascalCase or descriptive kebab/lowercase names matching existing neighbors; hooks
should follow `use-*.tsx` or `useSomething.tsx` patterns.

## Testing Guidelines

There is currently no test script or test framework configured. For every change,
run `npm run lint` and `npm run build` before submitting. When adding tests, colocate
them near the feature or use a clear `*.test.ts` / `*.test.tsx` naming pattern, and
add the test command to `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Fixed chat page header colors`
or `Add new portfolio sections, assets, and UI updates`. Keep commit messages concise
and focused on the user-visible change. Pull requests should include a brief summary,
screenshots or recordings for UI changes, notes about environment variables touched
(`OPENAI_API_KEY`, `GITHUB_TOKEN`), and the verification commands run.

## Security & Configuration Tips

Do not commit `.env` files or API tokens. Use `.env.example` as the public template.
Keep server-only code in `*.server.ts` modules or TanStack Start server functions, and
avoid importing secrets into route or component code that can run in the browser.
