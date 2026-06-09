Replace the entire TanStack Start React project with a single static HTML file.

Steps:
1. Delete all source code, components, and routes under `src/`.
2. Delete auto-generated files: `src/routeTree.gen.ts`, `bun.lock`.
3. Update `package.json` to a minimal set of dependencies (just `vite` and basic scripts).
4. Replace `vite.config.ts` with the simplest Vite config for static HTML serving.
5. Create a root-level `index.html` with the body containing only the word "test".
6. Verify the dev server starts and renders the page correctly.

Result: A blank Vite-powered project with one `index.html` file displaying "test".
