import type { ExtractedSegment } from '.'

import { kanji2number } from '@geolonia/japanese-numeral'
import equal from 'fast-deep-equal'
import { nanoid } from 'nanoid'

import { CERTAINTY } from '@/parse/constants'
import {
  KANSUJI,
  KANSUJI_OLD,
  ROMAN_NUM_SHORT,
} from '@/parse/constants/regexps'
import { romanToInteger } from '@/parse/utils/romanNum'

const DIVIDER = '\\._:|\\-★☆'
const BEFORE_PREFIX = '\\S+\\s|[\\(\\)\\[\\]【】〜\\-/・]'
const AFTER_SUFFIX = `$|\\s\\S+|[^\\p{Letter}\\p{Number}「『]|(?:「.+」|『.+』)$`
const NUMBER = `(?:\\d{1,4}|\\d{1,3}\\.\\d)`
const NUMBER_SHORT = '(?:\\d{1,3}|\\d{1,2}\\.\\d)'
const LETTER_EP_SEASON = `第話期章幕${KANSUJI}${KANSUJI_OLD}`
const KANJI = '\\p{sc=Han}'
const KANJI_AFFIX = `(?![${LETTER_EP_SEASON}])${KANJI}`
const PROLONGED_SOUND_MARK = 'ー〜〰'
const LETTER_JP = `\\p{sc=Hiragana}\\p{sc=Katakana}${KANJI}`
const LETTER_JP_AFFIX = `(?![${LETTER_EP_SEASON}])[${LETTER_JP}]`
const LETTER_JP_EX_AFFIX = `(?![${LETTER_EP_SEASON}])[${LETTER_JP}${PROLONGED_SOUND_MARK}]`

const ALPHABET_REGEXP = /[a-z]+/gi

// 話数の可能性: 高
const EP_PROB_HIGH: RegExp[] = [
  // 第1話, 2話, 3話目
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第?)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>話目?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第一話, 第弐話, 三話, 四話目
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第?)` +
      `(?<kansuji>[${KANSUJI}${KANSUJI_OLD}]{1,6})` +
      `(?<suffix>話目?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // エピソード1
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>エピソード[${DIVIDER}]?)` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // Episode1, Ep 2, chapter.3, episode:4, ep|5, chapter-6
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>(?:episod(?:e|io)|ep|chapter)[\\s#${DIVIDER}]?)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>\\.?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgiu'
  ),
  // Episode I
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>[Ee]pisod(?:e|io)\\s?|EPISOD(?:E|IO)\\s)` +
      `(?<romannum>${ROMAN_NUM_SHORT})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // #01
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>#)` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // #1~3, #1-3
  //    ↑     ↑
  new RegExp(
    `(?<=(?:${BEFORE_PREFIX})#${NUMBER}[〜~\\-])` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

// 話数の可能性 (特殊): 高
const EP_SP_PROB_HIGH: RegExp[] = [
  // 第1羽, 第2回, 第3の怪
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>(?!クール|シーズン|シリーズ)${LETTER_JP_AFFIX}(?:${LETTER_JP_EX_AFFIX}{0,2}${LETTER_JP_AFFIX})?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第一羽, 第二回, 第三の怪
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<kansuji>[${KANSUJI}]{1,6})` +
      `(?<suffix>(?!クール|シーズン|シリーズ)${LETTER_JP_AFFIX}(?:${LETTER_JP_EX_AFFIX}{0,2}${LETTER_JP_AFFIX})?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

// 話数の可能性: 中
const EP_PROB_MID: RegExp[] = [
  // タイトル 01「サブタイトル」
  new RegExp(
    `(?<=\\S+\\s)` + `(?<number>${NUMBER_SHORT})` + `(?=(?:「.+」|『.+』)$)`,
    'dgu'
  ),
]

// 話数の可能性 (特殊): 中
const EP_SP_PROB_MID: RegExp[] = [
  // 1羽目, 2投目, 新3合目, 4時間目
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>${KANJI_AFFIX}?)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>${KANJI_AFFIX}{1,3}目)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 一羽目, 二投目, 新三合目, 四時間目
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>${KANJI_AFFIX}?)` +
      `(?<kansuji>[${KANSUJI}]{1,6})` +
      `(?<suffix>${KANJI_AFFIX}{1,3}目)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // I 時間目
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<!(?:[Ss]eason|SEASON|[Pp]art|PART)\\s)` +
      `(?<romannum>${ROMAN_NUM_SHORT})` +
      `(?<suffix>\\s?${KANJI_AFFIX}{1,3}目)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // karte1, Log 02, Ex.03, MISSION:4
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<!${NUMBER}(?:st|nd|rd|th)\\s)` +
      `(?<prefix>(?![Ss]eason|SEASON|[Pp]art|PART)(?:[a-z]{2,13}|[A-Z]{2,13}|[A-Z][a-z]{1,12})[\\s${DIVIDER}]?)` +
      `(?<number>${NUMBER_SHORT})` +
      `(?<suffix>\\.?)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // Lecture I, LectureII
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<!${NUMBER}(?:st|nd|rd|th)\\s)` +
      `(?<prefix>(?![Ss]eason|SEASON|[Pp]art|PART)(?:[a-z]{2,13}|[A-Z][a-z]{1,12})[\\s${DIVIDER}]?|[A-Z]{2,13}[\\s${DIVIDER}])` +
      `(?<romannum>${ROMAN_NUM_SHORT})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // The 1st game
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>[Tt]he\\s?)` +
      `(?<number>${NUMBER_SHORT}(?:st|nd|rd|th))` +
      `(?<suffix>\\s[a-zA-Z]+|\\s?[A-Z][a-zA-Z]+)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

