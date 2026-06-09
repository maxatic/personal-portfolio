import * as React from "react";
import { Link as RouterLink } from "@tanstack/react-router";

// Drop-in replacement for `next/link`. Internal paths use the TanStack Router
// <Link>; external/hash/mailto links fall back to a plain <a>.
export interface NextLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, NextLinkProps>(function Link(
  {
    href,
    prefetch: _prefetch,
    replace,
    scroll: _scroll,
    shallow: _shallow,
    passHref: _passHref,
    legacyBehavior: _legacyBehavior,
    children,
    ...rest
  },
  ref,
) {
  const isInternal =
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

  if (!isInternal) {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink ref={ref} to={href} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
});

export default Link;
