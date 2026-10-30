"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  education,
  experiences,
  experienceSection,
  type TimelineItem,
} from "@/data/experience";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tab = keyof typeof experienceSection.tabs;

// Cards visible at once; the rest are reached by scrolling the list.
const VISIBLE = 3;
const GAP = 16; // gap-4

const TAB_ITEMS: Record<Tab, TimelineItem[]> = {
  experience: experiences,
  education,
};

function StatusBadge({ status }: { status: TimelineItem["status"] }) {
  const current = status === "current";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        current ? "border-white/20 text-white" : "border-white/10 text-white/50"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${current ? "bg-emerald-400" : "bg-white/40"}`}
      />
      {experienceSection.statusLabels[status]}
    </span>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>("experience");
  const content = experienceSection.tabs[tab];
  const items = TAB_ITEMS[tab];
  // The switch only appears once there is education to show.
  const tabs = (Object.keys(experienceSection.tabs) as Tab[]).filter(
    (t) => TAB_ITEMS[t].length > 0,
  );

  const scroller = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();
  const [atEnd, setAtEnd] = useState(false);

  // Size the list to exactly VISIBLE cards, so the section keeps a normal height however many roles exist.
  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const measure = () => {
      const cards = node.querySelectorAll<HTMLElement>("[data-exp-item]");
      setMaxHeight(
        cards.length > VISIBLE ? cards[VISIBLE].offsetTop - GAP : undefined,
      );
      setAtEnd(node.scrollTop + node.clientHeight >= node.scrollHeight - 4);
    };
    node.scrollTop = 0;
    measure();
    const observer = new ResizeObserver(measure);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    return () => observer.disconnect();
  }, [tab]);

  const scrollable = items.length > VISIBLE;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 80%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from("[data-exp-label]", {
          opacity: 0,
          y: 12,
          duration: 0.6,
          scrollTrigger: once("[data-exp-heading]", "top 90%"),
        });
        gsap.from("[data-exp-char]", {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: once("[data-exp-heading]", "top 90%"),
        });
        gsap.from("[data-exp-subtitle], [data-exp-tabs]", {
          opacity: 0,
          y: 14,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: once("[data-exp-heading]", "top 90%"),
        });
        gsap.from("[data-exp-line]", {
          scaleY: 0,
          transformOrigin: "top",
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: once("[data-exp-timeline]", "top 80%"),
        });
        gsap.from("[data-exp-item]", {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: once("[data-exp-timeline]", "top 80%"),
        });
        gsap.from("[data-exp-hero]", {
          opacity: 0,
          yPercent: 12,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: once("[data-exp-timeline]", "top 85%"),
        });
        gsap.from("[data-exp-tagline]", {
          opacity: 0,
          scale: 0.8,
          rotate: -24,
          duration: 0.9,
          delay: 0.6,
          ease: "back.out(1.6)",
          scrollTrigger: once("[data-exp-timeline]", "top 85%"),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="experience"
      ref={root}
      className="relative isolate overflow-hidden border-t border-white/10 bg-black py-12 text-white md:min-h-[clamp(760px,56vw,880px)] md:py-14"
    >
      {/* Background art, glow sits behind the character */}
      <Image
        src={experienceSection.background}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[78%_bottom]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
      />

      <Container>
        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col items-start gap-4">
            <div
              key={`label-${tab}`}
              className="animate-[fade-up_0.5s_ease-out_both]"
            >
              <SectionLabel data-exp-label label={content.label} />
            </div>
            {tabs.length > 1 && (
              <div
                data-exp-tabs
                role="group"
                aria-label="Career or education"
                className="flex gap-3"
              >
                {tabs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tab === t}
                    onClick={() => setTab(t)}
                    className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      tab === t
                        ? "border-brand-orange bg-brand-orange text-white"
                        : "border-white/25 text-white/70 hover:border-white/60 hover:text-white"
                    }`}
                  >
                    {experienceSection.tabLabels[t]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            key={`head-${tab}`}
            className="animate-[fade-up_0.5s_ease-out_both]"
          >
            <h2
              data-exp-heading
              aria-label={`${content.heading.first}${content.heading.accent}`}
              className="mt-4 font-display text-[9vw] font-extrabold uppercase leading-none md:whitespace-nowrap md:text-[clamp(30px,3.3vw,56px)]"
            >
              <span aria-hidden className="max-md:block">
                {content.heading.first.split("").map((c, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden whitespace-pre align-bottom"
                  >
                    <span data-exp-char className="inline-block">
                      {c}
                    </span>
                  </span>
                ))}
              </span>
              <span aria-hidden className="text-brand-orange">
                {content.heading.accent.split("").map((c, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <span data-exp-char className="inline-block">
                      {c}
                    </span>
                  </span>
                ))}
              </span>
            </h2>
            <p
              data-exp-subtitle
              className="mt-3 text-[clamp(14px,1.2vw,18px)] text-white/70"
            >
              {content.subtitle}
            </p>
          </div>

          <div data-exp-timeline className="mt-6">
            {/* Scrollable window showing VISIBLE cards; the fade at the bottom hints at more */}
            <div
              ref={scroller}
              tabIndex={scrollable ? 0 : undefined}
              aria-label={scrollable ? "Timeline, scroll for more" : undefined}
              onScroll={(e) => {
                const node = e.currentTarget;
                setAtEnd(
                  node.scrollTop + node.clientHeight >= node.scrollHeight - 4,
                );
              }}
              style={{ maxHeight }}
              className={`-ml-4 overflow-y-auto pl-4 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                scrollable && !atEnd
                  ? "[mask-image:linear-gradient(to_bottom,#000_93%,transparent)]"
                  : ""
              }`}
            >
              <div className="relative">
                <span
                  aria-hidden
                  data-exp-line
                  className="absolute bottom-6 left-[7px] top-6 w-px bg-gradient-to-b from-brand-orange via-brand-orange/40 to-brand-orange/5"
                />
                <ol
                  key={tab}
                  className="flex animate-[fade-up_0.5s_ease-out_both] flex-col gap-4"
                >
                  {items.map((item) => (
                    <li
                      key={item.id}
                      data-exp-item
                      className="relative pl-9 md:pl-12"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-6 h-4 w-4 rounded-full border-2 border-brand-orange bg-brand-orange shadow-[0_0_0_4px_rgba(251,117,47,0.22),0_0_18px_rgba(251,117,47,0.6)]"
                      />
                      <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-brand-orange/50 md:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold uppercase tracking-wide text-brand-orange">
                            {item.period}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                        <h3 className="mt-1.5 text-[clamp(18px,1.5vw,22px)] font-bold leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[clamp(12px,0.95vw,14px)] text-white/60">
                          {item.organization}
                        </p>
                        <p className="mt-1.5 text-[clamp(12px,0.95vw,14px)] leading-relaxed text-white/75">
                          {item.description}
                        </p>
                        {item.tags.length > 0 && (
                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <li
                                key={tag}
                                className="rounded-full border border-brand-orange/60 px-3 py-0.5 text-[11px] text-white/90"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {scrollable && (
              <p
                aria-hidden
                className={`mt-2 pl-9 text-xs text-white/50 transition-opacity duration-300 md:pl-12 ${
                  atEnd ? "opacity-0" : "opacity-100"
                }`}
              >
                ↓ Scroll for more
              </p>
            )}
          </div>
        </div>
      </Container>

      {/* Character + handwritten tagline (desktop). The tagline is anchored to the character. */}
      <div className="pointer-events-none absolute bottom-0 right-[14%] z-10 hidden aspect-[542/1412] w-[clamp(200px,18vw,290px)] md:block">
        <div data-exp-hero className="relative h-full w-full">
          <Image
            src={experienceSection.character.src}
            alt={experienceSection.character.alt}
            fill
            sizes="(min-width: 768px) 24vw, 0px"
            className="object-contain object-bottom drop-shadow-[0_0_40px_rgba(251,117,47,0.35)]"
          />
        </div>
        <div
          data-exp-tagline
          aria-hidden
          className="absolute left-[74%] top-[-1%] -rotate-[14deg] whitespace-nowrap font-script text-[clamp(22px,2.4vw,38px)] font-bold leading-[0.95] text-brand-orange"
        >
          <p>{experienceSection.tagline[0]}</p>
          <p className="pl-2">{experienceSection.tagline[1]}</p>
          <svg
            viewBox="0 0 140 40"
            fill="none"
            className="mt-1 h-auto w-[8em]"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 30C40 8 90 6 136 18" />
          </svg>
        </div>
      </div>
    </section>
  );
}
