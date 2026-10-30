"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  projectCategories,
  projects,
  projectsSection,
  type ProjectCategory,
} from "@/data/project";
import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Filter = "all" | ProjectCategory;

// Cards dissolve before the left edge (next to the character) and softly at the right edge.
const ROW_FADE =
  "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,#000_16%,#000_90%,transparent)]";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  // A card flipped by touch stops its row so it does not slide away under the finger.
  const [paused, setPaused] = useState<[boolean, boolean]>([false, false]);

  const rows = useMemo(() => {
    const visible = projects.filter(
      (p) => filter === "all" || p.category === filter,
    );
    // Everything: alternate cards between the two rows. A filtered set is small, so show it
    // in both rows (second row reversed) instead of repeating one card next to itself.
    if (visible.length > 4) {
      return [
        visible.filter((_, i) => i % 2 === 0), // row 1: left -> right
        visible.filter((_, i) => i % 2 === 1), // row 2: right -> left
      ];
    }
    return [visible, [...visible].reverse()];
  }, [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 80%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from("[data-project-label]", {
          opacity: 0,
          scale: 0.7,
          rotate: -8,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: once("[data-project-label]", "top 85%"),
        });
        gsap.from("[data-project-subtitle]", {
          opacity: 0,
          y: 16,
          duration: 0.7,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: once("[data-project-heading]", "top 85%"),
        });
        gsap.from("[data-project-char]", {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: once("[data-project-heading]", "top 85%"),
        });
        gsap.from("[data-project-pill]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: once("[data-project-filters]", "top 90%"),
        });
        gsap.from("[data-project-hero]", {
          xPercent: -30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: once("[data-project-stage]", "top 80%"),
        });
        gsap.from("[data-project-rows]", {
          xPercent: 12,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: once("[data-project-stage]", "top 80%"),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const heading = projectsSection.heading;

  return (
    <section
      id="projects"
      ref={root}
      className="relative overflow-hidden border-t border-white/10 bg-[#050505] py-16 text-white md:py-24"
    >
      <Container className="items-end">
        <div className="col-span-12 md:col-span-8">
          <SectionLabel data-project-label label={projectsSection.label} />
          <h2
            data-project-heading
            aria-label={`${heading.first}${heading.accent}`}
            className="mt-4 whitespace-nowrap font-display text-[10.5vw] font-extrabold leading-none md:text-[clamp(48px,6.4vw,104px)]"
          >
            <span aria-hidden className="text-brand-orange">
              {heading.first.split("").map((c, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                >
                  <span data-project-char className="inline-block">
                    {c}
                  </span>
                </span>
              ))}
            </span>
            <span aria-hidden>
              {heading.accent.split("").map((c, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                >
                  <span data-project-char className="inline-block">
                    {c}
                  </span>
                </span>
              ))}
            </span>
          </h2>
          <p
            data-project-subtitle
            className="mt-4 max-w-xl text-[clamp(14px,1.3vw,20px)] font-medium text-white/70"
          >
            {projectsSection.subtitle}
          </p>
        </div>
      </Container>

      <Container data-project-stage className="mt-8 items-end md:mt-10">
        {/* Character (desktop: left of the cards) */}
        <div
          data-project-hero
          className="pointer-events-none relative z-10 hidden self-end md:col-span-4 md:block"
        >
          <Image
            src={projectsSection.character.src}
            alt={projectsSection.character.alt}
            width={780}
            height={1392}
            sizes="(min-width: 768px) 24vw, 60vw"
            className="mx-auto h-auto w-[min(100%,340px)]"
          />
        </div>

        <div className="col-span-12 min-w-0 md:col-span-8 md:-mr-10 xl:-mr-20">
          <div
            data-project-filters
            role="group"
            aria-label="Filter projects"
            className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {projectCategories.map((category) => {
              const active = filter === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  data-project-pill
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(category.value);
                    setPaused([false, false]);
                  }}
                  className={`shrink-0 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-white/25 text-white/70 hover:border-white/60 hover:text-white"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div
            data-project-rows
            className="-mx-5 mt-6 flex flex-col gap-3 md:mx-0 md:mt-8"
          >
            {rows.map((items, r) =>
              items.length === 0 ? null : (
                <Marquee
                  key={`${filter}-${r}`}
                  direction={r === 0 ? "right" : "left"}
                  speed={r === 0 ? 40 : 46}
                  copies={Math.max(1, Math.ceil(6 / items.length))}
                  pauseOnHover
                  paused={paused[r]}
                  className={`animate-[fade-up_0.5s_ease-out_both] py-2 ${ROW_FADE}`}
                >
                  {(clone) =>
                    items.map((project) => (
                      <ProjectCard
                        key={project.id}
                        {...project}
                        clone={clone}
                        onFlipChange={(flipped) =>
                          setPaused((prev) => {
                            const next: [boolean, boolean] = [prev[0], prev[1]];
                            next[r] = flipped;
                            return next;
                          })
                        }
                      />
                    ))
                  }
                </Marquee>
              ),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
