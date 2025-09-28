const TILDES = [
  // Tilde
  '~',
  // Tilde Operator
  '∼',
  // Wavy Dash
  '〰',
  // Wave Dash
  // '〜',
]

/**
 * `Tilde`の類似文字を正規化
 */
export function normalizeTilde(input: string): string {
  // "Wave Dash" に置換
  TILDES.forEach((char) => {
    input = input.replaceAll(char, '〜')
  })

  return input
}
