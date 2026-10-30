export type ProjectCategory = "uiux" | "frontend" | "fullstack";

export const projectCategories: {
  value: "all" | ProjectCategory;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "uiux", label: "UI/UX" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Full-Stack" },
];

export interface Project {
  id: string;
  title: string;
  /** Who it was built for. */
  client: string;
  category: ProjectCategory;
  /** One short sentence for the back of the card. */
  summary: string;
  /** Up to 3 key technologies or tools. */
  stack: string[];
  /** The first link is the primary button. */
  links: { label: string; href: string }[];
  image: string;
}

export const projectsSection = {
  label: "MY WORK",
  heading: { first: "PROJ", accent: "ECTS" },
  subtitle:
    "A selection of web apps, websites and UI/UX designs I have built for real clients.",
  character: {
    src: "/projectCharacter.png",
    alt: "3D illustrated character presenting the projects",
  },
};

// The original long descriptions, second stack items and duplicate links were trimmed on purpose.
export const projects: Project[] = [
  {
    id: "southern-air-duct",
    title: "Southern Air Duct",
    client: "HVAC & duct company",
    category: "fullstack",
    summary: "Full-stack website for an HVAC and air duct company.",
    stack: ["Next.js", "Tailwind CSS"],
    links: [
      { label: "Live site", href: "https://southern-air-duct.vercel.app/" },
    ],
    image: "/images/Projects/project-1.png",
  },
  {
    id: "itcpdn",
    title: "IT Center Portal",
    client: "University of Peradeniya",
    category: "fullstack",
    summary:
      "Portal for academic resources, course announcements and admin services.",
    stack: ["Next.js", "TypeScript", "MySQL"],
    links: [{ label: "Live site", href: "https://www.ceit.pdn.ac.lk/" }],
    image: "/images/Projects/project-2.png",
  },
  {
    id: "pdnnote",
    title: "Digital Noticeboard",
    client: "University of Peradeniya",
    category: "fullstack",
    summary:
      "Live lab reservations and announcements on a display, with an admin dashboard.",
    stack: ["Electron.js", "React", "TypeScript"],
    links: [
      { label: "GitHub", href: "https://github.com/vimukthi7777/NoticePDN" },
    ],
    image: "/images/Projects/project-3.png",
  },
  {
    id: "riselk",
    title: "Rise Gaming Esports",
    client: "Rise LK",
    category: "fullstack",
    summary:
      "Tournament platform with team registration, live brackets and leaderboards.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [
      { label: "Live site", href: "https://www.risegaming.online/" },
      { label: "GitHub", href: "https://github.com/vimukthi7777/riseweb" },
    ],
    image: "/images/Projects/project-4.png",
  },
  {
    id: "ncp-gov-noticeboard",
    title: "Governor Secretariat Portal",
    client: "North Central Province",
    category: "fullstack",
    summary:
      "Meeting room reservations, schedules and public announcements on a digital display.",
    stack: ["Electron.js", "React", "TypeScript"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/vimukthi7777/MeetingGovNPC",
      },
    ],
    image: "/images/Projects/project-5.png",
  },
  {
    id: "alpha-eye",
    title: "Alpha Eye Software",
    client: "Alpha Eye Software Solutions",
    category: "uiux",
    summary:
      "Enterprise UI/UX and interactive prototype for complex software workflows.",
    stack: ["Figma", "Wireframing", "Prototyping"],
    links: [
      {
        label: "Prototype",
        href: "https://www.figma.com/proto/RAxVbVxpvdwvTjpF24feKb/Untitled?page-id=0%3A1&node-id=67-5486&viewport=1907%2C1197%2C0.06&t=vMfDSlWUDU3ACe2a-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=67%3A5486&show-proto-sidebar=1",
      },
      {
        label: "Design files",
        href: "https://drive.google.com/drive/folders/15brr8D0ogfXyJM6_-ncWTukBQjF1HdTz",
      },
    ],
    image: "/images/Projects/project-6.png",
  },
  {
    id: "overland-auto",
    title: "Overland Automobiles",
    client: "Automotive dealership",
    category: "frontend",
    summary:
      "Responsive website with a vehicle catalogue and a service booking flow.",
    stack: ["Next.js", "Figma", "Prototyping"],
    links: [
      { label: "Live site", href: "https://www.overlandautomobiles.lk/" },
    ],
    image: "/images/Projects/project-7.png",
  },
  {
    id: "baron-luxury",
    title: "Baron Luxury Boutique",
    client: "Luxury fashion brand",
    category: "uiux",
    summary:
      "Minimalist UI/UX and prototype with premium product presentation and checkout.",
    stack: ["Figma", "Prototyping"],
    links: [
      {
        label: "Design files",
        href: "https://drive.google.com/drive/folders/10O9zpU6f4F0uR6YcdpQgQeu0tro-fHrr",
      },
    ],
    image: "/images/Projects/project-8.png",
  },
];
