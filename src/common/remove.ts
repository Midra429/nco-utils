export function removeSymbols(text: string): string {
  return text
    .replace(/[\p{Symbol}\p{Punctuation}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function removeBrackets(text: string): string {
  return text
    .replace(/[\p{Ps}\p{Pe}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function removeSpaces(text: string): string {
  return text.replace(/\s+/g, '')
}
