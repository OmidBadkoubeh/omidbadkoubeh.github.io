// -----------------------------------------------------------------------------
// Resume schema — the single validated shape of resume content.
// Shared by the Astro content collection (src/content.config.ts) and the
// Node build scripts (scripts/build-resume.ts), so website, PDF, and Markdown
// all derive from one validated structure. Zod v4 (matches Astro's zod).
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
  kind: z.enum(['email', 'github', 'linkedin', 'website', 'other']).default('other'),
});

export const skillGroupSchema = z.object({
  title: z.string(),
  items: z.array(z.string()).min(1),
});

export const experienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  location: z.string().optional(),
  highlights: z.array(z.string()).min(1),
  stack: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  name: z.string(),
  meta: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).default([]),
  href: z.url().optional(),
  repo: z.url().optional(),
  highlights: z.array(z.string()).min(1),
});

export const educationSchema = z.object({
  credential: z.string(),
  institution: z.string(),
  period: z.string(),
});

export const resumeSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string().optional(),
  email: z.email(),
  links: z.array(linkSchema).default([]),
  summary: z.string(),
  skills: z.array(skillGroupSchema).min(1),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
});

export type ResumeLink = z.infer<typeof linkSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type ExperienceEntry = z.infer<typeof experienceSchema>;
export type ProjectEntry = z.infer<typeof projectSchema>;
export type EducationEntry = z.infer<typeof educationSchema>;
export type Resume = z.infer<typeof resumeSchema>;
