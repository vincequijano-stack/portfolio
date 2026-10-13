export interface SkillGroup {
  category: string;
  description: string;
  skills: {
    name: string;
    level: string;
    icon?: string;
    isPrimary?: boolean;
  }[];
}

export const skillsData: SkillGroup[] = [
  {
    category: 'Core Stack',
    description: 'Core languages, runtime environments, and frameworks utilized across modern projects.',
    skills: [
      { name: 'JavaScript', level: 'Advanced', isPrimary: true },
      { name: 'Java', level: 'Advanced', isPrimary: true },
      { name: 'React', level: 'Advanced', isPrimary: true },
      { name: 'NextJS', level: 'Proficient', isPrimary: true },
      { name: 'NodeJS', level: 'Advanced', isPrimary: true },
    ],
  },
  {
    category: 'Frontend Development',
    description: 'Structure, interactive interfaces, styling, and design system components.',
    skills: [
      { name: 'HTML', level: 'Expert', isPrimary: true },
      { name: 'CSS', level: 'Advanced', isPrimary: true },
      { name: 'Figma', level: 'Advanced', isPrimary: true },
    ],
  },
  {
    category: 'Backend Development',
    description: 'Server-side architectures, scripting, algorithm design, and embedded databases.',
    skills: [
      { name: 'Java', level: 'Advanced', isPrimary: true },
      { name: 'Python', level: 'Advanced', isPrimary: true },
      { name: 'SQLite', level: 'Proficient', isPrimary: true },
    ],
  },
  {
    category: 'Tools & Cloud',
    description: 'Cloud hosting, version control, modern IDEs, and deployment pipelines.',
    skills: [
      { name: 'Google Cloud', level: 'Proficient', isPrimary: true },
      { name: 'VSCode', level: 'Expert', isPrimary: true },
      { name: 'Vercel', level: 'Advanced', isPrimary: true },
      { name: 'Git', level: 'Advanced', isPrimary: true },
      { name: 'AWS', level: 'Proficient', isPrimary: true },
    ],
  },
  {
    category: 'Graphics Designing',
    description: 'UI prototyping, high-fidelity mockups, branding, and graphic content creation.',
    skills: [
      { name: 'Figma', level: 'Expert', isPrimary: true },
      { name: 'Canva', level: 'Advanced', isPrimary: true },
    ],
  },
];
