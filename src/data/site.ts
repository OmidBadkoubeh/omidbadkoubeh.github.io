// -----------------------------------------------------------------------------
// Presentation config — the site "chrome" that is NOT part of the resume text.
// Resume content itself lives in Omid_Badkoubeh_Resume.md (single source of
// truth). Tune hero copy, stats, nav, and per-entry visual extras here.
// -----------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ProjectMeta {
  tags: string[];
  href?: string;
  repo?: string;
}

export const siteConfig = {
  resumeUrl: '/resume.pdf',
  available: true,
  availabilityLabel: 'Open to opportunities',

  tagline:
    'I build high-performance web & mobile products — from 10M-node WebGL data viz to full-stack TypeScript.',

  aboutHeadline: 'Senior frontend engineer who ships fast, scalable interfaces.',

  focus: [
    'Frontend architecture',
    'Data viz — WebGL / Three.js',
    'Design systems & monorepos',
    'Full-stack TypeScript',
  ],

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ] satisfies NavItem[],

  stats: [
    { value: '7+', label: 'Years experience' },
    { value: '10M', label: 'Nodes @ 60fps' },
    { value: '95+', label: 'Core Web Vitals' },
  ] satisfies Stat[],

  // Optional social links not present in the resume contact line.
  extraSocials: [] as { icon: string; label: string; href: string }[],

  // Tech chips per company (keyed by the exact company name parsed from the md).
  techByCompany: {
    'Corvic / Codaze': ['Next.js', 'tRPC', 'Three.js', 'WebGL', 'Monorepo', 'Jest'],
    Embark: ['Next.js', 'Wagmi', 'Viem', 'WalletConnect', 'TailwindCSS'],
    Youtopin: ['React Native Web', 'Fastlane', 'Docker', 'CI/CD', 'Cypress'],
    Bakoot: ['React Native', 'React', 'Next.js', 'Leaflet', 'OpenStreetMap'],
  } as Record<string, string[]>,

  // Visual extras per project (keyed by the exact project name parsed from the md).
  projectMeta: {
    'Full-Stack TypeScript Application': {
      tags: ['Bun', 'Hono', 'tRPC', 'Drizzle', 'Next.js'],
      repo: 'https://github.com/OmidBadkoubeh',
    },
  } as Record<string, ProjectMeta>,
};
