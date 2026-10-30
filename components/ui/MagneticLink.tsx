"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** How far the element follows the cursor (0-1 of the cursor offset). */
  strength?: number;
  /** Pull radius as a multiple of the element's larger side. */
  radius?: number;
  /** Max tilt in degrees toward the cursor. */
  tilt?: number;
  /** Max upward travel in px, so the element never lifts far off the ground. */
  maxUp?: number;
};

/** Link that is pulled toward the cursor while the pointer is near it. */
export default function MagneticLink({
  href,
  children,
  className = "",
  ariaLabel,
  strength = 0.3,
  radius = 0.8,
  tilt = 6,
  maxUp = 10,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover)", () => {
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const r = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          // getBoundingClientRect includes the current offset; subtract it to get the resting centre.
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2 - (gsap.getProperty(el, "x") as number);
          const cy = rect.top + rect.height / 2 - (gsap.getProperty(el, "y") as number);
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const reach = Math.max(rect.width, rect.height) * radius;

          if (Math.hypot(dx, dy) < reach) {
            x(dx * strength);
            y(Math.max(dy * strength, -maxUp));
            r((dx / reach) * tilt);
          } else {
            x(0);
            y(0);
            r(0);
          }
        };

        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });

      // Touch / pen: drag the element with a finger, it springs back on release.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let start: { x: number; y: number } | null = null;
        let moved = false;
        const range = 140;
        const clamp = (v: number) => Math.max(-range, Math.min(range, v));

        const onDown = (e: PointerEvent) => {
          if (e.pointerType === "mouse") return;
          start = { x: e.clientX, y: e.clientY };
          moved = false;
          el.setPointerCapture(e.pointerId);
          gsap.killTweensOf(el);
        };
        const onDrag = (e: PointerEvent) => {
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.hypot(dx, dy) > 8) moved = true;
          gsap.to(el, {
            x: clamp(dx),
            y: clamp(dy),
            rotation: clamp(dx) / 10,
            duration: 0.15,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const onUp = () => {
          if (!start) return;
          start = null;
          gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
        };
        // A drag must not count as a click on the link.
        const onClick = (e: MouseEvent) => {
          if (moved) {
            e.preventDefault();
            moved = false;
          }
        };

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onDrag);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("click", onClick);
        return () => {
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onDrag);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          el.removeEventListener("click", onClick);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength, radius, tilt, maxUp] },
  );

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      draggable={false}
      className={`touch-none ${className}`}
    >
      {children}
    </a>
  );
}
