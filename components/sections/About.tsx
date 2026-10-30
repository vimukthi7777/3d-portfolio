"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { aboutData } from "@/data/about";
import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";
import CountUp from "@/components/ui/CountUp";
import { markRowRevealed, markTechRevealed } from "@/lib/techReveal";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tech = (typeof aboutData.technologies)[number];

// Split as in the design: 9 / 8 / 4 (the short last row is repeated to fill the width).
const ROWS: {
  items: Tech[];
  direction: "left" | "right";
  copies: number;
}[] = [
  {
    items: aboutData.technologies.slice(0, 9),
    direction: "left",
    copies: 2,
  },
  {
    items: aboutData.technologies.slice(9, 17),
    direction: "right",
    copies: 2,
  },
  {
    items: aboutData.technologies.slice(17),
    direction: "left",
    copies: 4,
  },
];

function TechChip({ name, icon }: Tech) {
  return (
    <div
      data-tech-chip
      className="flex w-[clamp(84px,7.6vw,124px)] shrink-0 flex-col items-center gap-2 text-center"
    >
      <div className="flex h-[clamp(26px,2.6vw,40px)] items-center justify-center">
        {icon ? (
          <Image
            src={icon}
            alt=""
            width={52}
            height={52}
            className="h-full w-auto max-w-[clamp(26px,2.6vw,40px)]"
          />
        ) : (
          <span className="text-[clamp(24px,2.4vw,36px)] font-light leading-none">
            ex
          </span>
        )}
      </div>
      <span className="text-[clamp(11px,0.95vw,14px)] font-medium">{name}</span>
    </div>
  );
}

const EDGE_FADE =
  "[mask-image:linear-gradient(to_right,transparent,#000_16%,#000_84%,transparent)]";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-label]", {
          scale: 0.7,
          opacity: 0,
          rotate: -8,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.from("[data-about-word]", {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.025,
          scrollTrigger: {
            trigger: "[data-about-text]",
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-about-stat]", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-about-stats]",
            start: "top 85%",
            once: true,
          },
        });
      });

      mm.add("all", () => {
        // Technologies reveal as you scroll normally (the page is never held), one part at a time:
        // title, then row 1, row 2 and row 3, roughly one wheel notch apart. Runs even when the OS
        // asks for reduced motion (user decision), hence matchMedia "all".
        const block =
          root.current?.querySelector<HTMLElement>("[data-tech-block]");
        if (!block) return;

        const rowChips = (i: number) =>
          gsap.utils.toArray<HTMLElement>(
            `[data-tech-row="${i}"] [data-tech-chip]`,
          );
        const chipFrom = {
          opacity: 0,
          y: 20,
          scale: 0.85,
          duration: 0.4,
          ease: "back.out(1.5)",
          stagger: { amount: 0.45, from: "start" as const },
        };

        // One master timeline: title, row 1, row 2, row 3 strictly in sequence. Scroll triggers only
        // say how far it may play (tweenTo a label), so even a fast fling reveals them one row at a time.
        const tl = gsap.timeline({
          paused: true,
          onComplete: markTechRevealed,
        });
        tl.from("[data-tech-title]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "power3.out",
        })
          .addLabel("title")
          .from(rowChips(0), chipFrom, ">0.05")
          .call(() => markRowRevealed(0))
          .addLabel("row0")
          .from(rowChips(1), chipFrom, ">0.05")
          .call(() => markRowRevealed(1))
          .addLabel("row1")
          .from(rowChips(2), chipFrom, ">0.05")
          .call(() => markRowRevealed(2))
          .addLabel("row2");

        let driver: gsap.core.Tween | undefined;
        const steps = [
          { label: "title", offset: 60 },
          { label: "row0", offset: 160 },
          { label: "row1", offset: 260 },
          { label: "row2", offset: 360 },
        ];

        steps.forEach(({ label, offset }) => {
          ScrollTrigger.create({
            trigger: block,
            start: `top bottom-=${offset}`,
            once: true,
            onEnter: () => {
              // Jumped straight past the block (e.g. nav link): show everything at once.
              if (block.getBoundingClientRect().bottom < 0) {
                driver?.kill();
                tl.progress(1, false);
                [0, 1, 2].forEach(markRowRevealed);
                markTechRevealed();
                return;
              }
              driver?.kill();
              driver = tl.tweenTo(label, { ease: "none" });
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="bg-white text-black">
      {/* Intro */}
      <div className="py-12 md:py-16">
        <Container className="items-start gap-y-10">
          <div className="col-span-12 md:col-span-2">
            <SectionLabel data-about-label label={aboutData.label} />
          </div>

          <p
            data-about-text
            className="col-span-12 text-[clamp(18px,1.9vw,28px)] font-medium leading-[1.4] md:col-span-7"
          >
            {aboutData.description.split(" ").map((word, i) => (
              <span key={i} data-about-word className="inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>

          <dl
            data-about-stats
            className="col-span-12 flex gap-10 md:col-span-3 md:flex-col md:gap-6 xl:col-span-2 xl:col-start-11"
          >
            {aboutData.stats.map((stat) => (
              <div key={stat.label} data-about-stat>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    className="block text-[clamp(28px,2.8vw,44px)] font-medium leading-none"
                  />
                  <span className="mt-1 block text-[clamp(11px,0.9vw,14px)] text-black/60">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      {/* Technologies */}
      <div data-tech-block className="bg-black py-10 text-white md:py-12">
        <Container>
          <h2
            data-tech-title
            className="col-span-12 text-center text-[clamp(14px,1.3vw,20px)] font-medium tracking-wide"
          >
            {aboutData.technologiesTitle}
          </h2>

          <div
            data-tech-rows
            className="col-span-12 mt-6 flex flex-col gap-5 md:mt-8 md:gap-6"
          >
            {ROWS.map((row, i) => (
              <div key={i} data-tech-row={i}>
                <Marquee
                  direction={row.direction}
                  copies={row.copies}
                  speed={50}
                  startOnRow={i}
                  respectReducedMotion={false}
                  startDelay={0.3}
                  className={EDGE_FADE}
                >
                  {row.items.map((tech) => (
                    <TechChip key={tech.name} {...tech} />
                  ))}
                </Marquee>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
