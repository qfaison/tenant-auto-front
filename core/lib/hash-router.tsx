"use client";

/**
 * Angular-style hash routing for static export (output: 'export').
 * All navigation lives in the URL fragment (e.g. /#/tenant/list) so a single
 * index.html can serve every route with no server-side rewrite rules.
 *
 * Mimics the subset of next/navigation used across the app (useRouter,
 * usePathname, useSearchParams) so callers don't need to change call sites.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_PATH = "/";

function readHash(): string {
  if (typeof window === "undefined") return DEFAULT_PATH;
  const raw = window.location.hash.replace(/^#/, "");
  return raw || DEFAULT_PATH;
}

function splitHash(hash: string): { pathname: string; search: string } {
  const [pathname, search = ""] = hash.split("?");
  return { pathname: pathname || DEFAULT_PATH, search };
}

type NavigateOptions = { scroll?: boolean };

type HashRouterContextValue = {
  hash: string;
  setHash: (hash: string) => void;
};

const HashRouterContext = createContext<HashRouterContextValue | null>(null);

export function HashRouterProvider({ children }: { children: ReactNode }) {
  const [hash, setHash] = useState<string>(readHash);

  useEffect(() => {
    const onHashChange = () => setHash(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const value = useMemo(() => ({ hash, setHash }), [hash]);

  return (
    <HashRouterContext.Provider value={value}>
      {children}
    </HashRouterContext.Provider>
  );
}

function useHashRouterContext(): HashRouterContextValue {
  const ctx = useContext(HashRouterContext);
  if (!ctx) {
    throw new Error("useHashRouterContext must be used within HashRouterProvider");
  }
  return ctx;
}

/** Sets window.location.hash to the given app-relative path (e.g. "/tenant/list?x=1"). */
function navigate(
  to: string,
  options: NavigateOptions & { replace?: boolean } | undefined,
  setHash: (hash: string) => void,
) {
  const target = to.startsWith("/") ? to : `/${to}`;
  if (options?.replace) {
    const url = `${window.location.pathname}${window.location.search}#${target}`;
    window.history.replaceState(null, "", url);
    // history.replaceState doesn't fire "hashchange", and a dispatched
    // synthetic event can race the listener HashRouterProvider registers in
    // its own effect (child effects commit before parent effects in React).
    // Updating context state directly avoids relying on that event at all.
    setHash(target);
  } else {
    window.location.hash = target;
  }
  if (options?.scroll !== false) {
    window.scrollTo(0, 0);
  }
}

export function useRouter() {
  const { setHash } = useHashRouterContext();
  return useMemo(
    () => ({
      push: (to: string, options?: NavigateOptions) => navigate(to, options, setHash),
      replace: (to: string, options?: NavigateOptions) =>
        navigate(to, { ...options, replace: true }, setHash),
    }),
    [setHash],
  );
}

export function usePathname(): string {
  const { hash } = useHashRouterContext();
  return splitHash(hash).pathname;
}

export function useSearchParams(): URLSearchParams {
  const { hash } = useHashRouterContext();
  const { search } = splitHash(hash);
  return useMemo(() => new URLSearchParams(search), [search]);
}
