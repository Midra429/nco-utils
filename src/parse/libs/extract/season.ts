import type { ExtractedSegment } from '.'

import { nanoid } from 'nanoid'
import { kanji2number } from '@geolonia/japanese-numeral'

import { CERTAINTY } from '@/parse/constants'
import { KANSUJI, KANSUJI_OLD, ROMAN_NUM_SHORT } from '@/parse/constants/regexps'
import { romanToInteger } from '@/parse/utils/roman-num'

const DIVIDER = '\\.:'
const BEFORE_PREFIX = '^.+'
const BEFORE_PREFIX_SP_PROB_LOW = '^\\S+\\s|[\\(\\)\\[\\]【】〜\\-/・]'
const AFTER_SUFFIX = '$|[^\\p{Letter}\\p{Number}]'
const NUMBER = '\\d{1,2}'
const LETTER_EP_SEASON = `第話期章幕${KANSUJI}${KANSUJI_OLD}`
const KANJI = '\\p{sc=Han}'
const KANJI_AFFIX = `(?![${LETTER_EP_SEASON}])${KANJI}`

// シーズンの可能性: 高
const SEASON_PROB_HIGH: RegExp[] = [
  // 第2期, 3期
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第?)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>期)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第二期, 三期
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第?)` +
      `(?<kansuji>[${KANSUJI}]{1,3})` +
      `(?<suffix>期)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第弐期, 第参期
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<kansuji>[${KANSUJI}${KANSUJI_OLD}]{1,3})` +
      `(?<suffix>期)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 弐ノ章
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<kansuji>[${KANSUJI}${KANSUJI_OLD}])` +
      `(?<suffix>ノ章)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // シーズン2
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>シーズン[${DIVIDER}]?)` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第2シリーズ, 第3シーズン
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>シリーズ|シーズン)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第二シリーズ, 第三シーズン
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<kansuji>[${KANSUJI}]{1,3})` +
      `(?<suffix>シリーズ|シーズン)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 2nd Season, 3rdシーズン
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<number>${NUMBER}(?:st|nd|rd|th))` +
      `(?<suffix>\\sseason|シーズン)` +
      `(?=${AFTER_SUFFIX})`,
    'dgiu'
  ),
  // Season 2, Season3
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<!${NUMBER}(?:st|nd|rd|th)\\s)` +
      `(?<prefix>season[\\s${DIVIDER}]?)` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgiu'
  ),
  // Season II
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<!${NUMBER}(?:st|nd|rd|th)\\s)` +
      `(?<prefix>(?:[Ss]eason[\\s${DIVIDER}]?)|SEASON[\\s${DIVIDER}])` +
      `(?<romannum>${ROMAN_NUM_SHORT})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // セカンドシーズン
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<katakana>セカンド|サード)` +
      `(?<suffix>シーズン)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

// シーズンの可能性 (特殊): 高
const SEASON_SP_PROB_HIGH: RegExp[] = []

// シーズンの可能性: 中
const SEASON_PROB_MID: RegExp[] = []

// シーズンの可能性 (特殊): 中
const SEASON_SP_PROB_MID: RegExp[] = []

// シーズンの可能性: 低
const SEASON_PROB_LOW: RegExp[] = [
  // 第2章, 第3幕
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>[章幕])` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第二章, 第参幕
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<kansuji>[${KANSUJI}${KANSUJI_OLD}]{1,3})` +
      `(?<suffix>[章幕])` +
      `(?=${AFTER_SUFFIX})`,
    'dg'
  ),
]

// シーズンの可能性 (特殊): 低
const SEASON_SP_PROB_LOW: RegExp[] = [
  // 2nd Attack, 3rd STAGE
  new RegExp(
    `(?<=${BEFORE_PREFIX_SP_PROB_LOW})` +
      `(?<number>${NUMBER}(?:st|nd|rd|th))` +
      `(?<suffix>\\s[a-zA-Z]+|\\s?[A-Z][a-zA-Z]+)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 2丁目
  new RegExp(
    `(?<=${BEFORE_PREFIX_SP_PROB_LOW})` +
      `(?<number>${NUMBER})` +
      `(?<suffix>${KANJI_AFFIX}+)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

/**
 * シーズン (タイトルの末尾の数字)
 */
const SEASON_FROM_TITLE: RegExp[] = [
  // 響け!ユーフォニアム3
  new RegExp(`(?<=\\S+\\s?)` + `(?<number>\\d)` + `(?=$)`, 'd'),
  // 魔王学院の不適合者 II
  new RegExp(
    `(?<=[\\p{sc=Hiragana}\\p{sc=Katakana}\\p{sc=Han}]+\\s?)` + `(?<romannum>IV|I{0,3})` + `(?=$)`,
    'du'
  ),
  // 真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました 2nd
  new RegExp(`(?<=\\S+\\s?)` + `(?<number>${NUMBER}(?:st|nd|rd|th))` + `(?=$)`, 'dgu'),
]

/**
 * `RegExpExecArray` -> `ExtractedSegment (type: season)`
 */
function convertRegExpExecArray(
  matched: RegExpExecArray,
  additional?: Partial<ExtractedSegment>
): ExtractedSegment {
  const groups = matched.groups!

  let number: ExtractedSegment['number']
  let numberText: ExtractedSegment['numberText']

  if (groups['number']) {
    numberText = groups['number']
    number = Number(numberText.replace(/st|nd|rd|th/, ''))
  } else if (groups['kansuji']) {
    numberText = groups['kansuji'].replace('ニ', '二')
    number = kanji2number(numberText)
  } else if (groups['romannum']) {
    numberText = groups['romannum']
    number = romanToInteger(numberText)
  } else if (groups['katakana']) {
    numberText = groups['katakana']
    number = ['セカンド', 'サード'].indexOf(numberText) + 2
  } else {
    throw new Error()
  }

  if (!number) {
    throw new Error()
  }

  return {
    type: 'season',
    text: matched[0],
    number,
    numberText,
    prefix: groups['prefix'] ?? '',
    suffix: groups['suffix'] ?? '',
    indices: matched.indices![0]!,
    certainty: additional?.certainty ?? CERTAINTY.HIGH,
    ...additional,

    _id: nanoid(),
  }
}

/**
 * シーズンを抽出
 */
export function extractSeasons(input: string): ExtractedSegment[] {
  const segments: ExtractedSegment[] = []

  // シーズンの可能性: 高
  SEASON_PROB_HIGH.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.HIGH,
        })

        segments.push(seg)
      } catch {}
    })
  })

  // シーズンの可能性 (特殊): 高
  SEASON_SP_PROB_HIGH.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.HIGH,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    })
  })

  // シーズンの可能性: 中
  SEASON_PROB_MID.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.MID,
        })

        segments.push(seg)
      } catch {}
    })
  })

  // シーズンの可能性 (特殊): 中
  SEASON_SP_PROB_MID.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.MID,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    })
  })

  // シーズンの可能性: 低
  SEASON_PROB_LOW.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.LOW,
        })

        segments.push(seg)
      } catch {}
    })
  })

  // シーズンの可能性 (特殊): 低
  SEASON_SP_PROB_LOW.forEach((re) => {
    input.matchAll(re).forEach((matched) => {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.LOW,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    })
  })

  return segments
    .filter((seg, idx, ary) => {
      // 確定度の高い方を優先
      return !ary.some((other, otherIdx) => {
        return (
          otherIdx !== idx &&
          seg.certainty <= other.certainty &&
          other.indices[0] <= seg.indices[0] &&
          seg.indices[1] <= other.indices[1]
        )
      })
    })
    .sort((a, b) => a.indices[0] - b.indices[0])
}

/**
 * タイトルからシーズンを抽出
 */
export function extractSeasonFromTitle(title: string): ExtractedSegment | null {
  for (const re of SEASON_FROM_TITLE) {
    const matched = re.exec(title)

    if (matched) {
      try {
        const seg = convertRegExpExecArray(matched)

        return seg
      } catch {}
    }
  }

  return null
}
