import type { SearchQueryFieldKey, SearchData as _SearchData } from '@/types/api/niconico/search'
import type { SearchTarget } from '@/types/search'
import type { BuildSearchQueryArgs } from '@/search/lib/buildSearchQuery'

import { parse } from '@/parse'
import { compare } from '@/compare'
import { search as niconicoSearch } from '@/api/services/niconico'
import { DANIME_CHANNEL_ID, REGEXP_DANIME_CHAPTER } from '@/search/constants'
import { buildSearchQuery } from '@/search/lib/buildSearchQuery'
import { removeSymbols } from '@/utils/remove'

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

type SearchData = _SearchData<(typeof fields)[number]>

type SortedSearchData = {
  [key in SearchTarget]: SearchData[]
}

function validateChapters(chapters: SearchData[], duration?: number): boolean {
  const total = chapters.reduce((p, c) => p + c.lengthSeconds, 0)

  return (
    chapters.every((_, idx, ary) => ary.at(idx - 1)) &&
    (!duration || (total - 5 <= duration && duration <= total + 5))
  )
}

function sortSearchData(
  args: BuildSearchQueryArgs & {
    data: SearchData[]
  }
): SortedSearchData {
  args.input = parse(args.input)

  const { input: parsed, targets, data } = args

  const contents: SortedSearchData = {
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

          contents.chapter[chapterNum - 1] = val
        }

        continue
      }

      // dアニメ
      if (val.channelId === DANIME_CHANNEL_ID) {
        if (targets.danime && compare(parsed, val.title)) {
          contents.danime.push(val)
        }

        continue
      }

      // 公式
      if (targets.official && compare(parsed, val.title)) {
        contents.official.push(val)

        continue
      }
    } else if (val.userId) {
      // コメント専用
      if (val.tags && /(^|\s)(コメント専用動画|SZBH方式)(\s|$)/i.test(val.tags)) {
        if (targets.szbh && compare(parsed, val.title)) {
          contents.szbh.push(val)
        }

        continue
      }
    }
  }

  if (!validateChapters(contents.chapter)) {
    contents.chapter = []
  }

  // 最大一致数より多い場合、無効に
  if (MAX_MATCH_LENGTH < contents.official.length) {
    contents.official = []
  }
  if (MAX_MATCH_LENGTH < contents.danime.length) {
    contents.danime = []
  }
  if (MAX_MATCH_LENGTH < contents.chapter.length) {
    contents.chapter = []
  }
  if (MAX_MATCH_LENGTH < contents.szbh.length) {
    contents.szbh = []
  }

  return contents
}

export async function niconico(args: BuildSearchQueryArgs): Promise<SortedSearchData> {
  args.input = parse(args.input)

  const { input: parsed, targets } = args

  let data: SearchData[] = []

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

  const sorted1 = sortSearchData({
    ...args,
    data,
  })

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

  return sortSearchData({
    ...args,
    data,
  })
}
