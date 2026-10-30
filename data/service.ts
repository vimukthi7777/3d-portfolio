export const serviceData = {
  label: "WHAT I DO",

  heading: {
    first: "SERV",
    accent: "ICES",
  },

  subtitle: "Design minded engineering. Built for real world impact.",

  character: {
    src: "/serviceCharacter.png",
    alt: "3D illustrated character pointing at the services",
  },

  // Cards fill two columns alternately (01 and 03 left, 02 and 04 right); the right column is offset downwards.
  // `icon` is an optional 3D image shown at the bottom right of the card.
  services: [
    {
      number: "01",
      title: "Full-Stack Development",
      description:
        "End-to-end web applications combining modern frontends, backend services, databases, authentication and APIs.",
      icon: "/FullStack3Dicon.svg",
    },
    {
      number: "02",
      title: "Frontend Engineering",
      description:
        "Responsive and maintainable interfaces built with React, Next.js and Tailwind CSS, focused on performance and usability.",
      icon: null,
    },
    {
      number: "03",
      title: "Backend & API Development",
      description:
        "REST APIs, authentication, business logic and server-side solutions built with technologies such as Node.js, Express.js and Spring Boot.",
      icon: null,
    },
    {
      number: "04",
      title: "UI/UX Design",
      description:
        "User-focused interfaces, wireframes and prototypes designed with clear visual hierarchy, usability and thoughtful interactions.",
      icon: "/uiux3Dicon.svg",
    },
  ],
} as const;
