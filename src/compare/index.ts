import type { ParsedResult } from '@/parse'

import { parse } from '@/parse'
import { normalizeAll } from '@/parse/libs/normalize'
import { similarity } from '@/utils/levenshtein'
import { removeSpaces } from '@/utils/remove'

import titleVariants from './title-variants.json'

const SIMILARITY_THRESHOLD = {
  STRICT: 1,
  HIGH: 0.85,
  MID: 0.7,
  LOW: 0.55,
} as const

function compareTitleVariants(titleA: string, titleB: string): boolean {
  return titleVariants.find((v) => v.includes(titleA))?.includes(titleB) || false
}

interface CompareOptions {
  strict?: boolean
}

/**
 * アニメタイトルを比較
 */
export function compare(
  inputA: string | ParsedResult,
  inputB: string | ParsedResult,
  { strict }: CompareOptions = {}
): boolean {
  const parsedA = parse(inputA)
  const parsedB = parse(inputB)

  if (normalizeAll(parsedA.input) === normalizeAll(parsedB.input)) {
    return true
  }

  if (!parsedA.title || !parsedB.title) {
    return false
  }

  const similarityThreshold = strict ? SIMILARITY_THRESHOLD.STRICT : SIMILARITY_THRESHOLD.HIGH

  const result: {
    title: boolean
    season?: boolean | null
    episode?: boolean | null
    subtitle?: boolean | null
  } = {
    title: false,
  }

  // タイトル
  const titleA = removeSpaces(parsedA.title)
  const titleB = removeSpaces(parsedB.title)
  const titleStrippedA = removeSpaces(parsedA.titleStripped)
  const titleStrippedB = removeSpaces(parsedB.titleStripped)

  const titleScore = Math.max(
    similarity(titleA, titleB),
    similarity(titleStrippedA, titleStrippedB),
    compareTitleVariants(parsedA.titleStripped, parsedB.titleStripped) ? 1 : 0
  )

  result.title = similarityThreshold <= titleScore

  // シーズン
  if (parsedA.season && parsedB.season) {
    const seasonA = parsedA.season
    const seasonB = parsedB.season
    const seasonAltA = parsedA.seasonAlt
    const seasonAltB = parsedB.seasonAlt

    result.season =
      seasonA.number === seasonB.number ||
      (!!seasonAltA && !!seasonAltB && seasonAltA.number === seasonAltB.number) ||
      (!!seasonAltA && seasonAltA.number === seasonB.number) ||
      (!!seasonAltB && seasonA.number === seasonAltB.number)
  }
  // シーズンなし
  else if (!parsedA.season && !parsedB.season) {
    result.season = null
  }

  // 単一エピソード
  if (parsedA.isSingleEpisode && parsedB.isSingleEpisode) {
    if (parsedA.episode && parsedB.episode) {
      const episodeA = parsedA.episode
      const episodeB = parsedB.episode
      const episodeAltA = parsedA.episodeAlt
      const episodeAltB = parsedB.episodeAlt

      result.episode =
        episodeA.number === episodeB.number ||
        (!episodeAltA && !!episodeAltB && episodeA.number === episodeAltB.number) ||
        (!!episodeAltA && !episodeAltB && episodeAltA.number === episodeB.number)
    }
    // エピソードなし
    else if (!parsedA.episode && !parsedB.episode) {
      result.episode = null
    }
  }
  // 複数エピソード
  else if (
    !parsedA.isSingleEpisode &&
    !parsedB.isSingleEpisode &&
    parsedA.episodes &&
    parsedB.episodes
  ) {
    const episodesA = parsedA.episodes
    const episodesB = parsedB.episodes

    result.episode =
      episodesA[0].number === episodesB[0].number &&
      episodesA.at(-1)!.number === episodesB.at(-1)!.number
  }

  // サブタイトル
  if (parsedA.subtitle && parsedB.subtitle) {
    const subtitleA = removeSpaces(parsedA.subtitle)
    const subtitleB = removeSpaces(parsedB.subtitle)
    const subtitleStrippedA = removeSpaces(parsedA.subtitleStripped)
    const subtitleStrippedB = removeSpaces(parsedB.subtitleStripped)

    result.subtitle =
      similarityThreshold <= similarity(subtitleA, subtitleB) ||
      similarityThreshold <= similarity(subtitleStrippedA, subtitleStrippedB)

    if (
      !strict &&
      !result.subtitle &&
      (result.season || result.season === null) &&
      result.episode &&
      6 <= Math.min(subtitleStrippedA.length, subtitleStrippedB.length)
    ) {
      result.subtitle =
        subtitleStrippedA.startsWith(subtitleStrippedB) ||
        subtitleStrippedB.startsWith(subtitleStrippedA)
    }
  }
  // サブタイトルなし
  else if (!parsedA.subtitle && !parsedB.subtitle) {
    result.subtitle = null
  }

  if (!strict) {
    // シーズン、エピソード、サブタイトルの一致時、タイトルの一致判定を緩くする
    if (
      !result.title &&
      (result.season || result.season === null) &&
      result.episode &&
      result.subtitle
    ) {
      result.title =
        SIMILARITY_THRESHOLD.MID <= titleScore ||
        (SIMILARITY_THRESHOLD.LOW <= titleScore &&
          (titleStrippedA.startsWith(titleStrippedB) || titleStrippedB.startsWith(titleStrippedA)))
    }

    // 片方のみシーズンあり
    if (result.season === undefined) {
      if (result.episode && result.subtitle) {
        result.season = true
      } else {
        result.season = false
      }
    }

    // 片方のみサブタイトルあり
    if (result.subtitle === undefined) {
      if (titleScore === 1 && result.season !== false && result.episode) {
        result.subtitle = true
      } else {
        result.subtitle = false
      }
    }
  }

  return (
    result.title &&
    (result.season || result.season === null) &&
    (result.episode || result.episode === null) &&
    (result.subtitle || result.subtitle === null)
  )
}
