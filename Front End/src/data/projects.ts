export interface Project {
  id: string;
  title: string;
  category: 'Web Development' | 'UI/UX Design' | 'Programming' | 'Database Systems' | 'Academic Projects';
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
  'Programming',
  'Database Systems',
  'Academic Projects',
] as const;

export type CategoryType = typeof categoryList[number];

export const projectsData: Project[] = [
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    category: 'Web Development',
    categories: ['Web Development', 'UI/UX Design'],
    thumbnail: '/assets/images/projects/project-portfolio.svg',
    description: 'Instagram-inspired personal developer portfolio website with interactive project cards, live search, and story highlights.',
    longDescription: 'A modern, responsive portfolio designed specifically for Computer Science students and web developers. Inspired by desktop social profiles, it translates social media interaction paradigms (story highlights, photo grid, post lightbox modal) into a clean showcase for code repositories, academic credentials, and software engineering capabilities.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide React'],
    features: [
      'Interactive Instagram-inspired profile layout with story highlights',
      'Dynamic real-time project search filtering by title, stack, and category',
      'Two-column post lightbox modal with full architectural breakdown',
      'Responsive design adapting across desktop, tablet, and mobile views',
      'Full credentials gallery with verified PDF certificate previews'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'OCTOBER 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/personal-portfolio',
    stats: { label: 'Perf Score', value: '100 Lighthouse' }
  },
  {
    id: 'product-recommendation-system',
    title: 'Product Recommendation System',
    category: 'Programming',
    categories: ['Programming', 'Academic Projects'],
    thumbnail: '/assets/images/projects/project-5.jpg',
    description: 'Machine learning recommendation engine utilizing collaborative filtering and matrix factorization (SVD).',
    longDescription: 'An end-to-end recommendation engine developed using Python, Scikit-Learn, and FastAPI. It processes customer transaction logs and rating matrices to calculate cosine similarity and singular value decomposition (SVD) embeddings, serving low-latency item recommendations for e-commerce platforms.',
    technologies: ['Python', 'Scikit-Learn', 'FastAPI', 'Pandas', 'NumPy'],
    features: [
      'Hybrid collaborative and content-based filtering algorithms',
      'Cosine similarity matrix caching with Redis for sub-50ms query time',
      'Evaluation pipeline calculating RMSE, Precision@K, and Recall@K',
      'RESTful endpoints ready for integration into web storefronts'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'SEPTEMBER 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/product-recommender-ml',
    stats: { label: 'Inference', value: '< 45ms avg' }
  },
  {
    id: 'association-rule-mining',
    title: 'Association Rule Mining Dashboard',
    category: 'Academic Projects',
    categories: ['Academic Projects', 'Database Systems', 'Programming'],
    thumbnail: '/assets/images/projects/project-arm.svg',
    description: 'Interactive data mining dashboard analyzing transactional market baskets with Apriori and FP-Growth algorithms.',
    longDescription: 'An academic data mining visualizer built to uncover hidden buying patterns in supermarket transaction logs. The platform executes Apriori and FP-Growth itemset algorithms, providing interactive network graphs of item co-occurrences along with support, confidence, and lift metrics.',
    technologies: ['Python', 'Apriori', 'FP-Growth', 'D3.js', 'Streamlit', 'Pandas'],
    features: [
      'Configurable minimum support (s) and confidence (c) thresholds',
      'Force-directed D3.js node graph displaying association rules',
      'Frequent itemset table with instant search and CSV export',
      'Optimized itemset candidate generation reducing memory footprint'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'AUGUST 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/association-rule-mining-dashboard',
    stats: { label: 'Dataset', value: '120K Transactions' }
  },
  {
    id: 'student-management-system',
    title: 'Student Management System',
    category: 'Database Systems',
    categories: ['Database Systems', 'Academic Projects'],
    thumbnail: '/assets/images/projects/project-sms.svg',
    description: 'Comprehensive academic administration system for course enrollment, grading, and attendance tracking.',
    longDescription: 'An enterprise-grade academic management system designed with Java Spring Boot and PostgreSQL. Supports role-based access control (Admin, Professor, Student), automated semester schedule collision detection, real-time GPA calculations, and student attendance reporting.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Tailwind CSS'],
    features: [
      'Normalized 3NF relational schema with ACID transaction guarantees',
      'Role-based access control (RBAC) with JWT authentication',
      'Course enrollment prerequisite validation engine',
      'Automated transcript generation and attendance telemetry charts'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'JULY 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/student-management-system',
    stats: { label: 'DB Schema', value: '18 Relations (3NF)' }
  },
  {
    id: 'database-management-portal',
    title: 'Database Management Project',
    category: 'Database Systems',
    categories: ['Database Systems', 'Web Development'],
    thumbnail: '/assets/images/projects/project-4.jpg',
    description: 'Aurora REST API & database explorer with query profiling, migration tooling, and interactive docs.',
    longDescription: 'A developer-centric database portal built on top of Express.js and PostgreSQL. Features interactive query inspection, automated indexing recommendations based on EXPLAIN ANALYZE traces, connection pooling benchmarks, and OpenAPI documentation.',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'OpenAPI'],
    features: [
      'Interactive API console with live curl/Node.js/Python code generators',
      'PostgreSQL connection pool management with pg-pool',
      'Automated database migration scripts with rollback support',
      'Containerized development environment orchestrated with Docker Compose'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'JUNE 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/database-dev-portal',
    stats: { label: 'Uptime', value: '99.98%' }
  },
  {
    id: 'ui-ux-mobile-app',
    title: 'UI/UX Mobile App Design',
    category: 'UI/UX Design',
    categories: ['UI/UX Design', 'Web Development'],
    thumbnail: '/assets/images/projects/project-3.jpg',
    description: 'Aura Fitness wellness mobile application with dynamic telemetry rings and human-centered design.',
    longDescription: 'A mobile health and workout tracking application interface crafted with Figma and implemented with React Native. Emphasizes visual hierarchy, accessible color contrast (WCAG AAA), haptic micro-interactions, and frictionless activity logging.',
    technologies: ['Figma', 'React Native', 'Tailwind CSS', 'Mobile UI', 'Expo'],
    features: [
      'Comprehensive design system with typography, color ramps, and icon tokens',
      'Interactive telemetry rings showing caloric burn and daily progress',
      'Gamified streak tracking and custom achievement badges',
      'Dark mode primary palette with high contrast readability'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'MAY 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/aura-fitness-mobile-ui',
    stats: { label: 'Rating', value: '4.9 / 5.0' }
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Website',
    category: 'Web Development',
    categories: ['Web Development'],
    thumbnail: '/assets/images/projects/project-2.jpg',
    description: 'High-performance storefront with headless CMS, faceted filters, cart persistence, and Stripe checkout.',
    longDescription: 'Urban Collective is a full-featured apparel e-commerce web platform built with Next.js and Tailwind CSS. Offers server-side rendering for optimal SEO, optimistic cart updates, faceted search filtering, and end-to-end checkout integration with Stripe.',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Stripe API', 'Node.js'],
    features: [
      'Instant search and faceted multi-category filter bar',
      'Stripe checkout integration with webhook order fulfillment',
      'Responsive product gallery with zoom previews and stock indicators',
      'Persistent shopping cart stored in client LocalStorage and synchronized on login'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'APRIL 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/urban-collective-ecommerce',
    stats: { label: 'Performance', value: '98 Speed Index' }
  },
  {
    id: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    category: 'Web Development',
    categories: ['Web Development', 'Academic Projects'],
    thumbnail: '/assets/images/projects/project-1.jpg',
    description: 'Real-time analytics dashboard delivering visual insights on user conversion rates and server telemetry.',
    longDescription: 'DataFlow Analytics is a comprehensive business intelligence dashboard displaying live metric trends, acquisition breakdowns, and active user counters. Features smooth chart transitions, time-series zoom controls, and exportable report summaries.',
    technologies: ['React', 'Chart.js', 'Tailwind CSS', 'Node.js', 'REST API'],
    features: [
      'Interactive area and donut charts tracking visitor metrics and MRR',
      'Custom date range selector with dynamic aggregation',
      'Responsive multi-column bento grid layout',
      'Light and dark mode theme switching support'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'MARCH 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/dataflow-analytics-dashboard',
    stats: { label: 'Active Users', value: '58.4K tracked' }
  },
  {
    id: 'programming-fundamentals',
    title: 'Programming Fundamentals Project',
    category: 'Programming',
    categories: ['Programming', 'Academic Projects'],
    thumbnail: '/assets/images/projects/project-prog.svg',
    description: 'Algorithms and Data Structures visualizer covering AVL trees, QuickSort, and algorithmic complexity.',
    longDescription: 'An interactive Computer Science educational visualizer built in C++ and compiled with WebAssembly. Demonstrates step-by-step memory operations, AVL tree rotations, binary search partitions, and Big-O computational bounds in real time.',
    technologies: ['C++', 'Algorithms', 'Data Structures', 'WebAssembly', 'Canvas API'],
    features: [
      'Self-balancing AVL tree visualization with single and double rotation animations',
      'Interactive QuickSort and MergeSort step-by-step array partitioning',
      'Live operation counter showing exact comparisons, swaps, and recursion depth',
      'Accompanying complexity matrix comparing time and space bounds'
    ],
    likes: 0,
    commentsCount: 0,
    postedDate: 'FEBRUARY 2026',
    demoUrl: '#',
    githubUrl: 'https://github.com/vincequijano/cs-algolab-fundamentals',
    stats: { label: 'Structures', value: '12 Visualized' }
  }
];
