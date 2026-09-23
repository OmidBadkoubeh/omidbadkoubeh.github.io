// -----------------------------------------------------------------------------
// Presentation config — the site "chrome" that is NOT part of the resume text.
// Resume content itself lives in src/data/resume.yaml (single source of truth).
// -----------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SocialConfig {
  icon: string;
  label: string;
  href: string;
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

  // Social links not present in the resume contact line (e.g. X, personal site).
  extraSocials: [] as SocialConfig[],
};
