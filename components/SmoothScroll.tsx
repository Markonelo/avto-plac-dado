"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

/* Lives inside <ReactLenis> so useLenis() resolves correctly */
function ScrollResetter() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.06,
        smoothWheel: true,
        wheelMultiplier: 0.9,
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
