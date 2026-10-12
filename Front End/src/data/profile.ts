export interface ProfileData {
  username: string;
  name: string;
  badge: string;
  role: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  email: string;
  stats: {
    projects: number;
    skills: number;
    certificates: number;
    contributions: string;
  };
  highlights: {
    id: string;
    label: string;
    icon: string;
    targetId: string;
    description: string;
  }[];
}

export const profileData: ProfileData = {
  username: "vincequijano",
  name: "Vince Quijano",
  badge: "CS Student & Software Developer",
  role: "Full-Stack Developer",
  headline: "Computer Science Student & Aspiring Web Developer",
  bio: "Passionate CS student crafting scalable web apps, data mining systems, and intuitive user experiences. Focused on clean code, performance, and modern web architectures.",
  location: "Remote-first · Available for Internships",
  website: "https://vincequijano.dev",
  github: "https://github.com/vincequijano",
  linkedin: "https://linkedin.com/in/vincequijano",
  email: "vincelawrencequijano@gmail.com",
  stats: {
    projects: 9,
    skills: 24,
    certificates: 3,
    contributions: "500+",
  },
  highlights: [
    {
      id: "about",
      label: "About Me",
      icon: "User",
      targetId: "about",
      description: "Background, education, and career journey in Computer Science.",
    },
    {
      id: "skills",
      label: "Skills",
      icon: "Code",
      targetId: "skills",
      description: "Technical stack across languages, frameworks, and databases.",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "Grid",
      targetId: "projects",
      description: "Showcase of web apps, data mining dashboards, and academic systems.",
    },
    {
      id: "organization",
      label: "Organization",
      icon: "Building2",
      targetId: "about",
      description: "Leadership roles and active involvement in university tech societies and developer communities.",
    },
    {
      id: "certificates",
      label: "Certs",
      icon: "Award",
      targetId: "certificates",
      description: "Verified certificates from Certiport, Anthropic, and Coursera.",
    },
    {
      id: "contact",
      label: "Contact",
      icon: "Send",
      targetId: "contact",
      description: "Get in touch for internships, collaborations, or inquiries.",
    },
  ],
};
