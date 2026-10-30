import type { Metadata } from "next";
import { Caveat, Figtree, Rubik_Glitch } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Loader from "@/components/ui/Loader";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-glitch",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const panchang = localFont({
  src: [
    { path: "./fonts/Panchang-Bold.woff2", weight: "700", style: "normal" },
    {
      path: "./fonts/Panchang-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-panchang",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahan Vimukthi | Designer & Developer",
  description:
    "Portfolio of Sahan Vimukthi, a software engineer and designer building seamless digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${rubikGlitch.variable} ${panchang.variable} ${caveat.variable}`}
    >
      <body className="antialiased">
        <Loader />
        {children}
      </body>
    </html>
  );
}
