import { ROMAN_NUM } from '../constants/regexps'

const NUMERALS: Record<string, number> = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
}

/**
 * ローマ数字 -> 整数
 * @param roman ローマ数字
 * @returns 整数
 */
export function romanToInteger(roman: string): number {
  roman = roman.toUpperCase()

  if (!new RegExp(`^${ROMAN_NUM}$`).test(roman)) {
    throw new TypeError('入力値はローマ数字のみです')
  }

  let prev = 0

  return [...roman].reverse().reduce((sum, char) => {
    const value = NUMERALS[char]!

    sum += prev <= value ? value : -value
    prev = value

    return sum
  }, 0)
}

/**
 * 整数 -> ローマ数字
 * @param integer 整数
 * @returns ローマ数字
 */
export function integerToRoman(integer: number): string {
  if (!Number.isInteger(integer)) {
    throw new TypeError('入力値は整数のみです')
  }

  let roman = ''

  for (let key in NUMERALS) {
    const value = NUMERALS[key]!

    while (value <= integer) {
      roman += key
      integer -= value
    }
  }

  return roman
}
