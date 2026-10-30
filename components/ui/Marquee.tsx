"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { onRowRevealed } from "@/lib/techReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type MarqueeProps = {
  /**
   * Content to repeat. Pass a function to know whether a copy is a clone (everything except the
   * very first copy): clones should not be focusable or announced twice.
   */
  children: ReactNode | ((clone: boolean) => ReactNode);
  /** Direction the content travels. */
  direction: "left" | "right";
  /** Pixels per second. */
  speed?: number;
  /** How many times children repeat inside one half of the track. */
  copies?: number;
  /** Wait until scrolled into view (plus startDelay seconds) before moving. */
  startOnScroll?: boolean;
  /** Start moving once technologies row `startOnRow` (0-based) has appeared (plus startDelay seconds). */
  startOnRow?: number;
  /** Set false to keep moving when the OS asks for reduced motion. */
  respectReducedMotion?: boolean;
  /** Ease to a stop while a mouse hovers the marquee, and back to speed afterwards. */
  pauseOnHover?: boolean;
  /** Controlled pause (e.g. a card is flipped by touch). */
  paused?: boolean;
  startDelay?: number;
  className?: string;
};

export default function Marquee({
  children,
  direction,
  speed = 80,
  copies = 1,
  startOnScroll = false,
  startOnRow,
  respectReducedMotion = true,
  pauseOnHover = false,
  paused = false,
  startDelay = 0,
  className = "",
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(paused);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(
        respectReducedMotion
          ? "(prefers-reduced-motion: no-preference)"
          : "all",
        () => {
          const cleanups: (() => void)[] = [];

          // The track holds two identical groups, so one group is half its width.
          const duration = el.scrollWidth / 2 / speed;
          const tween = gsap.fromTo(
            el,
            { xPercent: direction === "left" ? 0 : -50 },
            {
              xPercent: direction === "left" ? -50 : 0,
              duration,
              ease: "none",
              repeat: -1,
              paused: startOnScroll || startOnRow !== undefined,
            },
          );
          tweenRef.current = tween;
          if (pausedRef.current) tween.timeScale(0);

          const setSpeed = (value: number) =>
            gsap.to(tween, { timeScale: value, duration: 0.5, overwrite: true });

          if (pauseOnHover && root.current) {
            const node = root.current;
            const onEnter = (e: PointerEvent) => {
              if (e.pointerType === "mouse") setSpeed(0);
            };
            const onLeave = (e: PointerEvent) => {
              if (e.pointerType === "mouse") setSpeed(pausedRef.current ? 0 : 1);
            };
            node.addEventListener("pointerenter", onEnter);
            node.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              node.removeEventListener("pointerenter", onEnter);
              node.removeEventListener("pointerleave", onLeave);
            });
          }

          if (startOnRow !== undefined) {
            cleanups.push(
              onRowRevealed(startOnRow, () => {
                tween.delay(startDelay).play();
              }),
            );
          }

          if (startOnScroll) {
            ScrollTrigger.create({
              trigger: root.current,
              start: "top 85%",
              once: true,
              onEnter: () => {
                tween.delay(startDelay).play();
              },
            });
          }

          return () => {
            cleanups.forEach((fn) => fn());
            tweenRef.current = null;
          };
        },
      );

      return () => mm.revert();
    },
    {
      scope: root,
      dependencies: [
        direction,
        speed,
        startOnScroll,
        startOnRow,
        respectReducedMotion,
        pauseOnHover,
        startDelay,
      ],
    },
  );

  useEffect(() => {
    pausedRef.current = paused;
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: paused ? 0 : 1,
        duration: 0.5,
        overwrite: true,
      });
    }
  }, [paused]);

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1}
            className="flex shrink-0 items-center"
          >
            {Array.from({ length: copies }).map((_, i) => (
              <Fragment key={i}>
                {typeof children === "function"
                  ? children(group === 1 || i > 0)
                  : children}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
