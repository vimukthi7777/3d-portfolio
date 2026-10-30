"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { serviceData } from "@/data/service";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import { onTechRevealed } from "@/lib/techReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Service = (typeof serviceData.services)[number];

// On mobile the column wrappers dissolve (`contents`), so cards are re-ordered 01 -> 04.
const MOBILE_ORDER = [
  "max-md:order-1",
  "max-md:order-2",
  "max-md:order-3",
  "max-md:order-4",
];

type ServiceCardProps = Service & {
  index: number;
  active: boolean;
  onActivate: () => void;
};

function ServiceCard({
  number,
  title,
  description,
  icon,
  index,
  active,
  onActivate,
}: ServiceCardProps) {
  const total = serviceData.services.length;
  return (
    <article
      data-service-card
      data-side={index % 2 === 0 ? "left" : "right"}
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={`${MOBILE_ORDER[index]} relative flex min-h-[clamp(250px,22vw,315px)] cursor-pointer flex-col justify-between rounded-lg border p-5 outline-none transition-[border-color,box-shadow] duration-500 md:p-6 ${
        active
          ? "border-white/25 shadow-[0_0_90px_-10px_rgba(251,117,47,0.55)]"
          : "border-white/10 bg-[#1b1b1b] focus-visible:border-brand-orange"
      }`}
    >
      {/* Mobile: the character stands on the top stroke of card 01 and moves with it */}
      {index === 0 && (
        <div className="pointer-events-none absolute bottom-full right-[4%] z-10 w-[min(64vw,300px)] translate-y-[2px] md:hidden">
          <Image
            src={serviceData.character.src}
            alt={serviceData.character.alt}
            width={726}
            height={484}
            sizes="64vw"
            className="h-auto w-full"
          />
        </div>
      )}

      {/* Desktop: the character rides on the top stroke of card 02 and moves with it */}
      {index === 1 && (
        <div className="pointer-events-none absolute bottom-full right-[2%] z-10 hidden w-[clamp(300px,32vw,470px)] translate-y-[2px] md:block">
          <Image
            src={serviceData.character.src}
            alt={serviceData.character.alt}
            width={726}
            height={484}
            sizes="32vw"
            className="h-auto w-full"
          />
        </div>
      )}

      {/* Orange gradient fades in on the active card */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-[#e8331f] to-[#ea7d0b] transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`text-sm font-semibold transition-colors duration-500 ${
            active ? "text-white" : "text-[#e8331f]"
          }`}
        >
          <span className="mr-2 opacity-70">/</span>
          {number}
        </span>
        <span aria-hidden className="flex gap-1.5 pt-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i <= index ? "bg-white" : "bg-white/25"}`}
            />
          ))}
        </span>
      </div>

      <h3 className="relative mt-3 text-[clamp(24px,2.6vw,40px)] font-extrabold uppercase leading-tight tracking-tight text-white">
        {title}
      </h3>

      <div className="relative mt-10 flex items-end justify-between gap-4">
        <p
          className={`max-w-[26rem] text-[clamp(12px,1vw,15px)] leading-relaxed transition-colors duration-500 ${
            active ? "text-white" : "text-white/65"
          }`}
        >
          {description}
        </p>
        {icon && (
          <Image
            src={icon}
            alt=""
            width={200}
            height={167}
            className={`-mb-1 h-auto w-[clamp(84px,9vw,140px)] shrink-0 transition-transform duration-500 ${
              active ? "scale-110 -rotate-3" : ""
            }`}
          />
        )}
      </div>
    </article>
  );
}

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const content = root.current?.querySelector("[data-service-content]");
        if (!content) return;

        const build = () => {
          const once = (trigger: string, start = "top 80%") => ({
            trigger,
            start,
            once: true,
          });

          gsap.from("[data-service-label]", {
            opacity: 0,
            scale: 0.7,
            rotate: -8,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: once("[data-service-label]", "top 85%"),
          });

          gsap.from("[data-service-char]", {
            yPercent: 110,
            opacity: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: once("[data-service-heading]"),
          });

          gsap.from("[data-service-subtitle]", {
            opacity: 0,
            y: 16,
            duration: 0.7,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: once("[data-service-heading]"),
          });

          // Scroll-scrubbed: 01 and 03 fly in from the left, 02 and 04 from the right,
          // left cards start at -14deg, right cards at +14deg, both straightening to 0deg as you scroll.
          gsap.utils
            .toArray<HTMLElement>("[data-service-card]")
            .forEach((card) => {
              const fromLeft = card.dataset.side === "left";
              gsap.fromTo(
                card,
                {
                  xPercent: fromLeft ? -70 : 70,
                  rotation: fromLeft ? -14 : 14,
                  opacity: 0,
                  transformOrigin: "50% 100%",
                },
                {
                  xPercent: 0,
                  rotation: 0,
                  opacity: 1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 98%",
                    end: "top 55%",
                    scrub: 0.8,
                  },
                },
              );
            });
        };

        // Hidden until the technology chips above have fully appeared.
        gsap.set(content, { opacity: 0 });
        return onTechRevealed(() => {
          gsap.to(content, { opacity: 1, duration: 0.5, ease: "power2.out" });
          ctx.add?.(build);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="services"
      ref={root}
      className="overflow-hidden border-t border-white/10 bg-[#050505] py-16 text-white md:py-24"
    >
      <div data-service-content>
        <Container className="items-end">
          <div className="col-span-12 md:col-span-8">
            <SectionLabel data-service-label label={serviceData.label} />
            <h2
              data-service-heading
              aria-label={`${serviceData.heading.first}${serviceData.heading.accent}`}
              className="mt-4 whitespace-nowrap font-display text-[10.5vw] font-extrabold leading-none md:text-[clamp(48px,6.4vw,104px)]"
            >
              <span aria-hidden>
                {serviceData.heading.first.split("").map((c, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <span data-service-char className="inline-block">
                      {c}
                    </span>
                  </span>
                ))}
              </span>
              <span aria-hidden className="text-brand-orange">
                {serviceData.heading.accent.split("").map((c, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <span data-service-char className="inline-block">
                      {c}
                    </span>
                  </span>
                ))}
              </span>
            </h2>
            <p
              data-service-subtitle
              className="mt-4 text-[clamp(14px,1.3vw,20px)] font-medium text-white/70"
            >
              {serviceData.subtitle}
            </p>
          </div>
        </Container>

        <Container className="mt-[clamp(130px,46vw,220px)] md:mt-14">
          <div
            data-service-cards
            className="col-span-12 grid gap-5 md:grid-cols-2"
          >
            {[0, 1].map((column) => (
              <div
                key={column}
                className={`flex flex-col gap-5 max-md:contents ${
                  column === 1 ? "md:mt-[clamp(60px,8.6vw,125px)]" : ""
                }`}
              >
                {serviceData.services.map((service, index) =>
                  index % 2 === column ? (
                    <ServiceCard
                      key={service.number}
                      {...service}
                      index={index}
                      active={activeIndex === index}
                      onActivate={() => setActiveIndex(index)}
                    />
                  ) : null,
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
