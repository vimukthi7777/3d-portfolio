"use client";

import { useEffect, useState } from "react";
import { markLoaderDone } from "@/lib/loader";

const MIN_VISIBLE_MS = 1800; // long enough for the waves to be seen
const MAX_WAIT_MS = 6000; // never trap the visitor if an image is slow
const FADE_MS = 600;

// Liquid-fill circle (user supplied), recoloured. Kept next to the component so it
// is part of the server HTML and shows from the very first paint, independent of the global stylesheet.
const LOADER_CSS = `
.loader {
  --color-1: #fff;
  --color-2: rgba(251, 117, 47, 0.6);
  --color-3: rgba(0, 0, 0, 0.2);
  --color-4: #ffae00;
  --color-5: rgba(255, 174, 0, 0.45);
  --size: 1px;
  width: calc(150 * var(--size));
  height: calc(150 * var(--size));
  background-color: var(--color-1);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 calc(30 * var(--size)) calc(4 * var(--size)) var(--color-2) inset,
    0 calc(5 * var(--size)) calc(12 * var(--size)) var(--color-3);
  overflow: hidden;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 45%;
  top: -40%;
  background-color: var(--color-4);
  animation: loader-wave 3s linear infinite;
}
.loader:before {
  border-radius: 30%;
  background: var(--color-5);
}
@keyframes loader-wave {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
.site-loader { animation: loader-failsafe 0.4s ease 8s forwards; }
@keyframes loader-failsafe { to { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) {
  .loader:before, .loader:after { animation-duration: 20s; }
}
`;

/** Full-screen loader (liquid-fill circle). It is in the server HTML, so it covers the page from the first paint. */
export default function Loader() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const started = performance.now();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let cancelled = false;
    const timers: number[] = [];

    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const giveUp = new Promise<void>((resolve) =>
      timers.push(window.setTimeout(resolve, MAX_WAIT_MS)),
    );

    Promise.race([Promise.all([loaded, fonts]), giveUp]).then(() => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          root.style.overflow = "";
          setPhase("hide");
          markLoaderDone();
          timers.push(window.setTimeout(() => setPhase("gone"), FADE_MS));
        }, wait),
      );
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      root.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`site-loader fixed inset-0 z-[200] flex items-center justify-center bg-[#fb752f] transition-opacity ease-out ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <style>{LOADER_CSS}</style>
      <span className="loader" />
    </div>
  );
}
