"use client";
import { useEffect, useState } from "react";

// Preloads `src` and only renders the <img> once it loads successfully. While
// the file is missing (e.g. before the client supplies a photo) NOTHING renders,
// so the decorative placeholder behind it shows cleanly — no broken-image icon.
export default function FallbackImage({
  src,
  alt,
  className = "",
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.onload = () => active && setOk(true);
    img.onerror = () => active && setOk(false);
    img.src = src;
    return () => { active = false; };
  }, [src]);

  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} style={style} />
  );
}
