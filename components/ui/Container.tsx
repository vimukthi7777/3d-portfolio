import type { ComponentProps } from "react";

/** Figma layout guide: 12 columns, stretch, 80px margin, 20px gutter. */
export default function Container({
  className = "",
  children,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={`mx-auto grid w-full grid-cols-12 gap-x-5 px-5 md:px-10 xl:px-20 ${className}`}
    >
      {children}
    </div>
  );
}
