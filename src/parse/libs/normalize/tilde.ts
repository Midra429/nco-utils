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
  for (const char of TILDES) {
    input = input.replaceAll(char, '〜')
  }

  return input
}
