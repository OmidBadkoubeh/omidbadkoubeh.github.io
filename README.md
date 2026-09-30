# omidbadkoubeh.github.io

Personal portfolio and resume of Omid Badkoubeh, built with [Astro](https://astro.build) and deployed to GitHub Pages at **<https://omidbadkoubeh.github.io>**.

## Single source of truth

All resume content lives in [`src/data/resume.yaml`](src/data/resume.yaml), validated by the Zod schema in [`src/schemas/resume.ts`](src/schemas/resume.ts). Everything else is derived from it:

```
src/data/resume.yaml ──► website             (Astro content collection)
                     ├─► public/resume.md    (Markdown download)
                     └─► public/resume.pdf   (two-column A4 PDF)
```

Site chrome that isn't resume text (tagline, nav, hero stats, socials) lives in [`src/data/site.ts`](src/data/site.ts).

## Getting started

Requires [Bun](https://bun.sh) and Node.js ≥ 22.18 (runs the `.ts` build script natively).

```sh
bun install
bun run dev        # http://localhost:4321
```

| Command           | Does                                                        |
| ----------------- | ----------------------------------------------------------- |
| `bun run dev`     | Start the dev server                                        |
| `bun run resume`  | Regenerate `public/resume.md` and `public/resume.pdf`       |
| `bun run build`   | Regenerate the resume, then build the site into `dist/`     |
| `bun run preview` | Serve the production build                                  |
| `bun run check`   | Type-check Astro and TypeScript files                       |

## Resume PDF

[`scripts/build-resume.ts`](scripts/build-resume.ts) renders the YAML to HTML and prints it with `puppeteer-core` against a system Chrome/Chromium (no browser download). Set `PUPPETEER_EXECUTABLE_PATH` if Chrome isn't in a standard location. Without a browser the Markdown is still written and the committed PDF is kept.

Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono) load from Google Fonts; offline builds fall back to system fonts.

## Project layout

```
src/
  components/   page sections (Hero, About, Experience, Projects, Skills, Contact, …)
  data/         resume.yaml (content) and site.ts (presentation config)
  schemas/      resume schema shared by the site and the PDF script
  lib/          data loading and Markdown rendering
  layouts/      base HTML layout
  styles/       global CSS and design tokens
scripts/        resume PDF/Markdown generator
design-system/  design notes
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds with `withastro/action` and publishes to GitHub Pages.
