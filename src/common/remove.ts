const SPACES_REGEXP = /\s+/g
const SYMBOLS_REGEXP = /[\p{Symbol}\p{Punctuation}]/gu
const BRACKETS_REGEXP = /[\p{Ps}\p{Pe}]/gu

export function removeSymbols(text: string): string {
  return text.replace(SYMBOLS_REGEXP, ' ').replace(SPACES_REGEXP, ' ').trim()
}

export function removeBrackets(text: string): string {
  return text.replace(BRACKETS_REGEXP, ' ').replace(SPACES_REGEXP, ' ').trim()
}

export function removeSpaces(text: string): string {
  return text.replace(SPACES_REGEXP, '')
}
