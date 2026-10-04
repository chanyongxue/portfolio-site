import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** The problem or outcome line. It is the card title and the big heading on the case study page. */
    headline: z.string(),
    /** Short description for search engines and link previews. */
    summary: z.string(),
    /** One sentence shown over the card image on hover. Required, so no card is left without one. */
    blurb: z.string(),
    /** Opening paragraph on the case study page. */
    intro: z.string().optional(),
    role: z.string(),
    company: z.string(),
    timeline: z.string().optional(),
    audience: z.string().optional(),
    team: z.string().optional(),
    tools: z.string().optional(),
    deliverables: z.string().optional(),
    /** Which audience lens pages list this project. */
    lenses: z.array(z.enum(['ai', 'consumer', 'enterprise'])),
    tags: z.array(z.string()).default([]),
    /** Card image in the project grid. Falls back to the cover. */
    thumb: z.string().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    coverWidth: z.number().optional(),
    coverHeight: z.number().optional(),
    /**
     * Result numbers shown under the project facts. The numbers count up when they scroll into view.
     * `tags` are optional short pills under the label, for example the area and the outcome.
     */
    metrics: z
      .array(z.object({ value: z.string(), label: z.string(), tags: z.array(z.string()).default([]) }))
      .default([]),
    order: z.number(),
    /** Drafts are left out of the built site. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };
