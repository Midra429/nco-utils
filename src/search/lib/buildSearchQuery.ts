import type { SearchQuery, SearchQueryJsonFilter } from '@/types/api/niconico/search'
import type { SearchTarget } from '@/types/search'
import type { ParsedResult } from '@/parse'

import { number2kanji } from '@geolonia/japanese-numeral'
import { zeroPadding } from '@/utils/zeroPadding'
import { parse } from '@/parse'

import { removeSymbols } from '../../utils/remove'

import titleVariants from '@/compare/title-variants.json'

export type BuildSearchQueryArgs = {
  /** 動画タイトル or 解析結果 */
  input: string | ParsedResult

  /** 動画の長さ */
  duration: number

  /** 検索対象 */
  targets: {
    [key in SearchTarget]?: boolean
  }

  /** User-Agent */
  userAgent: string
}

function getTitleVariants(title: string) {
  return titleVariants.find((v) => v.includes(title)) ?? [title]
}

/**
 * JSONフィルター (公式, dアニメ)
 */
function getJsonFilterOfficial({
  duration,
  targets,
}: BuildSearchQueryArgs): SearchQueryJsonFilter | null {
  if (!targets.official && !targets.danime) {
    return null
  }

  const andFilters: SearchQueryJsonFilter[] = [
    {
      type: 'equal',
      field: 'genre.keyword',
      value: 'アニメ',
    },
  ]

  if (duration) {
    andFilters.push({
      type: 'range',
      field: 'lengthSeconds',
      from: duration - 15,
      to: duration + 15,
      include_lower: true,
      include_upper: true,
    })
  }

  return 1 < andFilters.length
    ? {
        type: 'and',
        filters: andFilters,
      }
    : andFilters[0] ?? null
}

/**
 * JSONフィルター (コメント専用)
 */
function getJsonFilterSzbh({
  duration,
  targets,
}: BuildSearchQueryArgs): SearchQueryJsonFilter | null {
  if (!targets.szbh) {
    return null
  }

  const andFilters: SearchQueryJsonFilter[] = [
    {
      type: 'or',
      filters: [
        {
          type: 'equal',
          field: 'tagsExact',
          value: 'コメント専用動画',
        },
        {
          type: 'equal',
          field: 'tagsExact',
          value: 'SZBH方式',
        },
      ],
    },
  ]

  if (duration) {
    andFilters.push({
      type: 'range',
      field: 'lengthSeconds',
      from: duration - 5,
      to: duration + 65,
      include_lower: true,
      include_upper: true,
    })
  }

  return 1 < andFilters.length
    ? {
        type: 'and',
        filters: andFilters,
      }
    : andFilters[0] ?? null
}

/**
 * JSONフィルター (dアニメ(分割))
 */
function getJsonFilterChapter({ targets }: BuildSearchQueryArgs): SearchQueryJsonFilter | null {
  if (!targets.chapter) {
    return null
  }

  return {
    type: 'and',
    filters: [
      {
        type: 'equal',
        field: 'genre.keyword',
        value: 'アニメ',
      },
      {
        type: 'equal',
        field: 'tagsExact',
        value: 'dアニメストア',
      },
    ],
  }
}

export function buildSearchQuery(
  args: BuildSearchQueryArgs
): Pick<SearchQuery, 'q' | 'targets' | 'jsonFilter' | '_sort' | '_limit' | '_context'> {
  args.input = parse(args.input)
  args.duration = Math.round(args.duration)

  const { input: parsed, userAgent } = args

  const keywords: string[] = []

  // タイトル
  if (parsed.title) {
    keywords.push(
      getTitleVariants(parsed.titleStripped)
        .map((v) => (v.includes(' ') ? `"${v}"` : v))
        .join(' OR ')
    )
  }

  // 単一エピソード
  if (parsed.isSingleEpisode) {
    if (parsed.episode) {
      const { titleStripped, episode, subtitleStripped } = parsed

      const epText = episode.text
      const epNumber = episode.number
      const epKansuji = Number.isInteger(epNumber) && number2kanji(epNumber)

      const episodeKeywords = (
        !subtitleStripped?.includes(titleStripped)
          ? [
              `${epNumber}話`,
              epKansuji && `${epKansuji}話`,
              `エピソード${epNumber}`,
              `episode${epNumber}`,
              `ep${epNumber}`,
              `#${epNumber}`,
              `#${zeroPadding(epNumber, 2)}`,
              epText.includes(' ') ? `"${epText}"` : epText,

              subtitleStripped && `"${subtitleStripped}"`,
            ]
          : [epNumber, epKansuji]
      ).filter((v) => v != null)

      keywords.push([...new Set(episodeKeywords)].join(' OR '))
    }
  }
  // 複数エピソード
  else {
    const { episodes, episodesDivider } = parsed

    if (episodes) {
      const episodeText = episodes.map((v) => v.text).join(episodesDivider)

      keywords.push(episodeText.includes(' ') ? `"${episodeText}"` : episodeText)
    }
  }

  // 検索キーワード
  const q: SearchQuery['q'] = keywords.join(' ') || removeSymbols(parsed.input)

  const orFilters: SearchQueryJsonFilter[] = [
    getJsonFilterOfficial(args),
    getJsonFilterSzbh(args),
    getJsonFilterChapter(args),
  ].filter((v) => v !== null)

  // JSONフィルター
  const jsonFilter: SearchQuery['jsonFilter'] =
    1 < orFilters.length
      ? {
          type: 'or',
          filters: orFilters,
        }
      : orFilters[0]

  return {
    q,
    targets: ['title'],
    jsonFilter,
    _sort: '-startTime',
    _limit: 50,
    _context: userAgent,
  }
}
