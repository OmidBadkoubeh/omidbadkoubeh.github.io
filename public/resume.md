# Omid Badkoubeh

Senior Frontend Engineer

[omid.badkoubeh@gmail.com](mailto:omid.badkoubeh@gmail.com) | [github.com/OmidBadkoubeh](https://github.com/OmidBadkoubeh) | [linkedin.com/in/OmidBadkoubeh](https://linkedin.com/in/OmidBadkoubeh) | [omidbadkoubeh.github.io](https://omidbadkoubeh.github.io)

## Professional Summary

Senior Frontend Engineer with 7+ years building high-performance web and mobile apps with Next.js, React, and React Native. Frontend team lead experienced in WebGL data visualization, Web3, monorepo architecture, and cross-platform development, growing into full-stack TypeScript. Owns technical decisions and design systems in distributed teams.

## Technical Skills

- Languages: TypeScript, JavaScript (ES6+), Python, HTML5, CSS3
- Frontend: React, Next.js, Angular, React Native, React Native Web, React Flow, Three.js / WebGL
- State & Data: TanStack Query, Redux, tRPC, Apollo Client, GraphQL
- UI & Styling: TailwindCSS, Material UI, ShadCN, BaseUI, CSS Modules, React Native Paper
- Backend & Data: Node.js, NestJS, Hono, FastAPI, Bun, REST, Drizzle ORM, Prisma, PostgreSQL, MongoDB
- Testing: Jest, Vitest, React Testing Library, Cypress, Playwright, Detox
- Web3 & Maps: Wagmi, Viem, WalletConnect, Leaflet, OpenStreetMap, React Testing Library
- DevOps & Practice: Docker, Fastlane, Git, CI/CD, Storybook, Monorepos, Atomic Design, SOLID, Clean Architecture, Design Systems

## Professional Experience

### Senior Frontend Engineer, Team Lead — Corvic / Codaze

04/2024 – 05/2026 | Remote

- Led the frontend team and architected the enterprise AI admin panel (Next.js, tRPC) from near scratch for AI teams at ~20 client companies, including enterprises with 1,000+ employees, separating UI from business logic with reusable hooks and typed utilities, plus centralized global state.
- Designed an n8n-style workflow builder in React Flow where users drag and drop data, functions, and operations into data apps and view AI-generated outputs; built the state layer for multiple concurrent data-app tabs in a VS Code-style UI.
- Architected the node system with inheritance and the factory pattern: a base node holding shared logic and styling, extended by 10+ node types with their own styles and behavior.
- Enabled live updates over WebSockets and SSE by mapping backend events to targeted tRPC cache invalidation, refreshing only affected nodes while keeping cached data fast.
- Built a custom Three.js/WebGL scatterplot rendering 10M nodes at 60fps and 1M nodes at 120fps, optimizing memory allocation for smooth 2D/3D exploration.
- Extracted a shared UI library and business logic in a monorepo used by three apps (admin panel, agent-chat widget, back office), accelerating feature work 2x+.
- Safeguarded critical logic with Vitest unit tests and Playwright end-to-end tests, improving reliability across frequent releases.

### Senior Frontend Engineer — Embark

04/2022 – 01/2024 | Remote

- Owned all frontend architecture for a decentralized Web3 dashboard (Next.js, Wagmi/Viem) supporting virtually any Ethereum-compatible wallet via WalletConnect, with real-time blockchain event listening and smooth transaction states.
- Structured the UI as a reusable atomic-design component system and covered critical flows with React Testing Library tests, improving consistency, speed, and stability.
- Built a responsive, SEO-optimized landing page from scratch (Next.js, TailwindCSS) and improved its Core Web Vitals scores.

### Senior Developer & Technical Team Lead — Youtopin

07/2021 – 05/2022

- Built a CI/CD deployment pipeline from scratch with Fastlane, auto-triggered on PR merge, cutting deploy time from ~1 hour to 20 minutes.
- Led iOS and PWA development from a single React Native Web codebase, sharing business logic and an atomic-design UI library.
- Tested critical flows with Jest and React Testing Library unit tests plus Cypress (React Native Web) and Detox (React Native) end-to-end tests; containerized the PWA with Docker for smoother local development and deployment.
- Improved the PWA's Lighthouse score from under 60 to over 90.
- Mentored junior engineers, ran code reviews, and aligned frontend technical strategy with product goals.

### React & React Native Developer — Bakoot

05/2019 – 05/2021

- Delivered a food-delivery ecosystem serving ~10K monthly users and ~100 orders/day: the consumer Pizza.ir app and a courier Android app (React Native), plus the company blog (React).
- Built an admin geo-fencing feature letting operators draw delivery-region polygons on interactive maps with Leaflet and OpenStreetMap.
- Developed the courier app for assigned orders, delivery acceptance, and in-app directions or handoff to Waze/Google Maps.
- Optimized the Pizza.ir web app's Webpack configuration, replacing a single ~10MB SPA bundle with chunked, lazy-loaded JS/CSS to cut first-load JavaScript below 500KB, load ~3x faster, and lift Lighthouse scores from under 60 to over 90.
- Built the Bakoot corporate website and SydneyGentleCare.com.au with Next.js and TailwindCSS for performance and SEO.
- Wrote React Testing Library tests for critical UI flows.

## Projects

### Full-Stack TypeScript Application — Personal Project (In Progress)

- Building a full-stack product end-to-end: Bun, Hono, tRPC, and Drizzle ORM on the backend, Next.js on the frontends.
- Monorepo with shared UI and logic packages reused across three web apps: main app, admin panel, and vendor panel.
- Test-driven UI workflow with Storybook, validating each component in isolation before composing it across apps.

## Education

### M.S., Computer Science: Artificial Intelligence

Islamic Azad University, Science and Research, Tehran — 2019 – 2022

### B.S., Applied Mathematics and Computer Science

Shahid Beheshti University, Tehran — 2013 – 2018
