
export const hero = {
  navigation: [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "SERVICES", href: "#services" },
    { label: "PROJECTS", href: "#projects" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "CONTACT", href: "#contact" },
  ],

  // Navbar button: takes the visitor to the project request form.
  cta: {
    label: "BOOK A PROJECT",
    href: "#contact",
  },

  heading: {
    firstLine: "DESIGNER",
    secondLine: "DEV",
  },

  character: {
    src: "/images/hero-character.png",
    alt: "3D illustrated portfolio character",
  },

  designTicker: [
    { label: "UI/UX DESIGN", icon: "palette" },
    { label: "WEB DESIGN", icon: "camera" },
    { label: "Email Marketing Design", icon: "megaphone" },
    { label: "CREATIVE DESIGN", icon: "brush" },
  ],

  developmentTicker: [
    { label: "FULLSTACK", icon: "clapperboard" },
    { label: "DEVELOPERS", icon: "code" },
    { label: "BACKEND", icon: "pen-tool" },
    { label: "API", icon: "webhook" },
  ],
} as const;
