import { url } from './url';

interface Rendered {
  rendered?: { html: string };
}

/**
 * The HTML of a Markdown entry, with two fixes applied:
 * - images are lazy-loaded
 * - root-relative image and link paths get the site base path
 */
export function contentHtml(entry: Rendered): string {
  const html = entry.rendered?.html ?? '';
  return html
    .replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ')
    .replace(/\b(src|href)="(\/(?!\/)[^"]*)"/g, (_, attr, path) => `${attr}="${url(path)}"`);
}
