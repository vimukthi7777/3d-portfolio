"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Brush,
  Camera,
  Clapperboard,
  Code,
  Megaphone,
  Palette,
  PenTool,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { hero } from "@/data/hero";
import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";
import MagneticLink from "@/components/ui/MagneticLink";
import { onLoaderDone } from "@/lib/loader";

gsap.registerPlugin(useGSAP);

const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  camera: Camera,
  megaphone: Megaphone,
  brush: Brush,
  clapperboard: Clapperboard,
  code: Code,
  "pen-tool": PenTool,
  webhook: Webhook,
};

type TickerItemProps = { label: string; icon: string };

function TickerItem({ label, icon }: TickerItemProps) {
  const Icon = ICONS[icon];
  return (
    <span className="flex shrink-0 items-center gap-[0.9em] pr-[0.9em]">
      {Icon && <Icon size="1.5em" strokeWidth={1.5} aria-hidden />}
      <span className="whitespace-nowrap">{label}</span>
      <Image
        src="/icons/banner-sep.svg"
        alt=""
        width={13}
        height={13}
        className="ml-[0.4em] h-[0.7em] w-[0.7em] shrink-0"
      />
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Starts paused: the entrance plays once the page loader has left.
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });
        tl.from(
          "[data-hero-line]",
          { yPercent: 110, duration: 1, stagger: 0.15 },
          0.1,
        )
          .from(
            "[data-hero-amp]",
            {
              scale: 0,
              rotate: -40,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(2)",
            },
            0.8,
          )
          .from(
            "[data-hero-banner]",
            { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.15 },
            0.3,
          )
          .from(
            "[data-hero-character]",
            { xPercent: 12, y: 40, opacity: 0, duration: 1.2 },
            0.2,
          )
          .from(
            "[data-hero-sign]",
            { yPercent: 40, rotate: 8, opacity: 0, duration: 1 },
            0.9,
          );
        return onLoaderDone(() => {
          tl.play();
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-brand-orange text-white"
    >
      {/* Space for the fixed navbar */}
      <div aria-hidden className="h-[76px] md:h-20" />

      {/* Heading */}
      <Container className="relative z-10 mt-[8vh]">
        <h1 className="relative col-span-12 font-display font-extrabold uppercase text-white">
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              data-hero-line
              className="block text-[10.5vw] leading-none md:text-[clamp(36px,6.7vw,108px)]"
            >
              {hero.heading.firstLine}
            </span>
          </span>
          <span
            data-hero-amp
            aria-hidden
            className="absolute inset-y-0 right-[1%] hidden items-center font-glitch text-[clamp(110px,20vw,320px)] font-normal leading-none md:flex"
          >
            &amp;
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              data-hero-line
              className="block text-[24vw] leading-[0.9] md:text-[clamp(86px,15.2vw,243px)]"
            >
              {hero.heading.secondLine}
            </span>
          </span>
        </h1>
      </Container>

      {/* Banner 1: yellow, rises to the right (Figma 4deg = CSS -4deg), right to left */}
      <div
        aria-hidden
        className="absolute -left-[10%] top-[70%] z-20 w-[120%] -translate-y-1/2 -rotate-4"
      >
        <div
          data-hero-banner
          className="flex h-[clamp(64px,8.5vw,128px)] items-center bg-banner-yellow font-display text-[clamp(14px,1.9vw,30px)] font-bold text-white"
        >
          <Marquee direction="left" speed={90} copies={2} className="w-full">
            {hero.designTicker.map((t) => (
              <TickerItem key={t.label} label={t.label} icon={t.icon} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Banner 2: white, falls to the right (Figma -2deg = CSS 2deg), left to right */}
      <div
        aria-hidden
        className="absolute -left-[10%] top-[87%] z-20 w-[120%] -translate-y-1/2 rotate-2"
      >
        <div
          data-hero-banner
          className="flex h-[clamp(64px,8.5vw,128px)] items-center bg-white font-display text-[clamp(14px,1.9vw,30px)] font-bold text-black"
        >
          <Marquee direction="right" speed={90} copies={2} className="w-full">
            {hero.developmentTicker.map((t) => (
              <TickerItem key={t.label} label={t.label} icon={t.icon} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Character sits in front of the banners */}
      <div
        data-hero-character
        className="pointer-events-none absolute right-[19%] bottom-0 z-30 aspect-[1358/1804] h-[94%] max-md:left-[-6%] max-md:right-auto max-md:h-[62%]"
      >
        <Image
          src={hero.character.src}
          alt={hero.character.alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 80vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* Hand-held sign: magnetic link to the projects section */}
      <div
        data-hero-sign
        className="absolute bottom-[-2%] right-[3%] z-30 aspect-[1139/1381] h-[30%] md:bottom-[-3%] md:right-[7%] md:h-[56%]"
      >
        <MagneticLink
          href="#projects"
          ariaLabel="Work and Projects"
          className="relative block h-full w-full"
        >
          <Image
            src="/images/hand1.png"
            alt="Hand holding a wooden sign that reads Work and Projects"
            fill
            sizes="25vw"
            className="object-contain object-bottom drop-shadow-xl"
          />
        </MagneticLink>
      </div>
    </section>
  );
}
