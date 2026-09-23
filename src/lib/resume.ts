// -----------------------------------------------------------------------------
// Resume markdown parser — the ONE place that understands the resume format.
// Both the website (src/data/portfolio.ts) and the PDF builder
// (scripts/build-resume.ts source the same Markdown file, so the Markdown is
// the single source of truth. Section matching is by heading text (order- and
// case-insensitive) so reordering the document does not break parsing.
// -----------------------------------------------------------------------------

export type LinkKind = 'email' | 'github' | 'linkedin' | 'website' | 'other';

export interface ResumeLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface ResumeContact {
  email?: string;
  location?: string;
  links: ResumeLink[];
}

export interface ResumeSkillGroup {
  title: string;
  items: string[];
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface ResumeProject {
  name: string;
  meta?: string;
  status?: string;
  highlights: string[];
}

export interface ResumeEducation {
  credential: string;
  institution: string;
  period: string;
}

export interface Resume {
  name: string;
  role: string;
  contact: ResumeContact;
  summary: string;
  skills: ResumeSkillGroup[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Split on the first " — " / " – " / " - " separator (dash surrounded by spaces). */
function splitOnDash(value: string): [string, string] {
  const m = value.match(/\s+[—–-]\s+/);
  if (!m || m.index === undefined) return [value.trim(), ''];
  return [value.slice(0, m.index).trim(), value.slice(m.index + m[0].length).trim()];
}

function classifyLink(href: string): LinkKind {
  if (href.startsWith('mailto:')) return 'email';
  if (/github\.com/i.test(href)) return 'github';
  if (/linkedin\.com/i.test(href)) return 'linkedin';
  if (/^https?:/i.test(href)) return 'website';
  return 'other';
}

function parseContact(line: string): ResumeContact {
  const links: ResumeLink[] = [];
  let email: string | undefined;
  for (const [, label, href] of line.matchAll(LINK_RE)) {
    const kind = classifyLink(href);
    if (kind === 'email') email = href.replace(/^mailto:/, '');
    links.push({ label, href, kind });
  }
  // Any pipe-separated segment with no markdown link is treated as location text.
  let location: string | undefined;
  for (const seg of line.split('|')) {
    const text = seg.trim();
    if (text && !text.includes('](')) location = text;
  }
  return { email, location, links };
}

/** Group the lines of one "## Section" (excluding the heading itself). */
function sectionBlocks(md: string): Map<string, string[]> {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = new Map<string, string[]>();
  let current: string | null = '__preamble__';
  blocks.set(current, []);
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2 && !line.startsWith('###')) {
      current = h2[1].trim().toLowerCase();
      blocks.set(current, []);
      continue;
    }
    blocks.get(current!)!.push(line);
  }
  return blocks;
}

/** Split a block into "### Heading" entries → { heading, body[] }. */
function entries(block: string[]): { heading: string; body: string[] }[] {
  const out: { heading: string; body: string[] }[] = [];
  let cur: { heading: string; body: string[] } | null = null;
  for (const line of block) {
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      cur = { heading: h3[1].trim(), body: [] };
      out.push(cur);
    } else if (cur) {
      cur.body.push(line);
    }
  }
  return out;
}

const bullets = (body: string[]): string[] =>
  body
    .map((l) => l.match(/^\s*[-*]\s+(.*)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => m[1].trim());

const nonEmpty = (body: string[]): string[] => body.map((l) => l.trim()).filter(Boolean);

function findBlock(blocks: Map<string, string[]>, ...names: string[]): string[] {
  for (const name of names) {
    const hit = blocks.get(name);
    if (hit) return hit;
  }
  // Fuzzy: first section whose title contains any of the names.
  for (const [key, val] of blocks) {
    if (names.some((n) => key.includes(n))) return val;
  }
  return [];
}

export function parseResume(md: string): Resume {
  const blocks = sectionBlocks(md);
  const preamble = blocks.get('__preamble__') ?? [];

  // Name = first H1.
  const name = (preamble.find((l) => /^#\s+/.test(l)) ?? '# Unknown')
    .replace(/^#\s+/, '')
    .trim();

  // Role = first plain paragraph after H1; contact = first line with links/pipes.
  let role = '';
  let contactLine = '';
  let seenH1 = false;
  for (const raw of preamble) {
    const line = raw.trim();
    if (!line) continue;
    if (/^#\s+/.test(line)) {
      seenH1 = true;
      continue;
    }
    if (!seenH1) continue;
    const isLinkLine = line.includes('](') || line.includes('|');
    if (isLinkLine && !contactLine) contactLine = line;
    else if (!isLinkLine && !role) role = line;
  }

  const contact = parseContact(contactLine);

  const summary = nonEmpty(findBlock(blocks, 'professional summary', 'summary')).join(' ');

  const skills: ResumeSkillGroup[] = bullets(
    findBlock(blocks, 'technical skills', 'skills')
  ).map((item) => {
    const idx = item.indexOf(':');
    if (idx === -1) return { title: '', items: [item.trim()] };
    return {
      title: item.slice(0, idx).trim(),
      items: item
        .slice(idx + 1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
  });

  const experience: ResumeExperience[] = entries(
    findBlock(blocks, 'professional experience', 'experience', 'work experience')
  ).map(({ heading, body }) => {
    const [roleText, company] = splitOnDash(heading);
    const meta = nonEmpty(body).find((l) => !/^\s*[-*]\s+/.test(l)) ?? '';
    const [period, location] = meta.includes('|')
      ? (meta.split('|').map((s) => s.trim()) as [string, string])
      : [meta.trim(), undefined];
    return { role: roleText, company, period, location, highlights: bullets(body) };
  });

  const projects: ResumeProject[] = entries(findBlock(blocks, 'projects')).map(
    ({ heading, body }) => {
      const [namePart, metaPart] = splitOnDash(heading);
      const paren = (metaPart || namePart).match(/\(([^)]+)\)/);
      const meta = metaPart ? metaPart.replace(/\s*\([^)]*\)\s*/, '').trim() : undefined;
      return {
        name: namePart,
        meta: meta || undefined,
        status: paren ? paren[1].trim() : undefined,
        highlights: bullets(body),
      };
    }
  );

  const education: ResumeEducation[] = entries(findBlock(blocks, 'education')).map(
    ({ heading, body }) => {
      const detail = nonEmpty(body)[0] ?? '';
      const [institution, period] = splitOnDash(detail);
      return { credential: heading, institution, period };
    }
  );

  return { name, role, contact, summary, skills, experience, projects, education };
}
