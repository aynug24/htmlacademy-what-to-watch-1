const genres = [
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

export type Genre = typeof genres[number];

export function asGenre(s: string): Genre {
  if (genres.includes(s as never)) {
    return s as Genre;
  }
  throw new Error(`No genre ${s}`);
}
