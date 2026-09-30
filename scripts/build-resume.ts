// -----------------------------------------------------------------------------
// Generate the downloadable resume artifacts from the structured SOT.
//
//   src/data/resume.yaml  ──►  public/resume.md   (data → Markdown)
//                         └─►  public/resume.pdf  (data → two-column HTML → PDF)
//
//   npm run resume     # regenerate both on demand
//   npm run build      # `prebuild` runs this automatically
//
// PDF uses puppeteer-core against a system Chrome/Chromium — no browser
// download. Set PUPPETEER_EXECUTABLE_PATH to override. If no browser is found
// the Markdown is still written and the PDF step is skipped (exit 0), so site
// builds never break and the last committed public/resume.pdf is reused.
// -----------------------------------------------------------------------------

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { loadResume, resumeToMarkdown } from '../src/lib/resume.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const yamlPath = resolve(root, 'src', 'data', 'resume.yaml');
const mdOut = resolve(root, 'public', 'resume.md');
const pdfOut = resolve(root, 'public', 'resume.pdf');

const resume = loadResume(yamlPath);
const markdown = resumeToMarkdown(resume);

mkdirSync(dirname(mdOut), { recursive: true });
writeFileSync(mdOut, markdown);
console.log(`[resume] Wrote ${mdOut}`);

const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_BIN,
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const executablePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));

if (!executablePath) {
  console.warn(
    '[resume] No Chrome/Chromium found — wrote Markdown, skipped PDF.\n' +
      '         Install Chrome or set PUPPETEER_EXECUTABLE_PATH to regenerate resume.pdf.'
  );
  process.exit(0);
}

// --- HTML ---------------------------------------------------------------------
// Every top-level child of #main / #side is an unbreakable block; the in-page
// script below pours them into A4 pages. `.h` blocks are section headings.

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const heading = (title: string) => `<h2 class="h" data-section="${esc(title)}">${esc(title)}</h2>`;
const entry = (title: string, date: string | undefined, org: string, meta: string | undefined, items: string[]) => `
  <article class="entry">
    <div class="entry-head"><h3>${esc(title)}</h3>${date ? `<span class="date">${esc(date)}</span>` : ''}</div>
    <p class="org"><strong>${esc(org)}</strong>${meta ? ` · ${esc(meta)}` : ''}</p>
    <ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </article>`;

const KIND_LABEL: Record<string, string> = { website: 'portfolio' };
const contacts = [
  { kind: 'email', label: resume.email, href: `mailto:${resume.email}` },
  ...resume.links,
];

const main = [
  `<header class="hero"><h1>${esc(resume.name)}</h1><p class="role">${esc(resume.role)}</p></header>`,
  heading('Profile'),
  `<p class="summary">${esc(resume.summary)}</p>`,
  heading('Experience'),
  ...resume.experience.map((j) => entry(j.role, j.period, j.company, j.location, j.highlights)),
  ...(resume.projects.length
    ? [heading('Projects'), ...resume.projects.map((p) => entry(p.name, undefined, p.meta ?? '', p.status, p.highlights))]
    : []),
];

