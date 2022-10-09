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

export function asGenre(s: string): Genre {
  if (genresStrings.includes(s)) {
    return s as Genre;
  }
  throw new Error(`No genre ${s}`);
}
