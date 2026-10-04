export type LensId = 'ai' | 'consumer' | 'enterprise';

export interface Lens {
  id: LensId;
  label: string;
  path: string;
  intro: string;
  description: string;
}

/** Audience lenses. Each one gets its own page at /for/<id>/ that you can link from an application. */
export const lenses: Lens[] = [
  {
    id: 'ai',
    label: 'AI products',
    path: '/for/ai/',
    intro:
      'AI features that give people time back: Coop AI for loan officers and underwriters, and Sortara, an AI list app for consumers.',
    description: 'AI product design work by Courtney Chan.',
  },
  {
    id: 'consumer',
    label: 'Consumer & mobile',
    path: '/for/consumer/',
    intro:
      'Mobile and web products for everyday users, from a faster checkout to new apps and brands built from the ground up.',
    description: 'Consumer and mobile product design work by Courtney Chan.',
  },
  {
    id: 'enterprise',
    label: 'Enterprise B2B',
    path: '/for/enterprise/',
    intro: 'Tools for regulated work in the mortgage industry, where guidelines change and mistakes are costly.',
    description: 'Enterprise B2B product design work by Courtney Chan.',
  },
];

export const site = {
  name: 'Courtney Chan',
  headline: 'User-centric, data-driven design for AI, consumer and enterprise products.',
  intro: 'Senior Product Designer at Knowledge Coop.',
  stats: [
    { value: '100+', label: 'Mortgage companies served' },
    { value: '15,000+', label: 'Mortgage professionals served' },
  ],
  description:
    'Courtney Chan is a Senior Product Designer at Knowledge Coop, designing user-centric and data-driven solutions.',
  email: 'courtneychan.design@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chanyongxue/' },
    { label: 'GitHub', href: 'https://github.com/chanyongxue/' },
    { label: 'DevPost', href: 'https://devpost.com/courtneychan-design' },
  ],
};
