/**
 * 不要な要素を削除
 * @param input 正規化済みの文字列
 */
export function clean(input: string): string {
  // dアニメストア（<映画タイトル> 本編 <映画タイトル>）
  const matched = input.match(/(.+)\s本編\s(.+)/)
  if (matched?.[1] && matched[1] === matched[2]) {
    input = matched[1]
  }

  input.matchAll(/【.+?】|\(.+?\)|\[.+?\]/g).forEach(([str]) => {
    if (
      // 映画
      /吹き?替え?|字幕/.test(str) ||
      // コメント専用動画
      /コメント専?用|szbh方式/i.test(str) ||
      /(prime|プライム)[\s・]?(video|ビデオ)/i.test(str) ||
      /(dvd|bd|blu-?ray|ブルーレイ)用/i.test(str) ||
      /(dvd\/(bd|blu-?ray|ブルーレイ)|(bd|blu-?ray|ブルーレイ)\/dvd)/i.test(str)
    ) {
      input = input.replace(str, '')
    }
  })

  // アニメ
  input = input.replace(
    /^(tv|テレビ)?アニメ(ーション)?\s?(「(?<title>.+)」|『(?<title>.+)』|(?<title>.+))/i,
    '$<title> '
  )
  input = input.replace(/(tv|テレビ)アニメ(ーション)?(作品)?/i, '')
  input = input.replace(/\s本編$/, '')

  // 映画
  input = input.replace(/\s(吹き?替え?|字幕)版?$/, '')

  // コメント専用動画
  input = input.replace(/コメント専?用(動画)?|szbh方式/gi, '')
  input = input.replace(/(amazon|アマゾン)?\s?(prime|プライム)[\s・]?(video|ビデオ)用?/gi, '')
  input = input.replace(/(dvd\/(bd|blu-?ray|ブルーレイ)|(bd|blu-?ray|ブルーレイ)\/dvd)用?/gi, '')
  input = input.replace(/(dvd|bd|blu-?ray|ブルーレイ)用/gi, '')

  return input.replace(/\s+/g, ' ').trim()
}
