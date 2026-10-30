"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { whatsapp } from "@/data/footer";

/** Section ids where the floating button is shown (the right corner of About and Services). */
const SECTIONS = ["about", "services"];

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        }
        setVisible(inView.size > 0);
      },
      { threshold: 0.1 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with me on WhatsApp (${whatsapp.display})`}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-[60] md:bottom-8 md:right-8 ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-75 opacity-0"
      } transition-[opacity,translate,scale] duration-300 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.4s]"
      />
      <Image
        src={whatsapp.icon}
        alt=""
        width={64}
        height={64}
        className="relative h-14 w-14 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] md:h-16 md:w-16"
      />
    </a>
  );
}
