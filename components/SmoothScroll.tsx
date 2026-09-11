"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

/* Lives inside <ReactLenis> so useLenis() resolves correctly.
   Scrolls to top only on real route changes — NOT on the first mount, so a
   plain refresh keeps you where you were (browser handles that restoration). */
function ScrollResetter() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prevPath = useRef<string | null>(null);

  // Let the browser restore scroll position on reload instead of forcing top.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  }, []);

  useEffect(() => {
    // First time we see a path (initial load / refresh) -> record it, don't
    // scroll, so the browser can restore the previous position.
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    // Only a genuine route change should jump to the top.
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.045,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.6,
        syncTouch: false,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      }}
    >
      <ScrollResetter />
      {children}
    </ReactLenis>
  );
}
