import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";

// About Us band (reference photo): one big light card — dealership photo frame
// fills the WHOLE left; right column holds About Us heading, body, teal CTA and
// the stat row beneath it.
// TODO(client): drop a real dealership photo/video-still at
// /public/about/dealership.jpg and confirm the real stat numbers below.
const STATS = [
  { value: "180+", label: "Happy customers" },
  { value: "50+", label: "Cars in stock" },
  { value: "200+", label: "Cars sold" },
];

export default function About() {
  return (
    <section className="section-padding bg-bg">
      <div className="container-wide">
        <Reveal className="overflow-hidden rounded-[0.75rem] border border-line bg-cloud p-5 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-10">
            {/* Photo frame */}
            <div className="relative min-h-[22rem] overflow-hidden rounded-[0.5rem] bg-ink sm:min-h-[30rem] lg:min-h-[38rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
                <Building2 size={56} strokeWidth={1} className="opacity-40" />
                <span className="font-body text-[11px] uppercase tracking-[0.18em]">
                  Photo coming soon
                </span>
              </div>
              <FallbackImage
                src="/about/dealership.jpg"
                alt={`${SITE.name} dealership in ${SITE.city}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Copy */}
            <div className="flex flex-col justify-between py-1 lg:py-2">
              <div>
                <h2 className="font-heading text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl">
                  About Us
                </h2>
                <p className="mt-3 font-heading text-lg font-medium text-ink/80">
                  Drive smarter. Buy with confidence.
                </p>
                <p className="mt-6 font-body text-base leading-relaxed text-mute sm:text-lg">
                  <span className="font-semibold text-ink">At {SITE.name}</span>
                  , we keep buying a car simple. Whether it&apos;s your first car
                  or a long-awaited upgrade, we offer a hand-picked selection of
                  quality vehicles at honest, transparent prices — every one
                  thoroughly inspected and ready to drive away.
                </p>
                <p className="mt-4 font-body text-base leading-relaxed text-mute sm:text-lg">
                  No pressure and no surprises: what you see is what you pay. From
                  clean, verified paperwork to friendly local advice right here in{" "}
                  {SITE.city}, our team is with you at every step — and long after
                  you&apos;ve driven off the lot.
                </p>
                <Link
                  href="/about"
                  className="glow-btn mt-7 !rounded-xl !px-8 !py-4 !text-base"
                >
                  Learn more about us <ArrowUpRight size={20} />
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 divide-x divide-line border-t border-line pt-7">
                {STATS.map((s) => (
                  <div key={s.label} className="px-3 first:pl-0">
                    <p className="font-heading text-3xl font-semibold tracking-tight text-ink nums sm:text-[2.5rem] sm:leading-none">
                      {s.value}
                    </p>
                    <p className="mt-1.5 font-body text-xs text-mute sm:text-sm">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
