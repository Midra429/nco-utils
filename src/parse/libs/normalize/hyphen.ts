const HYPHENS = [
  // Hyphen
  '‐',
  // Non-Breaking Hyphen
  '‑',
  // Figure Dash
  '‒',
  // En Dash
  '–',
  // Em Dash
  '—',
  // Horizontal Bar
  '―',
  // Hyphen Bullet
  '⁃',
  // Minus Sign
  '−',
  // Small Em Dash
  '﹘',
]

/**
 * `Hyphen-Minus`の類似文字を正規化
 */
export function normalizeHyphen(input: string): string {
  // カタカナ間の "Horizontal Bar" を "Katakana-Hiragana Prolonged Sound Mark" に置換
  input = input.replace(/(?<=\p{sc=Katakana})―(?=\p{sc=Katakana})/gu, 'ー')

  // "Hyphen-Minus" に置換
  HYPHENS.forEach((char) => {
    input = input.replaceAll(char, '-')
  })

  return input
}
