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

// 1. Curated metadata registry for known events
const knownEventMeta: Record<string, Partial<EventStory>> = {
  'cryptita-workshop': {
    title: 'Cryptita Plays: Builders Workshop',
    subtitle: 'Smart Contract to Website: Build & Deploy',
    tag: 'Web3 & Builder Workshop',
    location: 'BFC Biñan, Laguna',
    date: 'October 2026',
    description: 'Hands-on builder workshop on smart contracts and Web3 website deployment with Cryptita Plays, DEVCON Laguna Chapter, Grantix, and Kamiyon Studio.',
    ctaText: 'Visit Live Workshop Website',
    ctaLink: 'https://quijano-cryptitaplays-builder-works-delta.vercel.app/',
  },
  'devcon-kids': {
    title: 'DEVCON Kids Roadshow',
    subtitle: 'Micro:bit Robotics Learning Program',
    tag: 'Community & Robotics Program',
    location: 'Rose of Sharon House of Blessing, Bay, Laguna',
    date: 'July 31, 2026',
    description: 'Empowering young minds through technology and innovation with DEVCON Laguna Chapter.',
    ctaText: 'View Organization',
  },
};

// Helper to format raw filenames into readable human titles
function formatFilenameToTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  return withoutExt
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// 2. Real-time dynamic Vite glob import:
// Automatically scans the root 'Photo/Event' directory for any image files (JPG, PNG, WEBP, GIF).
// Any image dropped into 'Photo/Event' is automatically detected and loaded in real time.
const rootPhotoModules = import.meta.glob<string>(
  '../../../Photo/Event/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

// Fallback / project assets glob in case images are placed inside Front End assets
const localPhotoModules = import.meta.glob<string>(
  '../../assets/images/event/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

// Merge all discovered event photos (keyed by clean filename so duplicates aren't repeated)
const photosMap = new Map<string, string>();

for (const [path, url] of Object.entries(rootPhotoModules)) {
  const filename = path.split('/').pop() || '';
  if (filename) photosMap.set(filename, url);
}

for (const [path, url] of Object.entries(localPhotoModules)) {
  const filename = path.split('/').pop() || '';
  if (filename && !photosMap.has(filename)) {
    photosMap.set(filename, url);
  }
}

// Build dynamic eventStories array
export const eventStories: EventStory[] = Array.from(photosMap.entries()).map(
  ([filename, imageUrl]) => {
    const rawName = filename.replace(/\.[^/.]+$/, '');
    const cleanId = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const known = knownEventMeta[cleanId] || {};

    return {
      id: cleanId,
      title: known.title || formatFilenameToTitle(filename),
      subtitle: known.subtitle || 'Event & Workshop Highlight',
      image: imageUrl,
      tag: known.tag || 'Event Memory',
      location: known.location || 'Laguna, Philippines',
      date: known.date || 'Recent',
      description:
        known.description ||
        'Moments and highlights from events, workshops, and tech community involvement.',
      ctaText: known.ctaText,
      ctaLink: known.ctaLink,
    };
  }
);
