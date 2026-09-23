// -----------------------------------------------------------------------------
// Node-side resume access (used by scripts/build-resume.ts only — never imports
// astro:content). Loads + validates the YAML SOT and renders it back to
// Markdown, so the PDF and the downloadable .md are both derived from the data.
// -----------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { resumeSchema, type Resume } from '../schemas/resume.ts';

export function loadResume(path: string): Resume {
  return resumeSchema.parse(parseYaml(readFileSync(path, 'utf8')));
}

export function resumeToMarkdown(resume: Resume): string {
  const contact = [
    `[${resume.email}](mailto:${resume.email})`,
    ...resume.links.map((l) => `[${l.label}](${l.href})`),
    resume.location,
  ]
    .filter(Boolean)
    .join(' | ');

  const out: string[] = [
    `# ${resume.name}`,
    '',
    resume.role,
    '',
    contact,
    '',
    '## Professional Summary',
    '',
    resume.summary,
    '',
    '## Technical Skills',
    '',
    ...resume.skills.map((g) => `- ${g.title}: ${g.items.join(', ')}`),
    '',
    '## Professional Experience',
    '',
  ];

  for (const job of resume.experience) {
    const meta = [job.period, job.location].filter(Boolean).join(' | ');
    out.push(`### ${job.role} — ${job.company}`, '', meta, '');
    out.push(...job.highlights.map((h) => `- ${h}`), '');
  }

  if (resume.projects.length) {
    out.push('## Projects', '');
    for (const project of resume.projects) {
      const title =
        `### ${project.name}` +
        (project.meta ? ` — ${project.meta}` : '') +
        (project.status ? ` (${project.status})` : '');
      out.push(title, '');
      out.push(...project.highlights.map((h) => `- ${h}`), '');
    }
  }

  out.push('## Education', '');
  for (const edu of resume.education) {
    out.push(`### ${edu.credential}`, '', `${edu.institution} — ${edu.period}`, '');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
