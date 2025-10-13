import type { SyoboCalChannelId } from '@/types/api/constants'
import type { SyoboCalTitleSearch } from '@/types/api/syobocal/json'
import type { SyoboCalProgramDb } from '@/types/api/syobocal/db'
import type { ParsedResult } from '@/parse'

import { parse } from '@/parse'
import { normalize, normalizeAll } from '@/parse/libs/normalize'
import { CHANNEL_IDS_JIKKYO_SYOBOCAL } from '@/api/constants'
import * as syobocalApi from '@/api/services/syobocal'
import { similarity } from '@/utils/levenshtein'
import { removeSymbols } from '@/utils/remove'

const SIMILARITY_THRESHHOLD = 0.85

function normalizeScTitle(title: string) {
  return title.replace(/\(第?[2-9](nd|rd|th)?クール\)$/g, '')
}

export async function syobocal(args: {
  input: string | ParsedResult
  channelIds?: SyoboCalChannelId[]
  userAgent: string
}) {
  args.input = parse(args.input)

  const { input: parsed, channelIds, userAgent } = args

  if (!parsed.isSingleEpisode || !parsed.title) {
    return null
  }

  const searchWord = removeSymbols(parsed.titleStripped).toUpperCase()

  // 検索
  const searchResponse = await syobocalApi.json(
    ['TitleSearch'],
    {
      Search: searchWord,
      Limit: 15,
    },
    { userAgent }
  )

  if (!searchResponse) {
    return null
  }

  const title = normalizeAll(parsed.titleStripped)
  let episodeNumber = parsed.episode
    ? Math.max(parsed.episode.number, parsed.episodeAlt?.number ?? -1)
    : undefined

  // 検索結果を軽くフィルタ
  const searchResultTitles = Object.values(searchResponse.Titles)

  const searchResults: SyoboCalTitleSearch[] = []
  const searchResultsPartial: SyoboCalTitleSearch[] = []

  searchResultTitles.forEach((val) => {
    const scParsed = parse(`${normalizeScTitle(val.Title)} #0`)

    if (
      scParsed.title &&
      (episodeNumber != null
        ? SIMILARITY_THRESHHOLD <= similarity(parsed.titleStripped, scParsed.titleStripped)
        : parsed.titleStripped === scParsed.titleStripped)
    ) {
      searchResults.push(val)

      return
    }

    const scInput = normalizeAll(scParsed.input)

    // タイトルが一致 (一部)
    if (episodeNumber != null && (scInput.includes(title) || title.includes(scInput))) {
      searchResultsPartial.push(val)

      return
    }
  })

  const searchResultsAll = [...searchResults, ...searchResultsPartial]

  if (!searchResultsAll.length) {
    return null
  }

  let tids = searchResultsAll.map((v) => v.TID)

  // 話数を取得
  if (episodeNumber == null && parsed.subtitle) {
    const subtitlesResponse = await syobocalApi.json(['SubTitles'], {
      TID: tids,
    })

    if (subtitlesResponse) {
      outer: for (const tid in subtitlesResponse.SubTitles) {
        const subtitles = subtitlesResponse.SubTitles[tid]

        if (!subtitles) continue

        for (const [count, subtitle] of Object.entries(subtitles)) {
          if (normalize(subtitle) === parsed.subtitle) {
            episodeNumber = Number(count)
            tids = [tid]

            break outer
          }
        }
      }
    }

    if (episodeNumber == null) {
      return null
    }
  }

  // 放送情報とサブタイトルを取得
  const progLookupResult = await syobocalApi.db('ProgLookup', {
    TID: tids,
    Count: episodeNumber,
    ChID: channelIds ?? CHANNEL_IDS_JIKKYO_SYOBOCAL.map((v) => v[1]),
    JOIN: 'SubTitles',
  })
  const scPrograms = Object.values(progLookupResult ?? {})

  if (!scPrograms.length) {
    return null
  }

  let tid: string | null = null

  const programs: SyoboCalProgramDb[] = []

  if (searchResults.length === 1 && !searchResultsPartial.length) {
    tid = searchResults[0]!.TID

    programs.push(...scPrograms.filter((prog) => prog.TID === tid))
  } else {
    // サブタイトル比較
    if (parsed.subtitle) {
      const subtitle = normalizeAll(parsed.subtitle)
      const subtitleStripped = normalizeAll(parsed.subtitleStripped)

      for (const prog of scPrograms) {
        if (!prog.STSubTitle) continue

        const scSubtitle = normalizeAll(prog.STSubTitle)

        if (
          SIMILARITY_THRESHHOLD <= similarity(scSubtitle, subtitle) ||
          SIMILARITY_THRESHHOLD <= similarity(scSubtitle, subtitleStripped) ||
          subtitle.includes(scSubtitle) ||
          scSubtitle.includes(subtitle)
        ) {
          tid ??= prog.TID

          if (prog.TID === tid) {
            programs.push(prog)
          }
        }
      }
    }

    // 作品名比較
    if (!programs.length) {
      for (const val of searchResults) {
        const progs = scPrograms.filter((prog) => prog.TID === val.TID)

        if (!progs.length) continue

        const scParsed = parse(`${normalizeScTitle(val.Title)} #0`)
        const scInput = normalizeAll(scParsed.input)
        const scTitle = scParsed.title && normalizeAll(scParsed.titleStripped)

        if (
          (title === scInput || title === scTitle) &&
          parsed.season?.number === scParsed.season?.number
        ) {
          tid = val.TID

          programs.push(...progs)

          break
        }
      }
    }
  }

  if (!programs.length) {
    return null
  }

  return {
    title: searchResultsAll.find((v) => v.TID === tid)!,
    subtitle: programs[0]?.STSubTitle ?? null,
    programs,
  }
}
