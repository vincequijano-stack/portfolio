export interface EventStory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  location: string;
  date: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export const eventStories: EventStory[] = [
  {
    id: 'cryptita-workshop',
    title: 'Cryptita Plays: Builders Workshop',
    subtitle: 'Smart Contract to Website: Build & Deploy',
    image: '/assets/images/event/Cryptita-Workshop.jpg',
    tag: 'Web3 & Builder Workshop',
    location: 'BFC Biñan, Laguna',
    date: 'October 2026',
    description: 'Hands-on builder workshop on smart contracts and Web3 website deployment with Cryptita Plays, DEVCON Laguna Chapter, Grantix, and Kamiyon Studio.',
    ctaText: 'Visit Live Workshop Website',
    ctaLink: 'https://quijano-cryptitaplays-builder-works-delta.vercel.app/',
  },
  {
    id: 'devcon-kids',
    title: 'DEVCON Kids Roadshow',
    subtitle: 'Micro:bit Robotics Learning Program',
    image: '/assets/images/event/DEVCON-KIDS.jpg',
    tag: 'Community & Robotics Program',
    location: 'Rose of Sharon House of Blessing, Bay, Laguna',
    date: 'July 31, 2026',
    description: 'Empowering young minds through technology and innovation with DEVCON Laguna Chapter.',
    ctaText: 'View Organization',
  },
];
