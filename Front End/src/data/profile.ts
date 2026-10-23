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
  location: "Pamantasan ng Cabuyao · Laguna, Philippines",
  website: "https://vincequijano.dev",
  github: "https://github.com/vincequijano-stack",
  linkedin: "https://www.linkedin.com/in/vince-quijano-769768421",
  email: "vincelawrencequijano@gmail.com",
  stats: {
    projects: 3,
    skills: 16,
    certificates: 4,
    contributions: "500+",
  },
  highlights: [
    {
      id: "about",
      label: "About",
      icon: "User",
      targetId: "about",
      description: "4th yr computer science from Pamantasan ng Cabuyao.",
    },
    {
      id: "skills",
      label: "Skills",
      icon: "Code",
      targetId: "skills",
      description: "Core Stack, Frontend, Backend, Tools & Graphics Designing.",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "Grid",
      targetId: "projects",
      description: "CoBuy — Thesis buying pattern mining system.",
    },
    {
      id: "organization",
      label: "Organization",
      icon: "Building2",
      targetId: "about",
      description: "DEVCON LAGUNA & CRYPTITA PLAYS.",
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: "Award",
      targetId: "certificates",
      description: "Verified certificates & credentials.",
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: "Trophy",
      targetId: "about",
      description: "ImaGnation 2026 Participant.",
    },
  ],
};
