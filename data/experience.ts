export type TimelineStatus = "current" | "completed";

export interface TimelineItem {
  id: number;
  period: string;
  /** Job title or qualification. */
  title: string;
  /** Company or institution. */
  organization: string;
  /** One short sentence. */
  description: string;
  /** Up to 4 key skills or highlights. */
  tags: string[];
  status: TimelineStatus;
}

type TabContent = {
  /** Small pill above the heading. */
  label: string;
  heading: { first: string; accent: string };
  subtitle: string;
};

export const experienceSection = {
  tabs: {
    experience: {
      label: "CAREER JOURNEY",
      heading: { first: "WHERE I’VE ", accent: "WORKED" },
      subtitle: "Building products, solving problems, growing with every role.",
    } satisfies TabContent,
    education: {
      label: "EDUCATION",
      heading: { first: "WHERE I’VE ", accent: "STUDIED" },
      subtitle: "Strong foundations in software engineering and problem-solving.",
    } satisfies TabContent,
  },
  tabLabels: { experience: "Experience", education: "Education" },
  statusLabels: { current: "CURRENT ROLE", completed: "COMPLETED" },
  tagline: ["Same Passion", "Bigger Projects"],
  background: "/experienceBG.png",
  character: {
    src: "/experienceCharacter.png",
    alt: "3D illustrated character standing with hands in pockets",
  },
};

export const experiences: TimelineItem[] = [
  {
    id: 1,
    period: "2026 — Present",
    title: "Software Developer",
    organization: "Alpha Eye Technologies (Pvt) Ltd",
    description:
      "Building full-stack web experiences and intuitive digital products.",
    tags: ["JavaScript", "React", "Next.js", "Node.js"],
    status: "current",
  },
  {
    id: 2,
    period: "2026",
    title: "Software Developer Intern",
    organization: "University of Peradeniya IT Center",
    description:
      "Developed academic portals, desktop systems, and REST API integrations.",
    tags: ["Next.js", "TypeScript", "Spring Boot", "MySQL"],
    status: "completed",
  },
  {
    id: 3,
    period: "2024 — 2026",
    title: "UI/UX Designer & Web Developer",
    organization: "Alpha Eye Technologies (Pvt) Ltd",
    description:
      "Designed user-friendly interfaces and built reusable, high-performance components.",
    tags: ["React", "Tailwind CSS", "Figma", "Git"],
    status: "completed",
  },
  {
    id: 4,
    period: "2023 — 2026",
    title: "Freelance Web Developer",
    organization: "Self-employed",
    description:
      "Delivering web and UI/UX solutions from concept to deployment.",
    tags: ["React", "Tailwind CSS", "MongoDB", "Figma"],
    status: "completed",
  },
];

export const education: TimelineItem[] = [
  {
    id: 1,
    period: "2025",
    title: "BSc (Hons) Software Engineering",
    organization: "ICBT Campus | Cardiff Metropolitan University",
    description:
      "Graduated with First Class Honours, with strong foundations in software engineering and system design.",
    tags: ["First Class Honours"],
    status: "completed",
  },
];
