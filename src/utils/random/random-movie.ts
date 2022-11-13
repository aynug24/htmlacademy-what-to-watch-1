import {getRandomElement, getRandomInt} from './random.js';

const MAX_BASE = 36;

function capitalize(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}

export function getRandomTitle(nouns: string[]) {
  const firstNoun = getRandomElement(nouns);
  const secondNoun = getRandomElement(nouns);
  return `${capitalize(firstNoun)} ${capitalize(secondNoun)}`;
}

export function getRandomSentence(nouns: string[], pastVerbs: string[]) {
  const subject = getRandomElement(nouns);
  const verb = getRandomElement(pastVerbs);
  const object = getRandomElement(nouns);
  return `${capitalize(subject)} ${verb} ${object}.`;
}

export function getRandomText(nouns: string[], pastVerbs: string[], minSentenceCount = 3, maxSentenceCount = 3) {
  const sentenceCount = getRandomInt(minSentenceCount, maxSentenceCount);

  return [...Array(sentenceCount).keys()]
    .map(() => getRandomSentence(nouns, pastVerbs))
    .join(' ');
}

function getRandomNBaseString(length: number, base: number) {
  return [...Array(length).keys()]
    .map(() => `${Math.random().toString(base)}00`[2])
    .join('');
}

export function getRandomString(length: number) {
  return getRandomNBaseString(length, MAX_BASE);
}

export function getRandomDate(from: Date, to: Date) {
  const rndTicks = getRandomInt(from.getTime(), to.getTime());
  return new Date(rndTicks);
}

export function getRandomFullName(names: string[], surnames: string[]) {
  return `${getRandomElement(names)} ${getRandomElement(surnames)}`;
}

export function getRandomMovieCast(names: string[], surnames: string[], maxCastLength = 5) {
  const castLength = getRandomInt(1, maxCastLength);
  return [...Array(castLength).keys()]
    .map(() => getRandomFullName(names, surnames));
}

export function getRandomUsername(names: string[], surnames: string[], birthYearFrom: number, birthYearTo: number) {
  return `${getRandomFullName(names, surnames).replace(/ /, '')}${getRandomInt(birthYearFrom, birthYearTo)}`;
}

export function getRandomEmail(username: string, nouns: string[]) {
  return `${username}@${getRandomElement(nouns)}.com`;
}

export function getRandomHexColor() {
  const hexLength = 6;
  return `#${getRandomNBaseString(hexLength, 16)}`;
}