// 話数の可能性: 低
const EP_PROB_LOW: RegExp[] = [
  // タイトル 01 サブタイトル
  new RegExp(
    `(?<=\\S+\\s)` +
      `(?<!(?:[Ss]eason|SEASON|[Pp]art|PART)\\s)` +
      `(?<number>${NUMBER_SHORT})` +
      `(?=\\s\\S+)`,
    'dgu'
  ),
  // 第1章, 第2幕
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<number>${NUMBER})` +
      `(?<suffix>[章幕])` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 第一章, 第弐幕
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>第)` +
      `(?<kansuji>[${KANSUJI}${KANSUJI_OLD}]{1,6})` +
      `(?<suffix>[章幕])` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

// 話数の可能性 (特殊): 低
const EP_SP_PROB_LOW: RegExp[] = [
  // 1番湯
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<number>${NUMBER})` +
      `(?<suffix>${KANJI_AFFIX}+)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 一占
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<kansuji>[${KANSUJI}]{1,6})` +
      `(?<suffix>${KANJI_AFFIX}+)` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // ページ1, ろ〜る2, 喪3, オペレーション.4
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<prefix>(?!シーズン|エピソード)${LETTER_JP_AFFIX}(?:${LETTER_JP_EX_AFFIX}{0,6}${LETTER_JP_AFFIX})?[${DIVIDER}]?)` +
      `(?<number>${NUMBER})` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
  // 1st shot, 2nd Life, 3rd Run
  new RegExp(
    `(?<=${BEFORE_PREFIX})` +
      `(?<number>${NUMBER_SHORT}(?:st|nd|rd|th))` +
      `(?<suffix>(?:\\s[a-zA-Z]+|\\s?[A-Z][a-zA-Z]+))` +
      `(?<!\\s?(?:[Ss]eason|SEASON))` +
      `(?=${AFTER_SUFFIX})`,
    'dgu'
  ),
]

/**
 * `RegExpExecArray` -> `ExtractedSegment (type: episode)`
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
    number = Number(numberText.replaceAll(ALPHABET_REGEXP, ''))
  } else if (groups['kansuji']) {
    numberText = groups['kansuji'].replace('ニ', '二')
    number = kanji2number(numberText)
  } else if (groups['romannum']) {
    numberText = groups['romannum']
    number = romanToInteger(numberText)
  } else {
    throw new Error()
  }

  return {
    type: 'episode',
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
 * エピソードを抽出
 */
export function extractEpisodes(input: string): ExtractedSegment[] {
  const segments: ExtractedSegment[] = []

  // 話数の可能性: 高
  for (const re of EP_PROB_HIGH) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.HIGH,
        })

        segments.push(seg)
      } catch {}
    }
  }

  // 話数の可能性 (特殊): 高
  for (const re of EP_SP_PROB_HIGH) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.HIGH,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    }
  }

  // 話数の可能性: 中
  for (const re of EP_PROB_MID) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.MID,
        })

        segments.push(seg)
      } catch {}
    }
  }

  // 話数の可能性 (特殊): 中
  for (const re of EP_SP_PROB_MID) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.MID,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    }
  }

  // 話数の可能性: 低
  for (const re of EP_PROB_LOW) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.LOW,
        })

        segments.push(seg)
      } catch {}
    }
  }

  // 話数の可能性 (特殊): 低
  for (const re of EP_SP_PROB_LOW) {
    const matches = input.matchAll(re)

    for (const matched of matches) {
      try {
        const seg = convertRegExpExecArray(matched, {
          certainty: CERTAINTY.LOW,
          isSpecial: true,
        })

        segments.push(seg)
      } catch {}
    }
  }

  return (
    segments
      // 重複削除
      .filter((seg, idx, ary) => {
        return (
          idx ===
          ary.findIndex((val) => {
            return (
              val.certainty === seg.certainty && equal(val.indices, seg.indices)
            )
          })
        )
      })
      // 確定度の高い方を優先
      .filter((seg, idx, ary) => {
        return !ary.some((other, otherIdx) => {
          return (
            otherIdx !== idx &&
            seg.certainty < other.certainty &&
            other.indices[0] <= seg.indices[0] &&
            seg.indices[1] <= other.indices[1]
          )
        })
      })
      .sort((a, b) => a.indices[0] - b.indices[0])
  )
}
