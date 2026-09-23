// -----------------------------------------------------------------------------
// Portfolio data — DERIVED, do not hand-edit content here.
//   • Resume text        -> Omid_Badkoubeh_Resume.md   (single source of truth)
//   • Presentation extras -> src/data/site.ts
// This module parses the Markdown at build time and adapts it to the shapes the
// UI components consume, so editing the Markdown updates the whole site.
// -----------------------------------------------------------------------------

import resumeMd from '../../Omid_Badkoubeh_Resume.md?raw';
import { parseResume } from '../lib/resume';
import { siteConfig } from './site';

const resume = parseResume(resumeMd);

export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

const socials: SocialLink[] = [];
const github = resume.contact.links.find((l) => l.kind === 'github');
if (github) socials.push({ icon: 'github', label: 'GitHub', href: github.href });
const linkedin = resume.contact.links.find((l) => l.kind === 'linkedin');
if (linkedin) socials.push({ icon: 'linkedin', label: 'LinkedIn', href: linkedin.href });
if (resume.contact.email) {
  socials.push({ icon: 'mail', label: 'Email', href: `mailto:${resume.contact.email}` });
}
socials.push(...siteConfig.extraSocials);

export const profile = {
  name: resume.name,
  role: resume.role,
  tagline: siteConfig.tagline,
  location: resume.contact.location ?? 'Remote',
  available: siteConfig.available,
  availabilityLabel: siteConfig.availabilityLabel,
  email: resume.contact.email ?? '',
  resumeUrl: siteConfig.resumeUrl,
  socials,
};

export const nav = siteConfig.nav;
export const stats = siteConfig.stats;

export const about = {
  headline: siteConfig.aboutHeadline,
  paragraphs: [resume.summary],
  focus: siteConfig.focus,
};

export const experience = resume.experience.map((job) => ({
  role: job.role,
  company: job.company,
  period: job.period,
  location: job.location,
  highlights: job.highlights,
  stack: siteConfig.techByCompany[job.company],
}));

export const projects = resume.projects.map((project) => {
  const meta = siteConfig.projectMeta[project.name];
  return {
    name: project.name,
    tagline: project.meta ?? 'Project',
    description: project.highlights.join(' '),
    tags: meta?.tags ?? [],
    href: meta?.href,
    repo: meta?.repo,
    status: project.status,
  };
});

export const skills = resume.skills;

export const education = resume.education.map((entry) => ({
  credential: entry.credential,
  institution: entry.institution,
  period: entry.period,
}));
