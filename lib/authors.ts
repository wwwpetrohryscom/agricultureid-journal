import type { Author } from '@/types/publication';

/**
 * The people a publication may be attributed to.
 *
 * A closed list, because a byline is a claim that a specific person stands
 * behind the work. `validate:journal` fails on an author id that is not here,
 * so a typo cannot silently invent a person.
 */
export const AUTHORS: readonly Author[] = [
  {
    id: 'agricultureid-editorial',
    name: 'AgricultureID Editorial',
    role: 'Editorial desk',
    bio: 'The AgricultureID editorial desk. Items under this byline are written and reviewed against the official sources cited on the page, following the sourcing policy.',
  },
  {
    id: 'agricultureid-data',
    name: 'AgricultureID Data',
    role: 'Data and methodology',
    bio: 'The team that builds and verifies the AgricultureID corpus. Items under this byline describe how the platform ingests, checks and corrects official agricultural data.',
  },
];

export const AUTHOR_MAP = new Map(AUTHORS.map((a) => [a.id, a]));
