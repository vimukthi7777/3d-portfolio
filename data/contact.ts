export const contactSection = {
  label: "GET IN TOUCH",
  heading: { first: "LET’S WORK", accent: "TOGETHER" },
  subtitle:
    "Have an idea, a product or a problem to solve? Tell me about it in five quick steps and I’ll get back to you.",
  signature: "Sahan Vimukthi",
  character: {
    src: "/contactCharacter.png",
    alt: "3D illustrated character surrounded by mail, phone, calendar and message icons",
  },
  privacy:
    "Your information is safe with me. I’ll only use it to respond to your inquiry.",
};

/** Heading (plain + orange accent) and helper text of each step. */
export const contactSteps = [
  {
    title: ["How can I ", "help you?"],
    subtitle: "Select the type of project that best fits your needs.",
  },
  {
    title: ["Tell me about ", "your project"],
    subtitle: "Give me a short overview of what you have in mind.",
  },
  {
    title: ["Your ", "details"],
    subtitle: "Let’s get to know you.",
  },
  {
    title: ["Timeline & ", "budget"],
    subtitle: "Help me understand your expectations.",
  },
  {
    title: ["Review ", "your request"],
    subtitle: "Please review your details before submitting.",
  },
] as const;

export const projectTypes = [
  {
    value: "fullstack",
    label: "Full-Stack Development",
    description: "Web applications from end to end.",
    icon: "monitor",
  },
  {
    value: "uiux",
    label: "UI/UX Design",
    description: "Modern and user-friendly designs.",
    icon: "pen",
  },
  {
    value: "backend",
    label: "Backend & API Development",
    description: "Robust APIs and server systems.",
    icon: "code",
  },
  {
    value: "database",
    label: "Database Management",
    description: "Design, optimization and maintenance.",
    icon: "database",
  },
  {
    value: "webapp",
    label: "Web Application",
    description: "Custom web solutions for your business.",
    icon: "app",
  },
  {
    value: "other",
    label: "Other",
    description: "Have something else in mind? Let’s discuss.",
    icon: "more",
  },
] as const;

export const timelineOptions = [
  "As soon as possible",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Not sure yet",
] as const;

export const budgetOptions = [
  "Under LKR 50,000",
  "LKR 50,000 – 150,000",
  "LKR 150,000 – 300,000",
  "LKR 300,000 – 500,000",
  "Over LKR 500,000",
  "Not sure yet",
] as const;

export const priorityOptions = [
  "Launch quickly",
  "Design and user experience",
  "Performance and scalability",
  "Keep the cost low",
  "Not sure yet",
] as const;

export const countryCodes = [
  { code: "+94", label: "LK" },
  { code: "+91", label: "IN" },
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
  { code: "+65", label: "SG" },
  { code: "+971", label: "AE" },
  { code: "+49", label: "DE" },
] as const;
