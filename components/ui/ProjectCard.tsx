"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projectCategories, type Project } from "@/data/project";

type ProjectCardProps = Project & {
  /** Marquee copies other than the first: not focusable, hidden from screen readers. */
  clone?: boolean;
  /** Told when this card flips so the marquee row can stop moving (touch devices). */
  onFlipChange?: (flipped: boolean) => void;
};

/**
 * Image on the front, details on the back. A mouse flips it on hover, a finger on tap
 * (tap outside to flip back), the keyboard on focus.
 */
export default function ProjectCard({
  title,
  client,
  category,
  summary,
  stack,
  links,
  image,
  clone = false,
  onFlipChange,
}: ProjectCardProps) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pointerType = useRef("mouse");
  const categoryLabel =
    projectCategories.find((c) => c.value === category)?.label ?? category;

  const flip = (next: boolean) => {
    setFlipped(next);
    onFlipChange?.(next);
  };

  // Tapping anywhere else flips a touch-opened card back.
  useEffect(() => {
    if (!flipped || pointerType.current === "mouse") return;
    const onOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) flip(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  const linkTab = flipped && !clone ? 0 : -1;

  return (
    <article
      ref={ref}
      aria-hidden={clone || undefined}
      aria-label={clone ? undefined : `${title}, ${client}`}
      tabIndex={clone ? -1 : 0}
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && flip(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && flip(false)}
      onClick={(e) => {
        if (pointerType.current === "mouse") return;
        if ((e.target as HTMLElement).closest("a")) return;
        flip(!flipped);
      }}
      onFocus={() => !clone && flip(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) flip(false);
      }}
      className="mr-5 aspect-[4/3] w-[78vw] max-w-[340px] shrink-0 cursor-pointer outline-none [perspective:1200px] md:aspect-[16/10] md:w-[clamp(300px,28vw,440px)] md:max-w-none"
    >
      <div
        className={`[transform-style:preserve-3d] relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] rounded-xl border border-white/10 bg-[#111]">
          <Image
            src={image}
            alt={clone ? "" : `${title} preview`}
            fill
            sizes="(min-width: 768px) 440px, 78vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <h3 className="text-[clamp(15px,1.3vw,20px)] font-bold leading-tight">
              {title}
            </h3>
            <span className="shrink-0 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex [transform:rotateY(180deg)] [backface-visibility:hidden] flex-col justify-between overflow-hidden rounded-xl border border-brand-orange/50 bg-[#141414] p-4 md:p-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-orange">
                {categoryLabel}
              </span>
              <span className="truncate text-[11px] text-white/50">
                {client}
              </span>
            </div>
            <h3 className="mt-2 text-[clamp(17px,1.5vw,24px)] font-bold leading-tight">
              {title}
            </h3>
            <p className="mt-2 line-clamp-3 text-[clamp(12px,0.95vw,14px)] leading-relaxed text-white/70">
              {summary}
            </p>
          </div>

          <div>
            <ul className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/80"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex min-h-8 flex-wrap gap-2">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={linkTab}
                  className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors ${
                    i === 0
                      ? "bg-brand-orange text-white hover:bg-[#ff8a4a]"
                      : "border border-white/25 text-white hover:border-white/60"
                  }`}
                >
                  {link.label}
                  <span aria-hidden> ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
