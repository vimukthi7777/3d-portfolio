"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CountUpProps = {
  /** Display value such as "3+" or "50+". */
  value: string;
  duration?: number;
  className?: string;
};

export default function CountUp({ value, duration = 1.8, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = parseInt(value, 10) || 0;
  const suffix = value.replace(/^\d+/, "");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(counter, {
          n: target,
          duration,
          ease: "power2.out",
          snap: { n: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${counter.n}${suffix}`;
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [target, suffix, duration] },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
