import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Deployed URL. This is a GitHub user site (repo: OmidBadkoubeh.github.io),
  // so it is served from the domain root and needs no `base`.
  site: 'https://omidbadkoubeh.github.io',

  vite: {
    build: {
      // Write only the standard `backdrop-filter` in components and let esbuild
      // autoprefix. Including Safari <18 in the target makes esbuild emit the
      // `-webkit-` prefix (Safari needs it) AND keep the unprefixed property for
      // Chrome/Firefox — the frosted header works everywhere. (Hand-writing both
      // made esbuild collapse to webkit-only, which Chrome ignores.)
      cssTarget: ['chrome111', 'edge111', 'firefox121', 'safari16.4'],
    },
  },
});
