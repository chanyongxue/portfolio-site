export type LensId = 'ai' | 'consumer' | 'enterprise';

export interface Lens {
  id: LensId;
  label: string;
  path: string;
  description: string;
}

/** Audience lenses. Each one gets its own page at /for/<id>/ that you can link from an application. */
export const lenses: Lens[] = [
  {
    id: 'ai',
    label: 'AI products',
    path: '/for/ai/',
    description: 'AI product design work by Courtney Chan.',
  },
  {
    id: 'consumer',
    label: 'Consumer & mobile',
    path: '/for/consumer/',
    description: 'Consumer and mobile product design work by Courtney Chan.',
  },
  {
    id: 'enterprise',
    label: 'Enterprise B2B',
    path: '/for/enterprise/',
    description: 'Enterprise B2B product design work by Courtney Chan.',
  },
];

export const site = {
  name: 'Courtney Chan',
  // <em> renders in light italic (see .hero h1 em in global.css).
  headline: 'Transforming static views into <em>dynamic</em>, user-centric experiences.',
  description:
    'Courtney Chan is a Senior Product Designer at Knowledge Coop, designing user-centric and data-driven solutions.',
  email: 'courtneychan.design@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chanyongxue/' },
    { label: 'GitHub', href: 'https://github.com/chanyongxue/' },
    { label: 'DevPost', href: 'https://devpost.com/courtneychan-design' },
  ],
};
