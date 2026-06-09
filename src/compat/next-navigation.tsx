import {
  useNavigate,
  useLocation,
  useRouter as useTanstackRouter,
} from "@tanstack/react-router";

// Drop-in replacement for the `next/navigation` hooks used by the portfolio.
// Backed by TanStack Router so existing `useRouter()` / `useSearchParams()`
// call-sites keep working.

function splitUrl(url: string): { to: string; search?: Record<string, string> } {
  const [to, qs] = url.split("?");
  if (!qs) return { to };
  const search: Record<string, string> = {};
  new URLSearchParams(qs).forEach((value, key) => {
    search[key] = value;
  });
  return { to, search };
}

export function useRouter() {
  const navigate = useNavigate();
  const tanstackRouter = useTanstackRouter();

  return {
    push: (url: string) => {
      const { to, search } = splitUrl(url);
      // Loosely typed on purpose: portfolio passes raw string URLs.
      void navigate({ to, search } as never);
    },
    replace: (url: string) => {
      const { to, search } = splitUrl(url);
      void navigate({ to, search, replace: true } as never);
    },
    back: () => tanstackRouter.history.back(),
    forward: () => tanstackRouter.history.forward(),
    refresh: () => tanstackRouter.invalidate(),
    prefetch: () => {},
  };
}

export function useSearchParams() {
  const location = useLocation();
  const searchStr =
    (location as unknown as { searchStr?: string }).searchStr ??
    (typeof window !== "undefined" ? window.location.search : "");
  return new URLSearchParams(searchStr);
}

export function usePathname() {
  return useLocation().pathname;
}
