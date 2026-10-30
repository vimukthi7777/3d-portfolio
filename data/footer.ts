const WHATSAPP_NUMBER = "94763475898";
const chatLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** WhatsApp chat: used by the floating button (About and Services) and by the footer. */
export const whatsapp = {
  display: "+94 76 347 5898",
  href: chatLink("Hi! I found you through your portfolio."),
  icon: "/whatsapp.svg",
};

export const footerData = {
  label: "LET’S WORK TOGETHER",

  heading: {
    first: "Ready to",
    accent: "Build Something",
    last: "Amazing?",
  },

  description:
    "Have a project in mind or just want to chat? I’d love to hear from you. Let’s turn your ideas into real solutions.",

  primaryAction: { label: "Get In Touch", href: "#contact" },
  // The CV is sent personally: the button opens a WhatsApp chat with a ready-made request.
  secondaryAction: {
    label: "Request CV",
    href: chatLink("Hi! I visited your portfolio and I'd like to request your CV, please."),
  },

  info: [
    {
      icon: "location",
      label: "Location",
      value: "Kandy, Sri Lanka",
      href: "",
    },
    {
      icon: "email",
      label: "Email",
      value: "sahangalabodab@gmail.com",
      href: "mailto:sahangalabodab@gmail.com",
    },
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: whatsapp.display,
      href: whatsapp.href,
    },
  ],

  // An icon is only shown when its href is filled in.
  socials: [
    { name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/in/sahanvimukthi7/" },
    { name: "GitHub", icon: "github", href: "https://github.com/vimukthi7777" },
    { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/_.vimukthi._" },
    { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@VimuwaStreams" },
  ],

  signature: "Vimuwa",
  copyright: "© 2026 Sahan Vimukthi. All rights reserved.",
  // Hidden until a privacy page exists.
  privacy: { label: "Privacy Policy", href: "" },

  background: "/footerBG.png",
} as const;
