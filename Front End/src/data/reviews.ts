export interface ClientReview {
  id: string;
  rating: number;
  name: string;
  role?: string;
  feedback: string;
  createdAt: string;
  timestamp: number;
  hidden?: boolean;
}

export const DEFAULT_REVIEWS: ClientReview[] = [
  {
    id: 'rev_raziel_sevilla',
    rating: 5,
    name: 'Raziel Sevilla',
    role: 'Client / Collaborator',
    feedback:
      'If Vince is on your team, you can breathe easy. Unmatched reliability, zero friction, and consistent, high-quality execution every single time.',
    createdAt: '2026-10-26T15:45:00.000Z',
    timestamp: 1793029500000,
  },
  {
    id: 'rev_1793029406291_6ece00c99e',
    rating: 5,
    name: 'Kier',
    role: 'Client',
    feedback: 'He helps me create a design for our website.',
    createdAt: '2026-10-26T15:43:26.291Z',
    timestamp: 1793029406291,
  },
  {
    id: 'rev_ezon',
    rating: 5,
    name: 'Ezon',
    role: 'Groupmate',
    feedback: 'solved my problem in our capstone system',
    createdAt: '2026-10-26T15:40:00.000Z',
    timestamp: 1793029200000,
  },
];
