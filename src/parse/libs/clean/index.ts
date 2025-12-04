const DANIME_HONPEN_REGEXP = /(.+)\s本編\s(.+)/
const MOVIE_SUFFIX_IN_BRACKETS_REGEXP = /吹き?替え?|字幕/
const IN_BRACKETS_REGEXP = /【.+?】|\(.+?\)|\[.+?\]/g
const SZBH_IN_BRACKETS_REGEXP = /コメント専?用|szbh方式/i
const SZBH_PRIME_VIDEO_IN_BRACKETS_REGEXP =
  /(prime|プライム)[\s・]?(video|ビデオ)/i
const SZBH_DISCS_1_IN_BRACKETS_REGEXP = /(dvd|bd|blu-?ray|ブルーレイ)用/i
const SZBH_DISCS_2_IN_BRACKETS_REGEXP =
  /(dvd\/(bd|blu-?ray|ブルーレイ)|(bd|blu-?ray|ブルーレイ)\/dvd)/i
const ANIME_PREFIX_1_REGEXP =
  /^(tv|テレビ)?アニメ(ーション)?\s?「(?<title>.+?)」/i
const ANIME_PREFIX_2_REGEXP =
  /^(tv|テレビ)?アニメ(ーション)?\s?『(?<title>.+?)』/i
const ANIME_PREFIX_3_REGEXP = /^(tv|テレビ)?アニメ(ーション)?\s?(?<title>.+)/i
const ANIME_PREFIX_4_REGEXP = /(tv|テレビ)アニメ(ーション)?(作品)?/i
const MOVIE_HONPEN_SUFFIX_REGEXP = /\s本編$/
const MOVIE_SUFFIX_REGEXP = /\s(吹き?替え?|字幕)版?$/
const SZBH_REGEXP = /コメント専?用(動画)?|szbh方式/gi
const SZBH_PRIME_VIDEO_REGEXP =
  /(amazon|アマゾン)?\s?(prime|プライム)[\s・]?(video|ビデオ)用?/gi
const SZBH_DISCS_1_REGEXP =
  /(dvd\/(bd|blu-?ray|ブルーレイ)|(bd|blu-?ray|ブルーレイ)\/dvd)用?/gi
const SZBH_DISCS_2_REGEXP = /(dvd|bd|blu-?ray|ブルーレイ)用/gi
const SPACES_REGEXP = /\s+/g

/**
 * 不要な要素を削除
 * @param input 正規化済みの文字列
 */
export function clean(input: string): string {
  // dアニメストア（<映画タイトル> 本編 <映画タイトル>）
  const matched = input.match(DANIME_HONPEN_REGEXP)
  if (matched?.[1] && matched[1] === matched[2]) {
    input = matched[1]
  }

  input.matchAll(IN_BRACKETS_REGEXP).forEach(([str]) => {
    if (
      // 映画
      MOVIE_SUFFIX_IN_BRACKETS_REGEXP.test(str) ||
      // コメント専用動画
      SZBH_IN_BRACKETS_REGEXP.test(str) ||
      SZBH_PRIME_VIDEO_IN_BRACKETS_REGEXP.test(str) ||
      SZBH_DISCS_1_IN_BRACKETS_REGEXP.test(str) ||
      SZBH_DISCS_2_IN_BRACKETS_REGEXP.test(str)
    ) {
      input = input.replace(str, '')
    }
  })

  // アニメ
  input = input
    .replace(ANIME_PREFIX_1_REGEXP, '$<title> ')
    .replace(ANIME_PREFIX_2_REGEXP, '$<title> ')
    .replace(ANIME_PREFIX_3_REGEXP, '$<title> ')
  input = input.replace(ANIME_PREFIX_4_REGEXP, '')
  input = input.replace(MOVIE_HONPEN_SUFFIX_REGEXP, '')

  // 映画
  input = input.replace(MOVIE_SUFFIX_REGEXP, '')

  // コメント専用動画
  input = input.replace(SZBH_REGEXP, '')
  input = input.replace(SZBH_PRIME_VIDEO_REGEXP, '')
  input = input.replace(SZBH_DISCS_1_REGEXP, '')
  input = input.replace(SZBH_DISCS_2_REGEXP, '')

  return input.replace(SPACES_REGEXP, ' ').trim()
}
