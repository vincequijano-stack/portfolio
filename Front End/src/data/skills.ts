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
    category: 'Programming Languages',
    description: 'Core languages utilized for software development, data structures, and algorithms.',
    skills: [
      { name: 'Python', level: 'Advanced', isPrimary: true },
      { name: 'Java', level: 'Proficient', isPrimary: true },
      { name: 'TypeScript', level: 'Advanced', isPrimary: true },
      { name: 'JavaScript (ES6+)', level: 'Advanced', isPrimary: true },
      { name: 'C++', level: 'Intermediate', isPrimary: false },
      { name: 'SQL', level: 'Advanced', isPrimary: true },
    ],
  },
  {
    category: 'Frontend Development',
    description: 'Modern frameworks, libraries, and styling systems for responsive web interfaces.',
    skills: [
      { name: 'React', level: 'Advanced', isPrimary: true },
      { name: 'Next.js', level: 'Proficient', isPrimary: true },
      { name: 'Tailwind CSS', level: 'Advanced', isPrimary: true },
      { name: 'HTML5 & Semantic Web', level: 'Expert', isPrimary: true },
      { name: 'CSS3 & Modern Layouts', level: 'Advanced', isPrimary: true },
      { name: 'Vite', level: 'Advanced', isPrimary: false },
    ],
  },
  {
    category: 'Backend Development',
    description: 'Server architectures, RESTful APIs, and asynchronous background services.',
    skills: [
      { name: 'Node.js', level: 'Advanced', isPrimary: true },
      { name: 'Express.js', level: 'Advanced', isPrimary: true },
      { name: 'FastAPI', level: 'Proficient', isPrimary: true },
      { name: 'RESTful API Design', level: 'Advanced', isPrimary: true },
      { name: 'Authentication (JWT/OAuth)', level: 'Proficient', isPrimary: false },
    ],
  },
  {
    category: 'Databases',
    description: 'Relational and non-relational database design, query optimization, and schema modeling.',
    skills: [
      { name: 'PostgreSQL', level: 'Advanced', isPrimary: true },
      { name: 'MySQL', level: 'Proficient', isPrimary: true },
      { name: 'MongoDB', level: 'Proficient', isPrimary: false },
      { name: 'Redis', level: 'Intermediate', isPrimary: false },
      { name: 'Database Normalization', level: 'Advanced', isPrimary: false },
    ],
  },
  {
    category: 'Development Tools',
    description: 'Developer tooling, version control, containerization, and deployment workflows.',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced', isPrimary: true },
      { name: 'Docker', level: 'Intermediate', isPrimary: true },
      { name: 'Postman', level: 'Advanced', isPrimary: false },
      { name: 'Linux / Bash', level: 'Proficient', isPrimary: false },
      { name: 'VS Code', level: 'Expert', isPrimary: false },
      { name: 'Vercel / Cloud Deploy', level: 'Advanced', isPrimary: true },
    ],
  },
];
