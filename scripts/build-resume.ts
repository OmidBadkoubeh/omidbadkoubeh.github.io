// -----------------------------------------------------------------------------
// Generate the downloadable resume artifacts from the structured SOT.
//
//   src/data/resume.yaml  ──►  public/resume.md   (data → Markdown)
//                         └─►  public/resume.pdf  (Markdown → styled PDF)
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
import { marked } from 'marked';
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

const body = await marked.parse(markdown, { async: true });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1b2433;
    font-size: 10.4pt;
    line-height: 1.42;
    margin: 0;
  }
  h1 { font-size: 23pt; letter-spacing: -0.4px; color: #0f172a; margin: 0 0 2px; }
  h1 + p { font-size: 12pt; font-weight: 600; color: #2563eb; margin: 0 0 4px; }
  h1 + p + p {
    font-size: 9pt; color: #475569; margin: 0 0 4px;
    padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;
  }
  h2 {
    font-size: 10.5pt; text-transform: uppercase; letter-spacing: 1.1px;
    color: #2563eb; border-bottom: 1px solid #dbe3ef; padding-bottom: 3px;
    margin: 15px 0 8px; break-after: avoid;
  }
  h3 { font-size: 10.6pt; color: #0f172a; margin: 11px 0 1px; break-after: avoid; }
  h3 + p { font-size: 8.9pt; color: #64748b; margin: 0 0 4px; }
  p { margin: 0 0 6px; }
  ul { margin: 3px 0 8px; padding-left: 16px; }
  li { margin-bottom: 3px; break-inside: avoid; }
  a { color: #2563eb; text-decoration: none; }
  strong { color: #0f172a; }
</style>
</head>
<body>${body}</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfOut,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '15mm', right: '15mm' },
  });
  console.log(`[resume] Wrote ${pdfOut}`);
} finally {
  await browser.close();
}
