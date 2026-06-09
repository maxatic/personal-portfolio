import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
      { title: "Toukoum Portfolio" },
      {
        name: "description",
        content:
          "Interactive portfolio with an AI-powered Memoji that answers questions about me, my skills, and my experience",
      },
      { name: "author", content: "Toukoum" },
      { property: "og:title", content: "Toukoum Portfolio" },
      {
        property: "og:description",
        content:
          "Interactive portfolio with an AI-powered Memoji that answers questions about me",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://toukoum.fr" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Toukoum Portfolio" },
      {
        name: "twitter:description",
        content:
          "Interactive portfolio with an AI-powered Memoji that answers questions about me",
      },
      { name: "twitter:creator", content: "@toukoum" },
      { name: "description", content: "Quick Start HTML creates a new project with a single HTML file for testing." },
      { property: "og:description", content: "Quick Start HTML creates a new project with a single HTML file for testing." },
      { name: "twitter:description", content: "Quick Start HTML creates a new project with a single HTML file for testing." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54645f71-3d03-45d2-8a86-398ba18bab52/id-preview-93f7ae46--5511a36a-e234-4db9-a8cd-916e2bb597ca.lovable.app-1781005673699.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/54645f71-3d03-45d2-8a86-398ba18bab52/id-preview-93f7ae46--5511a36a-e234-4db9-a8cd-916e2bb597ca.lovable.app-1781005673699.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.svg?v=2" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      },
    ],
    scripts: [
      {
        src: "https://datafa.st/js/script.js",
        defer: true,
        "data-website-id": "68e067ba369b1b7f1f096056",
        "data-domain": "toukoum.fr",
        "data-allow-localhost": "true",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
        )}
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <main className="flex min-h-screen flex-col">
        <Outlet />
      </main>
      <Toaster />
      <Analytics />
    </QueryClientProvider>
  );
}
