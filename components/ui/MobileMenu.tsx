"use client";

import { useEffect, useState } from "react";

type MobileMenuProps = {
  items: readonly { label: string; href: string }[];
  cta: { label: string; href: string };
};

/** Burger button + full screen menu, used below the md breakpoint. */
export default function MobileMenu({ items, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const bar = "block h-0.5 w-6 bg-white transition-all duration-300";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`${bar} ${open ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span className={`${bar} ${open ? "opacity-0" : ""}`} />
        <span
          className={`${bar} ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col justify-center gap-8 bg-black px-8 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-6">
          {items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
              className={`font-sans text-3xl font-semibold tracking-wide text-white transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } ${i === 0 ? "text-brand-orange" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={cta.href}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="mt-4 self-start bg-brand-orange px-7 py-4 text-sm font-semibold leading-none tracking-wide text-white"
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}
