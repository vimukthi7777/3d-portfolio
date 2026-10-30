import type { ComponentProps } from "react";

type SectionLabelProps = ComponentProps<"div"> & { label: string };

/** Hand-drawn orange ellipse with the section name inside (ABOUT, WHAT I DO, ...). */
export default function SectionLabel({ label, className = "", ...rest }: SectionLabelProps) {
  return (
    <div
      {...rest}
      className={`relative inline-flex h-14 min-w-36 items-center justify-center px-8 ${className}`}
    >
      <svg
        viewBox="0 0 144 56"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M20 38C6 30 10 14 40 8c32-6 78-4 96 8 10 8 0 22-28 30-30 8-72 8-92 0C10 42 12 34 22 28"
          stroke="#FB752F"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative text-sm font-semibold tracking-wide">{label}</span>
    </div>
  );
}
