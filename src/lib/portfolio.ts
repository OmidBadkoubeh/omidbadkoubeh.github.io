// -----------------------------------------------------------------------------
// Website view-model — adapts the validated resume (from the content collection)
// plus presentation config into the shapes the UI components render.
// Astro-only (imports astro:content); Node scripts must not import this.
// -----------------------------------------------------------------------------

import { getEntry } from 'astro:content';
import { siteConfig, type NavItem, type Stat } from '../data/site';
import type {
  Resume,
  ResumeLink,
  ExperienceEntry,
  SkillGroup,
  EducationEntry,
} from '../schemas/resume';

export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface ProfileView {
  name: string;
  role: string;
  tagline: string;
  location: string;
  available: boolean;
  availabilityLabel: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface AboutView {
  headline: string;
  paragraphs: string[];
  focus: string[];
}

export interface ProjectView {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
  status?: string;
}

export interface Portfolio {
  profile: ProfileView;
  nav: NavItem[];
  stats: Stat[];
  about: AboutView;
  experience: ExperienceEntry[];
  projects: ProjectView[];
  skills: SkillGroup[];
  education: EducationEntry[];
}

const ICON_BY_KIND: Record<ResumeLink['kind'], string> = {
  github: 'github',
  linkedin: 'linkedin',
  website: 'globe',
  email: 'mail',
  other: 'globe',
};

export function buildPortfolio(resume: Resume): Portfolio {
  const socials: SocialLink[] = resume.links.map((l) => ({
    icon: ICON_BY_KIND[l.kind],
    label: l.label,
    href: l.href,
  }));
  socials.push({ icon: 'mail', label: 'Email', href: `mailto:${resume.email}` });
  socials.push(...siteConfig.extraSocials);

  return {
    profile: {
      name: resume.name,
      role: resume.role,
      tagline: siteConfig.tagline,
      location: resume.location ?? 'Remote',
      available: siteConfig.available,
      availabilityLabel: siteConfig.availabilityLabel,
      email: resume.email,
      resumeUrl: siteConfig.resumeUrl,
      socials,
    },
    nav: siteConfig.nav,
    stats: siteConfig.stats,
    about: {
      headline: siteConfig.aboutHeadline,
      paragraphs: [resume.summary],
      focus: siteConfig.focus,
    },
    experience: resume.experience,
    projects: resume.projects.map((p) => ({
      name: p.name,
      tagline: p.meta ?? 'Project',
      description: p.highlights.join(' '),
      tags: p.tags,
      href: p.href,
      repo: p.repo,
      status: p.status,
    })),
    skills: resume.skills,
    education: resume.education,
  };
}

export async function getPortfolio(): Promise<Portfolio> {
  const entry = await getEntry('resume', 'resume');
  if (!entry) throw new Error('Resume content entry not found');
  return buildPortfolio(entry.data);
}
