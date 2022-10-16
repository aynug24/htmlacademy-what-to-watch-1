export const genres = [
  'comedy',
  'crime',
  'documentary',
  'drama',
  'horror',
  'family',
  'romance',
  'scifi',
  'thriller'
] as const;

const genresStrings: readonly string[] = genres;

export type Genre = typeof genres[number];

function isGenre(s: string): s is Genre {
  return genresStrings.includes(s);
}

export function asGenre(s: string): Genre {
  if (!isGenre(s)) {
    throw new Error(`No genre ${s}`);
  }
  return s;
}
