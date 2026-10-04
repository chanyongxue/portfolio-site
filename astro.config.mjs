import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow.
// Locally they fall back to the custom domain at the root path.
const site = process.env.SITE_URL || 'https://www.chanyongxue.com';
const base = process.env.BASE_PATH || '/';
const prefix = base.replace(/\/$/, '');

// Old Squarespace URLs keep working after the move.
const moved = {
  '/coopai': '/work/coopai/',
  '/shopping-ux': '/work/shopping-ux/',
  '/knowledgecoop-marketing-site': '/work/knowledgecoop-marketing-site/',
  '/sortara': '/work/sortara/',
  '/parkking': '/work/parkking/',
  '/elevate-you': '/work/elevate-you/',
  // Explorations and the workflow page are archived (see archive/), so their old addresses go to the home page.
  '/info691-projects': '/',
  '/rebranding-coop-ai': '/',
  '/knowt': '/',
  '/tiktok-design-assessments': '/',
  '/current-design-workflow': '/',
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: Object.fromEntries(Object.entries(moved).map(([from, to]) => [from, prefix + to])),
});
