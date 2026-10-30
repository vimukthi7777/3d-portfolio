"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import MobileMenu from "@/components/ui/MobileMenu";

gsap.registerPlugin(useGSAP);

type NavbarProps = {
  items: readonly { label: string; href: string }[];
  cta: { label: string; href: string };
};

/** Fixed navbar: hides while scrolling down, comes back as soon as you scroll up. */
export default function Navbar({ items, cta }: NavbarProps) {
  const root = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(items[0]?.href ?? "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      setScrolled(y > 24);
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      if (Math.abs(delta) > 6) lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section that is currently in view.
  useEffect(() => {
    const targets = items
      .map((item) => ({
        href: item.href,
        el: document.querySelector(item.href),
      }))
      .filter((t): t is { href: string; el: Element } => t.el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const hit = targets.find((t) => t.el === entry.target);
            if (hit) setActive(hit.href);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [items]);

  // Slide via `top` and use a plain background: transform/filter/backdrop-filter would trap the fixed mobile menu inside the bar.
  return (
    <header
      ref={root}
      className={`fixed inset-x-0 z-[70] text-white transition-[top,background-color] duration-300 ${
        hidden ? "top-[-120px]" : "top-0"
      } ${scrolled ? "bg-black" : "bg-transparent"}`}
    >
      <div className="mx-auto flex w-full items-center justify-between px-5 py-4 md:px-10 md:py-5 xl:px-20">
        {/* Mobile: the site icon (public/icon.png) on the left */}
        <a href="#home" aria-label="Back to top" className="shrink-0 md:hidden">
          <Image
            src="/icon.png"
            alt=""
            width={72}
            height={72}
            className="h-9 w-9 rounded-lg"
          />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={`relative text-base font-medium leading-none tracking-wide transition-opacity hover:opacity-80 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full ${
                active === item.href ? "after:bg-white" : "after:bg-transparent"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={cta.href}
          className={`ml-auto hidden items-center px-7 py-3 text-sm font-semibold leading-none tracking-wide text-white transition-transform hover:scale-105 md:flex ${
            scrolled ? "bg-brand-orange" : "bg-black"
          }`}
        >
          {cta.label}
        </a>
        <div className="ml-auto md:hidden">
          <MobileMenu items={items} cta={cta} />
        </div>
      </div>
    </header>
  );
}
