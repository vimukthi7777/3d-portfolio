"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contactSection } from "@/data/contact";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ContactForm from "@/components/ui/ContactForm";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 80%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from("[data-contact-label]", {
          opacity: 0,
          scale: 0.7,
          rotate: -8,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: once("[data-contact-label]", "top 85%"),
        });
        gsap.from("[data-contact-char]", {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: once("[data-contact-heading]", "top 85%"),
        });
        gsap.from("[data-contact-subtitle]", {
          opacity: 0,
          y: 16,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: once("[data-contact-heading]", "top 85%"),
        });
        gsap.from("[data-contact-hero]", {
          opacity: 0,
          scale: 0.85,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: once("[data-contact-stage]", "top 80%"),
        });
        gsap.from("[data-contact-form]", {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: once("[data-contact-stage]", "top 80%"),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { heading } = contactSection;
  const chars = (text: string) =>
    text.split("").map((c, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden whitespace-pre align-bottom"
      >
        <span data-contact-char className="inline-block">
          {c}
        </span>
      </span>
    ));

  return (
    <section
      id="contact"
      ref={root}
      className="relative isolate overflow-hidden border-t border-white/10 bg-[#050505] py-16 text-white md:py-24"
    >
      {/* Soft orange light behind the form and character */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_55%,rgba(251,117,47,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(251,117,47,0.12),transparent_70%)]"
      />

      <Container data-contact-stage className="relative z-10 items-start gap-y-10">
        <div className="col-span-12 lg:col-span-5">
          <SectionLabel data-contact-label label={contactSection.label} />
          <h2
            data-contact-heading
            aria-label={`${heading.first} ${heading.accent}`}
            className="mt-4 whitespace-nowrap font-display text-[8.4vw] font-extrabold leading-[1.05] md:text-[clamp(30px,3.4vw,56px)]"
          >
            <span aria-hidden className="block">
              {chars(heading.first)}
            </span>
            <span aria-hidden className="block text-brand-orange">
              {chars(heading.accent)}
            </span>
          </h2>
          <p
            data-contact-subtitle
            className="mt-4 max-w-md text-[clamp(14px,1.2vw,18px)] leading-relaxed text-white/70"
          >
            {contactSection.subtitle}
          </p>
        </div>

        <div
          data-contact-form
          className="col-span-12 lg:col-span-7 xl:col-span-6 xl:col-start-7"
        >
          <ContactForm />
        </div>
      </Container>

      {/* Big character anchored to the bottom-left corner of the section (desktop) */}
      <div
        data-contact-hero
        className="pointer-events-none absolute bottom-10 left-[3vw] -z-0 hidden w-[30vw] max-w-[500px] xl:w-[32vw] lg:block"
      >
        <Image
          src={contactSection.character.src}
          alt={contactSection.character.alt}
          width={1368}
          height={1149}
          sizes="(min-width: 1024px) 42vw, 0px"
          className="h-auto w-full [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]"
        />
      </div>
    </section>
  );
}
