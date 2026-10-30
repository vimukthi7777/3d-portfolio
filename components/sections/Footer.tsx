"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { footerData, whatsapp } from "@/data/footer";
import { hero } from "@/data/hero";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// lucide-react 1.x has no brand icons, so these are small inline SVGs.
const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: (
    <path
      fill="currentColor"
      d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.500 11.500 0 0 1 6 0C17.300 4.700 18.300 5 18.300 5c.7 1.700.2 2.900.1 3.200.8.800 1.200 1.900 1.200 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.400 20.500h-3.600v-5.600c0-1.300 0-3-1.800-3s-2.100 1.400-2.100 2.900v5.700H9.400V9h3.400v1.600c.5-.9 1.600-1.900 3.400-1.900 3.600 0 4.300 2.400 4.300 5.500zM5.300 7.400a2.100 2.100 0 1 1 0-4.100 2.100 2.100 0 0 1 0 4.100m1.800 13.100H3.600V9h3.500zM22.200 0H1.800C.8 0 0 .8 0 1.700v20.600c0 .9.800 1.700 1.800 1.700h20.400c1 0 1.800-.8 1.800-1.700V1.700C24 .8 23.200 0 22.200 0"
    />
  ),
  instagram: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.200" />
      <circle cx="17.300" cy="6.700" r="0.600" fill="currentColor" />
    </g>
  ),
  dribbble: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M6 5.500c4 2.500 8 8 9.500 13" />
      <path d="M3.200 11c5 .3 10-.5 14.800-3.500" />
      <path d="M8.500 20.300c.5-4.500 4-8 12.300-7.300" />
    </g>
  ),
  youtube: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="2.500" y="5.500" width="19" height="13" rx="4" />
      <path d="M10 9.200v5.600l5-2.800z" fill="currentColor" />
    </g>
  ),
};

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const socials = footerData.socials.filter((s) => s.href);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: "[data-footer-content]",
            start: "top 80%",
            once: true,
          },
        });
        tl.from("[data-footer-label]", {
          opacity: 0,
          scale: 0.7,
          rotate: -8,
          duration: 0.7,
          ease: "back.out(1.7)",
        })
          .from(
            "[data-footer-line]",
            { yPercent: 110, duration: 0.8, stagger: 0.12 },
            "-=0.3",
          )
          .from(
            "[data-footer-desc]",
            { opacity: 0, y: 16, duration: 0.6 },
            "-=0.4",
          )
          .from(
            "[data-footer-btn]",
            { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 },
            "-=0.3",
          )
          .from(
            "[data-footer-info]",
            { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 },
            "-=0.3",
          )
          .from(
            "[data-footer-social]",
            { opacity: 0, scale: 0.6, duration: 0.4, stagger: 0.07 },
            "-=0.3",
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { heading } = footerData;
  const line = (text: string, className = "") => (
    <span className="block overflow-hidden pb-[0.08em]">
      <span data-footer-line className={`block ${className}`}>
        {text}
      </span>
    </span>
  );

  const infoIcon = { location: MapPin, email: Mail } as const;

  return (
    <footer id="footer" ref={root} className="bg-black text-white">
      <div className="relative isolate overflow-hidden">
        {/* Mobile: the artwork is the background behind all the content, like on desktop. It is scaled to
            the height of the section with the character on the right; a dark gradient from the left keeps
            the text readable. */}
        <div aria-hidden className="absolute inset-0 -z-10 md:hidden">
          <Image
            src={footerData.background}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[80%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
          <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Desktop: the artwork (with the character on the right) is the background */}
        <div aria-hidden className="absolute inset-0 -z-10 hidden md:block">
          {/* Box with the artwork's own aspect ratio, so the fade starts at the picture's real left edge */}
          <div className="absolute inset-y-0 right-0 aspect-[1672/941] max-w-full">
            <Image
              src={footerData.background}
              alt=""
              fill
              sizes="100vw"
              className="object-cover [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.5)_20%,#000_48%)]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <Container
          data-footer-content
          className="py-14 md:py-20 lg:min-h-[clamp(620px,48vw,760px)] lg:items-center"
        >
          <div className="col-span-12 lg:col-span-6 xl:col-span-5">
            <SectionLabel data-footer-label label={footerData.label} />

            <h2 className="mt-5 text-[clamp(34px,4.2vw,66px)] font-extrabold leading-[1.05] tracking-tight">
              {line(heading.first)}
              {line(heading.accent, "text-brand-orange")}
              {line(heading.last)}
            </h2>

            <p
              data-footer-desc
              className="mt-5 max-w-md text-[clamp(14px,1.2vw,18px)] leading-relaxed text-white/75"
            >
              {footerData.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                data-footer-btn
                href={footerData.primaryAction.href}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff8a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {footerData.primaryAction.label}{" "}
                <ArrowUpRight aria-hidden size={16} />
              </a>
              <a
                data-footer-btn
                href={footerData.secondaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/70 bg-black/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {footerData.secondaryAction.label}{" "}
                <Image
                  src={whatsapp.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              {footerData.info.map((item) => {
                const Icon =
                  item.icon === "whatsapp" ? null : infoIcon[item.icon];
                const body = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-orange/40 bg-brand-orange/10 text-brand-orange">
                      {Icon ? (
                        <Icon aria-hidden size={20} />
                      ) : (
                        <Image
                          src={whatsapp.icon}
                          alt=""
                          width={26}
                          height={26}
                          className="h-[26px] w-[26px]"
                        />
                      )}
                    </span>
                    <span className="text-sm">
                      <span className="block text-xs text-white/55">
                        {item.label}
                      </span>
                      <span className="block font-medium">{item.value}</span>
                    </span>
                  </>
                );
                return (
                  <li
                    key={item.label}
                    data-footer-info
                    className="flex items-center gap-3"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-center gap-3 hover:text-brand-orange"
                      >
                        {body}
                      </a>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>

            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {socials.map((social) => (
                  <li key={social.name} data-footer-social>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-orange/50 bg-black/40 text-brand-orange transition hover:bg-brand-orange hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden
                        className="h-[18px] w-[18px]"
                      >
                        {SOCIAL_ICONS[social.icon]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </div>

      {/* Bottom bar: plain black, the artwork does not reach it */}
      <div className="border-t border-white/10 bg-black">
        <Container className="items-center gap-y-4 py-6">
          <div className="col-span-12 flex flex-col items-center gap-4 lg:col-span-7 lg:flex-row lg:gap-8">
            <span className="font-script text-4xl font-bold leading-none text-brand-orange">
              {footerData.signature}
            </span>
            <span
              aria-hidden
              className="hidden h-8 w-px bg-white/15 lg:block"
            />
            <nav
              aria-label="Footer"
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
            >
              {hero.navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="capitalize text-white/85 transition-colors hover:text-brand-orange"
                >
                  {item.label.toLowerCase()}
                </a>
              ))}
            </nav>
          </div>
          <div className="col-span-12 flex flex-col items-center gap-2 text-xs text-white/60 lg:col-span-5 lg:flex-row lg:justify-end lg:gap-8">
            <span>{footerData.copyright}</span>
            {footerData.privacy.href && (
              <a
                href={footerData.privacy.href}
                className="text-white/85 hover:text-brand-orange"
              >
                {footerData.privacy.label}
              </a>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}
