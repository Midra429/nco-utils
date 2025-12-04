import { removeSymbols, removeSpaces } from '@/common/remove'

import { normalizeHyphen } from './hyphen'
import { normalizeTilde } from './tilde'

const INVISIBLE_CHARS_REGEXP = /[\u200B\u2060\uFEFF]/g
const LINE_BREAK_REGEXP = /\n/g
const SPACES_REGEXP = /\s+/g

/**
 * 解析用に正規化
 */
export function normalize(input: string): string {
  // Unicode正規化（NFKC）
  input = input.normalize('NFKC')

  // 不可視な文字を消す
  input = input.replace(INVISIBLE_CHARS_REGEXP, '')

  // 改行 -> 半角空白
  input = input.replace(LINE_BREAK_REGEXP, ' ')

  // ハイフンを正規化
  input = normalizeHyphen(input)
  // チルダを正規化
  input = normalizeTilde(input)

  // 連続した空白を1つに
  input = input.replace(SPACES_REGEXP, ' ').trim()

  return input
}

/**
 * 正規化 + 記号削除 + 空白削除
 */
export function normalizeAll(input: string): string {
  input = normalize(input)
  input = removeSymbols(input)
  input = removeSpaces(input)

  return input
}
