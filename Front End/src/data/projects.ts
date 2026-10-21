export interface Project {
  id: string;
  title: string;
  category: 'Web Development' | 'UI/UX Design';
  categories: string[];
  thumbnail: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  likes: number;
  commentsCount: number;
  postedDate: string;
  demoUrl?: string;
  githubUrl?: string;
  stats?: {
    label: string;
    value: string;
  };
}

export const categoryList = [
  'All Projects',
  'Web Development',
  'UI/UX Design',
] as const;

export type CategoryType = typeof categoryList[number];

export const projectsData: Project[] = [
  {
    id: 'cobuy-pattern-mining',
    title: 'CoBuy — Buying Pattern Mining System',
    category: 'Web Development',
    categories: ['Web Development', 'UI/UX Design'],
    thumbnail: '/assets/images/projects/co-buy-preview.png',
    description: 'Undergraduate thesis system empowering small retail businesses to discover purchasing patterns and optimize merchandising using Association Rule Mining (Apriori & FP-Growth algorithms).',
    longDescription: 'CoBuy is an undergraduate thesis web application and analytics platform designed to help small retail businesses make data-driven merchandising decisions. By applying Association Rule Mining algorithms (Apriori and FP-Growth), CoBuy analyzes historical transaction datasets (CSV & Excel) to reveal customer purchasing patterns, compute essential retail metrics (Support, Confidence, and Lift), and deliver actionable recommendations for product bundling, promotional campaigns, and store shelf layouts. Features an interactive association network graph explorer and secure, offline-friendly client-side processing.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Association Rule Mining', 'Apriori Algorithm', 'FP-Growth', 'Data Analytics', 'Netlify'],
    features: [
      'Association Rule Mining powered by Apriori & FP-Growth algorithms',
      'Retail metrics computation: Support, Confidence, and Lift calculations',
      'Interactive Association Explorer with dynamic node & link graph visualization',
      'Automated retail recommendations for product bundling & shelf placement',
      'Historical transaction dataset upload supporting CSV and Excel formats',
      'Offline-friendly client-side transaction processing tailored for retail MSMEs'
    ],
    likes: 18,
    commentsCount: 0,
    postedDate: 'OCTOBER 2026',
    demoUrl: 'https://co-buy.netlify.app/',
    githubUrl: 'https://github.com/vincequijano-stack',
    stats: { label: 'Thesis Project', value: 'BSCS Capstone' }
  },
  {
    id: 'cryptita-plays-builder-workshop',
    title: 'Cryptita Plays — Builder Workshop',
    category: 'Web Development',
    categories: ['Web Development', 'UI/UX Design'],
    thumbnail: '/assets/images/projects/cryptita-plays.png',
    description: 'Interactive builder card showcase and proof of learning application built during the Cryptita Plays workshop at BFC Biñan.',
    longDescription: 'An interactive web application developed during the Cryptita Plays Builder Workshop 2026 at BFC Biñan. The platform showcases Vince Quijano as Builder #14, presenting proof of learning & building with immutable on-chain verification on Sui Mainnet, 3D interactive controls, and integration with DEVCON Laguna.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Sui Mainnet', 'Vercel'],
    features: [
      'Interactive 3D Builder Card with camera & spin controls',
      'Proof of Learning & Building on-chain data verification',
      'Community recognition with DEVCON Laguna & DEVCON Kids',
      'Direct social sharing integration across X, Facebook, LinkedIn, and Instagram',
      'Built during the hands-on Cryptita Plays Workshop at BFC Biñan'
    ],
    likes: 14,
    commentsCount: 0,
    postedDate: 'AUGUST 2026',
    demoUrl: 'https://quijano-cryptitaplays-builder-works-delta.vercel.app/',
    githubUrl: 'https://github.com/vincequijano-stack',
    stats: { label: 'Builder', value: '#14 BFC Biñan' }
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    category: 'Web Development',
    categories: ['Web Development', 'UI/UX Design'],
    thumbnail: '/assets/images/projects/portfolio-preview.png',
    description: 'Instagram-inspired personal developer portfolio website with interactive story highlights, real-time status note, and full responsive multi-device design.',
    longDescription: 'A custom personal developer portfolio engineered with React, TypeScript, and Vite, inspired by social media desktop and mobile layouts. Features interactive story highlight modals, real-time editable status notes, filterable category tabs, credentials preview gallery, and responsive themes.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide React'],
    features: [
      'Interactive Instagram-inspired profile UI with live story highlights',
      'Real-time editable status note with local persistence',
      'Category tabs filtering across Web Development and UI/UX projects',
      'Light and Dark mode support with smooth transitions',
      'Fully responsive across smartphones, tablets, and desktop displays',
      'Client review and feedback rating modal'
    ],
    likes: 28,
    commentsCount: 0,
    postedDate: 'OCTOBER 2026',
    demoUrl: 'https://vincequijano-portfolio-weld.vercel.app/',
    githubUrl: 'https://github.com/vincequijano-stack/portfolio',
    stats: { label: 'Platform', value: 'Vite + React' }
  },
];
