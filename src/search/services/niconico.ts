import type { BuildSearchQueryArgs } from '@/search/lib/buildSearchQuery'
import type {
  SearchData,
  SearchQueryFieldKey,
} from '@/types/api/niconico/search'
import type { SearchTarget } from '@/types/search'

import { compare } from '@/compare'
import { parse } from '@/parse'
import { removeSymbols } from '@/common/remove'
import { DANIME_CHANNEL_ID, REGEXP_DANIME_CHAPTER } from '@/search/constants'
import { buildSearchQuery } from '@/search/lib/buildSearchQuery'
import { TAG_SZBH_REGEXP } from '@/api/constants'
import { search as niconicoSearch } from '@/api/services/niconico'

const MAX_MATCH_LENGTH = 3

const fields = [
  'contentId',
  'title',
  'userId',
  'channelId',
  'viewCounter',
  'lengthSeconds',
  'thumbnailUrl',
  'startTime',
  'commentCounter',
  'categoryTags',
  'tags',
] as const satisfies SearchQueryFieldKey[]

export type SearchDataWithFields = SearchData<(typeof fields)[number]>

type SortedSearchData = {
  [key in SearchTarget]: SearchDataWithFields[]
}

function validateChapters(
  chapters: SearchDataWithFields[],
  duration?: number
): boolean {
  const total = chapters.reduce((p, c) => p + c.lengthSeconds, 0)

  return (
    chapters.every((_, idx, ary) => ary.at(idx - 1) != null) &&
    (!duration || (total - 5 <= duration && duration <= total + 5))
  )
}

function sortSearchData(
  args: BuildSearchQueryArgs,
  data: SearchDataWithFields[]
): SortedSearchData {
  const { input, targets } = args
  const parsed = parse(input)

  const results: SortedSearchData = {
    official: [],
    danime: [],
    chapter: [],
    szbh: [],
  }

  // 仕分け作業
  for (const val of data) {
    if (val.channelId) {
      // dアニメ(分割)
      if (
        val.channelId === DANIME_CHANNEL_ID &&
        REGEXP_DANIME_CHAPTER.test(val.title) &&
        !REGEXP_DANIME_CHAPTER.test(parsed.input)
      ) {
        const { groups } = val.title.match(REGEXP_DANIME_CHAPTER)!

        if (targets.chapter && compare(parsed, groups!['title']!)) {
          const chapterNum = Number(groups!['chapter'])

          results.chapter[chapterNum - 1] = val
        }

        continue
      }

      // dアニメ
      if (val.channelId === DANIME_CHANNEL_ID) {
        if (targets.danime && compare(parsed, val.title)) {
          results.danime.push(val)
        }

        continue
      }

      // 公式
      if (targets.official && compare(parsed, val.title)) {
        results.official.push(val)

        continue
      }
    } else if (val.userId) {
      // コメント専用
      if (val.tags && TAG_SZBH_REGEXP.test(val.tags)) {
        if (targets.szbh && compare(parsed, val.title)) {
          results.szbh.push(val)
        }

        continue
      }
    }
  }

  if (!validateChapters(results.chapter)) {
    results.chapter = []
  }

  // 最大一致数より多い場合、無効に
  if (MAX_MATCH_LENGTH < results.official.length) {
    results.official = []
  }
  if (MAX_MATCH_LENGTH < results.danime.length) {
    results.danime = []
  }
  if (MAX_MATCH_LENGTH < results.chapter.length) {
    results.chapter = []
  }
  if (MAX_MATCH_LENGTH < results.szbh.length) {
    results.szbh = []
  }

  return results
}

export async function niconico(
  args: BuildSearchQueryArgs
): Promise<SortedSearchData> {
  args.input = parse(args.input)

  const { input: parsed, targets } = args

  let data: SearchDataWithFields[] = []

  // 1回目
  const searchQuery1 = buildSearchQuery(args)

  if (searchQuery1.jsonFilter) {
    const res = await niconicoSearch({
      ...searchQuery1,
      fields,
    })

    if (res?.data) {
      data.push(...res.data)
    }
  }

  const sorted1 = sortSearchData(args, data)

  const isOfficialEmpty = !!targets.official && !sorted1.official.length
  const isDAnimeEmpty = !!targets.danime && !sorted1.danime.length

  // 2回目 (公式, dアニメ)
  if (isOfficialEmpty || isDAnimeEmpty) {
    const searchQuery2 = buildSearchQuery({
      ...args,
      targets: {
        official: isOfficialEmpty,
        danime: isDAnimeEmpty,
      },
    })

    const q = removeSymbols(
      [
        parsed.titleStripped,
        parsed.season && 1 < parsed.season.number && parsed.season.text,
        parsed.isSingleEpisode
          ? parsed.episode?.number
          : parsed.episodes?.map((v) => v.text).join(parsed.episodesDivider),
        parsed.subtitleStripped,
      ]
        .filter((v) => v != null)
        .join(' ') || parsed.input
    )

    const res = await niconicoSearch({
      ...searchQuery2,
      q,
      fields,
    })

    if (res?.data) {
      data.push(...res.data)
    }
  }

  // 重複除去
  data = data.filter((val, idx, ary) => {
    return ary.findIndex((v) => v.contentId === val.contentId) === idx
  })

  return sortSearchData(args, data)
}
