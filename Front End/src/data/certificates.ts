export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  pdfUrl?: string;
  badgeColor: string;
  tag: string;
  credentialId?: string;
  description: string;
  skillsCovered: string[];
}

export const certificatesData: Certificate[] = [
  {
    id: 'ai-fluency',
    title: 'AI Fluency Certification',
    issuer: 'Certiport',
    date: 'August 2026',
    pdfUrl: '/assets/images/certificates/AI-Fluency.pdf',
    badgeColor: '#7C3AED',
    tag: 'Artificial Intelligence',
    credentialId: 'CP-AI-90214',
    description: 'Comprehensive industry examination covering generative AI foundations, prompt engineering, ethics in autonomous systems, and modern AI application workflows.',
    skillsCovered: ['AI Fundamentals', 'Prompt Engineering', 'Model Ethics', 'LLM Integration'],
  },
  {
    id: 'claude-101',
    title: 'Claude 101: Foundation and Capabilities',
    issuer: 'Anthropic',
    date: 'August 2026',
    pdfUrl: '/assets/images/certificates/Claude-101.pdf',
    badgeColor: '#D97706',
    tag: 'LLMs & AI Systems',
    credentialId: 'ANT-CL-10182',
    description: 'Foundations of Anthropic Claude architecture, constitutional AI paradigms, multi-turn tool use, context window optimization, and prompt structuring.',
    skillsCovered: ['Claude Architecture', 'Tool Use', 'Structured Output', 'Constitutional AI'],
  },
  {
    id: 'software-engineering-python',
    title: 'Software Engineering Principles in Python',
    issuer: 'Coursera & DeepLearning.AI',
    date: 'July 2026',
    pdfUrl: '/assets/images/certificates/Software-Engineering-Python.pdf',
    badgeColor: '#0EA5E9',
    tag: 'Python · Software Engineering',
    credentialId: 'COUR-PY-55421',
    description: 'Mastery of object-oriented design patterns, modular code architecture, automated testing suites (pytest), documentation standards, and versioned package delivery.',
    skillsCovered: ['OOP in Python', 'Unit Testing', 'Clean Architecture', 'Refactoring'],
  },
  {
    id: 'database-systems-honor',
    title: 'Relational Database Design & SQL Honor',
    issuer: 'University Academic Department',
    date: 'May 2026',
    badgeColor: '#059669',
    tag: 'Academic Distinction',
    credentialId: 'ACAD-CS310-DIST',
    description: 'Academic recognition for excellence in relational database modeling, normalization up to BCNF, advanced SQL query optimization, and transaction concurrency.',
    skillsCovered: ['Database Normalization', 'Query Profiling', 'PostgreSQL', 'ACID Transactions'],
  },
];
