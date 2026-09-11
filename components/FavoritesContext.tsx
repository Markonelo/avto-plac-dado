"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface FavoritesValue {
  ids: string[]; // car ids (see lib/cars.ts)
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
  ready: boolean;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);
const STORAGE_KEY = "apd_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setIds(parsed);
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  // Persist whenever the list changes (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, ready]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key && e.key !== STORAGE_KEY) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) setIds(parsed);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <FavoritesContext.Provider
      value={{ ids, has, toggle, count: ids.length, ready }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    // Safe fallback so components never crash if rendered outside the provider.
    return { ids: [], has: () => false, toggle: () => {}, count: 0, ready: false };
  }
  return ctx;
}