const side = [
  heading('Contact'),
  `<dl class="contact">${contacts
    .map((c) => `<dt>${esc(KIND_LABEL[c.kind] ?? c.kind)}</dt><dd><a href="${esc(c.href)}">${esc(c.label)}</a></dd>`)
    .join('')}${resume.location ? `<dt>location</dt><dd>${esc(resume.location)}</dd>` : ''}</dl>`,
  ...(resume.metrics.length
    ? [
        heading('Highlights'),
        `<dl class="metrics">${resume.metrics
          .map((m) => `<div><dt>${esc(m.value)}</dt><dd>${esc(m.label)}</dd></div>`)
          .join('')}</dl>`,
      ]
    : []),
  heading('Skills'),
  ...resume.skills.map((g) => `<div class="skill"><h4>${esc(g.title)}</h4><p>${esc(g.items.join(', '))}</p></div>`),
  heading('Education'),
  ...resume.education.map(
    (e) => `<div class="edu"><h4>${esc(e.credential)}</h4><p>${esc(e.institution)}</p><p class="date">${esc(e.period)}</p></div>`
  ),
];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(resume.name)} — Resume</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=block" />
<style>
  @page { size: A4; margin: 0; }
  :root {
    --ink: #14161c; --body: #262a33; --muted: #6b7080; --accent: #2b47c9;
    --rule: #dcdee4; --side: #f1f2f6;
    --display: 'Space Grotesk', 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    --sans: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    --mono: 'IBM Plex Mono', ui-monospace, monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font: 9.4pt/1.5 var(--sans); color: var(--body); -webkit-print-color-adjust: exact; }
  #src { position: absolute; visibility: hidden; width: 120mm; }
  a { color: var(--accent); }

  .page { width: 210mm; height: 297mm; display: grid; grid-template-columns: 1fr 66mm; break-after: page; overflow: hidden; }
  .page:last-child { break-after: auto; }
  .col { height: 297mm; overflow: hidden; }
  .main { padding: 11mm 9mm 10mm 11.5mm; }
  .side { padding: 12mm 7mm 10mm 7mm; background: var(--side); }

  .hero h1 { font: 700 31pt/1.05 var(--display); letter-spacing: -0.02em; color: var(--ink); }
  .role { font: 700 13.5pt/1.3 var(--display); color: var(--accent); margin: 3px 0 18px; }
  .running { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px; }
  .running strong { font: 700 12pt var(--display); color: var(--ink); }
  .running span { font: 8.5pt var(--mono); color: var(--muted); }

  h2 { font: 500 8pt var(--mono); letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink); }
  .main h2 { display: flex; align-items: center; gap: 12px; margin: 4px 0 12px; }
  .main h2::after { content: ''; flex: 1; border-top: 1.5px solid var(--rule); }
  .side h2 { color: var(--accent); margin: 0 0 9px; }
  .side h2:not(:first-child) { margin-top: 14px; }

  .summary { margin-bottom: 14px; }
  .entry { margin-bottom: 12px; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  h3 { font: 700 12pt/1.3 var(--display); color: var(--ink); }
  .date { font: 8.5pt var(--mono); color: var(--muted); white-space: nowrap; }
  .org { color: var(--muted); margin: 3px 0 6px; }
  .org strong { color: var(--accent); font-weight: 600; }
  ul { list-style: none; }
  li { position: relative; padding-left: 16px; margin-bottom: 5px; }
  li::before { content: ''; position: absolute; left: 1px; top: 0.55em; width: 5px; height: 5px; background: var(--accent); }

  .contact dt { font: 8.8pt var(--mono); color: var(--muted); }
  .contact dd { margin-bottom: 9px; font-size: 9.4pt; }
  .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
  .metrics dt { font: 700 17pt/1.15 var(--display); color: var(--accent); letter-spacing: -0.01em; }
  .metrics dd { font-size: 8.6pt; line-height: 1.35; color: var(--muted); }
  .skill { margin-bottom: 7px; }
  .skill h4 { font-weight: 600; font-size: 9.2pt; color: var(--ink); }
  .skill p { color: var(--muted); font-size: 9pt; }
  .edu { margin-bottom: 10px; }
  .edu h4 { font: 700 11pt/1.3 var(--display); color: var(--ink); margin-bottom: 2px; }
  .edu p { color: var(--muted); font-size: 9pt; }
</style>
</head>
<body>
<div id="src">
  <div id="main">${main.join('')}</div>
  <div id="side">${side.join('')}</div>
</div>
<script>
  // Pour blocks into fixed A4 pages. A heading never ends a page; a section
  // that spills over gets a "<Section>, continued" heading on the next page.
  // Runs after webfonts load (#src is laid out hidden so they get requested),
  // otherwise pages would be measured with fallback metrics.
  // ponytail: blocks are atomic — one taller than a page gets clipped; split the entry if that ever happens.
  document.body.offsetHeight;
  document.fonts.ready.then(() => {
    const pages = [];
    const col = (i, name) => {
      while (pages.length <= i) {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = '<div class="col main"></div><div class="col side"></div>';
        if (pages.length) {
          page.firstChild.innerHTML =
            '<div class="running"><strong>${esc(resume.name)}</strong><span></span></div>';
        }
        document.body.append(page);
        pages.push(page);
      }
      return pages[i].querySelector('.' + name);
    };

    for (const name of ['main', 'side']) {
      let i = 0, section = null, target = col(0, name);
      for (const block of [...document.getElementById(name).children]) {
        if (block.classList.contains('h')) section = block.dataset.section;
        target.append(block);
        if (target.scrollHeight <= target.clientHeight) continue;
        const moving = [block];
        const prev = block.previousElementSibling;
        if (prev?.classList.contains('h')) moving.unshift(prev);
        target = col(++i, name);
        if (!moving[0].classList.contains('h') && section) {
          const cont = document.createElement('h2');
          cont.textContent = section + ', continued';
          target.append(cont);
        }
        target.append(...moving);
      }
    }
    pages.forEach((p, n) => {
      const slot = p.querySelector('.running span');
      if (slot) slot.textContent = '${esc(resume.role)} · ' + (n + 1) + ' / ' + pages.length;
    });
    document.getElementById('src').remove();
    document.body.dataset.paged = '';
  });
</script>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  // Fonts come from Google Fonts; offline builds fall back to system faces.
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForSelector('body[data-paged]');
  await page.pdf({ path: pdfOut, format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log(`[resume] Wrote ${pdfOut}`);
} finally {
  await browser.close();
}
