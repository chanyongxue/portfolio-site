const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a root-relative path with the site base path. */
export const url = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** Absolute paths and remote URLs pass through; root-relative paths get the base. */
export const asset = (src: string) => (/^https?:\/\//.test(src) ? src : url(src));
