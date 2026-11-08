import { url } from './url';

interface Rendered {
  rendered?: { html: string };
}

/**
 * The HTML of a Markdown entry, with these fixes applied:
 * - images are lazy-loaded
 * - root-relative image, video poster and link paths get the site base path
 * - images (and figures wrapping one) carry their aspect ratio as --ar, so galleries can
 *   line side-by-side images up at the same height
 */
export function contentHtml(entry: Rendered): string {
  const html = entry.rendered?.html ?? '';
  const ratio = (attrs: string) => {
    const w = attrs.match(/\bwidth="(\d+)"/);
    const h = attrs.match(/\bheight="(\d+)"/);
    return w && h ? ` style="--ar: ${w[1]} / ${h[1]}"` : '';
  };
  return html
    .replace(/<figure>(\s*)<img([^>]*)>/g, (_, space, attrs) => `<figure${ratio(attrs)}>${space}<img${attrs}>`)
    .replace(/<img(?![^>]*\bstyle=)([^>]*)>/g, (_, attrs) => `<img${ratio(attrs)}${attrs}>`)
    .replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ')
    .replace(/\b(src|href|poster)="(\/(?!\/)[^"]*)"/g, (_, attr, path) => `${attr}="${url(path)}"`);
}
