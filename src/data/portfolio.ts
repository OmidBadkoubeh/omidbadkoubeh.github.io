// -----------------------------------------------------------------------------
// PORTFOLIO CONTENT — edit this file to populate the site.
// Everything the UI renders comes from here, so you never touch markup to
// update your resume. Replace the placeholder copy with your real details.
// -----------------------------------------------------------------------------

export interface SocialLink {
  /** Icon key defined in src/components/Icon.astro */
  icon: 'github' | 'linkedin' | 'x' | 'mail' | 'globe';
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  stack?: string[];
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
  /** Optional status chip, e.g. "Live", "WIP", "Archived" */
  status?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface EducationEntry {
  credential: string;
  institution: string;
  period: string;
  detail?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const profile = {
  name: 'Omid Badkoubeh',
  role: 'Software Engineer',
  /** Short, punchy positioning line shown under the name. */
  tagline: 'I design and build fast, resilient systems for the web.',
  location: 'Remote',
  available: true,
  availabilityLabel: 'Available for new work',
  email: 'you@example.com',
  resumeUrl: '/resume.pdf',
  socials: [
    { icon: 'github', label: 'GitHub', href: 'https://github.com/OmidBadkoubeh' },
    { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
    { icon: 'x', label: 'X', href: 'https://x.com/your-handle' },
    { icon: 'mail', label: 'Email', href: 'mailto:you@example.com' },
  ] satisfies SocialLink[],
};

export const nav: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const stats: Stat[] = [
  { value: '8+', label: 'Years building' },
  { value: '40+', label: 'Projects shipped' },
  { value: '12', label: 'Open-source repos' },
];

export const about = {
  headline: 'Engineer focused on performance, clarity, and craft.',
  paragraphs: [
    'I build products end to end — from data models and APIs to the pixels users touch. I care about systems that stay fast under load and codebases that stay readable six months later.',
    'Recently I have been working across TypeScript, Node, and edge runtimes, with a growing interest in developer tooling and interface systems that make complex data feel simple.',
  ],
  focus: ['Web performance', 'Design systems', 'Developer tooling', 'Distributed systems'],
};

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Company Name',
    period: '2022 — Present',
    location: 'Remote',
    summary: 'Lead engineer on the core platform team, owning performance and DX.',
    highlights: [
      'Cut p95 API latency by 45% by redesigning the caching and query layer.',
      'Shipped a component system adopted across 5 product teams.',
      'Mentored 4 engineers and drove the migration to a typed end-to-end stack.',
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
  },
  {
    role: 'Software Engineer',
    company: 'Previous Company',
    period: '2019 — 2022',
    location: 'Hybrid',
    summary: 'Full-stack engineer across web app, APIs, and infrastructure.',
    highlights: [
      'Built the real-time notifications service handling 2M+ events/day.',
      'Introduced CI/CD and cut deploy time from 30 min to under 4 min.',
    ],
    stack: ['React', 'Go', 'Kubernetes', 'GCP'],
  },
];

export const projects: Project[] = [
  {
    name: 'Project Aurora',
    tagline: 'Real-time analytics dashboard',
    description:
      'A streaming analytics interface with sub-second updates, virtualized tables, and a composable widget system.',
    tags: ['TypeScript', 'WebSockets', 'Charts'],
    href: 'https://example.com',
    repo: 'https://github.com/OmidBadkoubeh',
    status: 'Live',
  },
  {
    name: 'Nimbus CLI',
    tagline: 'Zero-config deploy tool',
    description:
      'A developer CLI that provisions infrastructure and ships static + edge apps with a single command.',
    tags: ['Node.js', 'DX', 'Infra'],
    repo: 'https://github.com/OmidBadkoubeh',
    status: 'Open source',
  },
  {
    name: 'Vector UI',
    tagline: 'Headless component library',
    description:
      'Accessible, unstyled primitives with a token-driven theming layer and full keyboard support.',
    tags: ['a11y', 'Design systems', 'React'],
    href: 'https://example.com',
    status: 'WIP',
  },
];

export const skills: SkillGroup[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL'] },
  { title: 'Frontend', items: ['Astro', 'React', 'Vue', 'CSS Architecture', 'Web Perf'] },
  { title: 'Backend', items: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'REST'] },
  { title: 'Platform', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Observability'] },
];

export const education: EducationEntry[] = [
  {
    credential: 'B.Sc. Computer Science',
    institution: 'Your University',
    period: '2015 — 2019',
    detail: 'Focus on distributed systems and human-computer interaction.',
  },
];
