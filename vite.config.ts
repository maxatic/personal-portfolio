// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

const compat = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // Map the handful of next/* imports kept in the ported portfolio code
        // to local shims (see src/compat). `next` itself is not installed.
        "next/image": compat("./src/compat/next-image.tsx"),
        "next/link": compat("./src/compat/next-link.tsx"),
        "next/navigation": compat("./src/compat/next-navigation.tsx"),
      },
    },
  },
});
