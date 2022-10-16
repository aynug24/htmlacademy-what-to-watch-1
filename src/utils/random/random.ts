export function getRandomInt(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min));
}

export function getRandomElement<T>(arr: readonly T[]) {
  if (arr.length === 0) {
    throw new Error('No element to sample from empty array!');
  }
  return arr[(getRandomInt(0, arr.length - 1))];
}
