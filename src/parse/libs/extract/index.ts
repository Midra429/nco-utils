import { CERTAINTY } from '@/parse/constants'
import { extractSeasons, extractSeasonFromTitle } from './season'
import { extractEpisodes } from './episode'

/**
 * 抽出した一部分
 */
export type ExtractedSegment = {
  type: 'season' | 'episode'
  text: string
  number: number
  numberText: string
  prefix: string
  suffix: string
  indices: [start: number, end: number]
  certainty: number
  isSpecial?: boolean

  /** 内部ID */
  _id: string
  /** 括弧内 */
  _isInsideBracket?: boolean
  /** 括弧が付属している対象の内部ID */
  _bracketTargetId?: string
  /** 付属している括弧の内部ID */
  _bracketId?: string
}

/**
 * シーズン
 */
type Season = {
  /**
   * シーズン (表記)
   * @description `prefix + numberText + suffix`
   * @example "第2期"
   */
  text: string
  /**
   * 番号
   * @example 2
   */
  number: number
  /**
   * 番号 (表記)
   * @example '2'
   */
  numberText: string
  /**
   * 接頭辞
   * @example '第'
   */
  prefix: string
  /**
   * 接尾辞
   * @example '期'
   */
  suffix: string
  /**
   * インデックス
   * @example [21, 24]
   */
  indices: [start: number, end: number]
}

/**
 * エピソード
 */
type Episode = {
  /**
   * エピソード (表記)
   * @example "第13話"
   */
  text: string
  /**
   * 番号
   * @example 13
   */
  number: number
  /**
   * 番号 (表記)
   * @example "13"
   */
  numberText: string
  /**
   * 接頭辞
   * @example "第"
   */
  prefix: string
  /**
   * 接尾辞
   * @example "話"
   */
  suffix: string
  /**
   * インデックス
   * @example [25, 29]
   */
  indices: [start: number, end: number]
}

/**
 * 抽出結果
 */
export type ExtractedResult =
  | ({
      /**
       * 入力されたテキスト
       * @example "君のことが大大大大大好きな100人の彼女 第2期 第13話「彼(カノ)の名は。」"
       */
      input: string

      /**
       * 作品のタイトル
       * @example "君のことが大大大大大好きな100人の彼女"
       */
      title: string
      /**
       * 作品のタイトル (ルビなし)
       * @example "君のことが大大大大大好きな100人の彼女"
       */
      titleStripped: string

      /**
       * シーズン
       */
      season: Season | null
      seasonAlt: Season | null
    } & (
      | {
          /**
           * エピソード (単話)
           */
          episode: Episode | null
          episodeAlt: Episode | null
          isSingleEpisode: true
        }
      | {
          /**
           * エピソード (複数)
           * @example "第1話～第4話"
           */
          episodes: [Episode, Episode, ...Episode[]]
          /**
           * 複数エピソードの区切り文字
           * @example "〜"
           */
          episodesDivider: string
          isSingleEpisode: false
        }
      | {
          episodes: null
          episodesDivider: null
          isSingleEpisode: false
        }
    ) &
      (
        | {
            /**
             * サブタイトル
             * @example "彼（カノ）の名は。"
             */
            subtitle: string
            /**
             * サブタイトル (ルビなし)
             * @example "彼の名は。"
             */
            subtitleStripped: string
          }
        | {
            subtitle: null
            subtitleStripped: null
          }
      ))
  | {
      input: string
      title: null
      titleStripped: null
      season: null
      seasonAlt: null
      episode: null
      episodeAlt: null
      isSingleEpisode: true
      subtitle: null
      subtitleStripped: null
    }

export type ExtractedResultSingleEpisode = Extract<ExtractedResult, { isSingleEpisode: true }>
export type ExtractedResultMultipleEpisodes = Extract<ExtractedResult, { isSingleEpisode: false }>

/**
 * `ExtractedSegment` -> `ExtractedResultCommon['season']`
 */
function segmentToResultSeason(segment: ExtractedSegment): NonNullable<ExtractedResult['season']> {
  return {
    text: segment.text,
    number: segment.number,
    numberText: segment.numberText,
    prefix: segment.prefix,
    suffix: segment.suffix,
    indices: segment.indices,
  }
}

/**
 * `ExtractedSegment` -> `ExtractedResultSingle['episode']`
 */
function segmentToResultEpisode(
  segment: ExtractedSegment
): NonNullable<ExtractedResultSingleEpisode['episode']> {
  return {
    text: segment.text,
    number: segment.number,
    numberText: segment.numberText,
    prefix: segment.prefix,
    suffix: segment.suffix,
    indices: segment.indices,
  }
}

/**
 * 同じ接辞(prefix, suffix)かどうか
 */
function isSameAffix(seg1: ExtractedSegment, seg2: ExtractedSegment): boolean {
  return seg1.prefix === seg2.prefix && seg1.suffix === seg2.suffix
}

/**
 * 不要な要素を取り除く
 */
function stripText(input: string): string {
  return (
    input
      // 片翼の･･･堕天使（フォーリン・エンジェル）
      .replace(/(?<=[a-zA-Z\p{sc=Hiragana}\p{sc=Han}]+)\s?\(\p{scx=Katakana}+\)/u, '')
      // 相生のホメオスタシス (そうせい)
      .replace(/(?<=[a-zA-Z\p{sc=Katakana}\p{sc=Han}]+)\s?\(\p{scx=Hiragana}+\)/u, '')
      // 始まりと終わりのプロローグ -Turning Point-
      .replace(/(?<=^[^\-]+)\s*?\-[a-z][a-z'\s]+\-$/i, '')
      // 魔王学院の不適合者 ～史上最強の魔王の始祖、転生して子孫たちの学校へ通う～
      .replace(/(?<=^[^〜]+)\s〜[^〜]+〜$/i, '')
      // ゴジラ キングオブモンスターズ(2019)
      .replace(/(?<=.+)\s?\((?:19|20)\d{2}\)$/, '')
  )
}

/**
 * タイトル、シーズン、エピソード、サブタイトルを抽出
 * @param input 正規化済みの文字列
 */
export function extract(input: string): ExtractedResult {
  const segments: {
    readonly all: ExtractedSegment[]
  } & {
    [type in ExtractedSegment['type']]: {
      all: ExtractedSegment[]
    } & {
      readonly [key in Lowercase<keyof typeof CERTAINTY>]: ExtractedSegment[]
    }
  } = {
    get all() {
      return [...this.season.all, ...this.episode.all].sort((a, b) => a.indices[0] - b.indices[0])
    },
    season: {
      all: [],
      get high() {
        return this.all.filter((v) => v.certainty === CERTAINTY.HIGH)
      },
      get mid() {
        return this.all.filter((v) => v.certainty === CERTAINTY.MID)
      },
      get low() {
        return this.all.filter((v) => v.certainty === CERTAINTY.LOW)
      },
    },
    episode: {
      all: [],
      get high() {
        return this.all.filter((v) => v.certainty === CERTAINTY.HIGH)
      },
      get mid() {
        return this.all.filter((v) => v.certainty === CERTAINTY.MID)
      },
      get low() {
        return this.all.filter((v) => v.certainty === CERTAINTY.LOW)
      },
    },
  }

  segments.season.all = extractSeasons(input)
  segments.episode.all = extractEpisodes(input)

  segments.all.forEach((seg, _, ary) => {
    const prevIdx = seg.indices[0] - 1
    const nextIdx = seg.indices[1] + 1
    const prevNextChars = `${input[prevIdx]}${input[nextIdx - 1]}`

    // 括弧内にシーズンやエピソードなどが含まれる
    if (['()', '[]', '【】'].includes(prevNextChars)) {
      // 対象のインデックスを更新
      seg.indices = [prevIdx, nextIdx]
      seg._isInsideBracket = true

      // 括弧が付属している対象
      const targetSeg = ary.find(
        (v) => v.type === seg.type && (v.indices[1] === prevIdx || v.indices[1] === prevIdx - 1)
      )

      if (targetSeg) {
        targetSeg._bracketId = seg._id
        seg._bracketTargetId = targetSeg._id
      }
    }
  })

  let title: ExtractedResult['title'] = null
  let titleStripped: ExtractedResult['titleStripped'] = null
  let season: ExtractedResult['season'] = null
  let seasonAlt: ExtractedResult['seasonAlt'] = null
  let episode: ExtractedResultSingleEpisode['episode'] = null
  let episodeAlt: ExtractedResultSingleEpisode['episodeAlt'] = null
  let episodes: ExtractedResultMultipleEpisodes['episodes'] = null
  let episodesDivider: ExtractedResultMultipleEpisodes['episodesDivider'] = null
  let subtitle: ExtractedResult['subtitle'] = null
  let subtitleStripped: ExtractedResult['subtitleStripped'] = null

  /**
   * シーズンセグメントをエピソードより左側のみに
   */
  function updateSeasonSegments() {
    const startIdx = episode?.indices[0] ?? episodeAlt?.indices[0] ?? episodes?.[0]?.indices[0]

    if (startIdx) {
      segments.season.all = segments.season.all.filter((v) => v.indices[1] <= startIdx)
    }
  }
  /**
   * エピソードセグメントをシーズンより左側のみに
   */
  function updateEpisodeSegments() {
    const endIdx = seasonAlt?.indices[1] ?? season?.indices[1]

    if (endIdx) {
      segments.episode.all = segments.episode.all.filter((v) => endIdx <= v.indices[0])
    }
  }

  /**
   * タイトルを切り抜き
   */
  function getTitle() {
    let title: string | undefined

    if (season) {
      title = input.slice(0, season.indices[0]).trim()
    } else if (episode) {
      title = input.slice(0, episode.indices[0]).trim()
    } else if (episodes) {
      title = input.slice(0, episodes[0]!.indices[0]).trim()
    }

    if (title) {
      return title
        .replace(
          /^(?:(?!.*」.*「)「(?<inner>[\s\S]*)」|(?!.*』.*『)『(?<inner>[\s\S]*)』)$/,
          '$<inner>'
        )
        .trim()
    }

    return null
  }
  /**
   * サブタイトルを切り抜き
   */
  function getSubtitle() {
    let subtitle: string | undefined

    if (episodes) {
      subtitle = input.slice(episodes.at(-1)!.indices[1]).trim()
    } else if (episodeAlt) {
      subtitle = input.slice(episodeAlt.indices[1]).trim()
    } else if (episode) {
      subtitle = input.slice(episode.indices[1]).trim()
    } else if (season) {
      subtitle = input.slice(season.indices[1]).trim()
    }

    if (subtitle) {
      return subtitle
        .replace(
          /^(?:(?!.*」.*「)「(?<inner>[\s\S]*)」|(?!.*』.*『)『(?<inner>[\s\S]*)』)$/,
          '$<inner>'
        )
        .trim()
    }

    return null
  }

  // 複数エピソードの開始と終了セグメント
  const multipleEpisodesSegments = segments.episode.all
    .map<[ExtractedSegment, ExtractedSegment, ...ExtractedSegment[]] | undefined>(
      (seg, idx, ary) => {
        const nextSeg = ary[idx + 1]
        const divider = input[seg.indices[1]]

        if (
          nextSeg &&
          divider &&
          // 1文字分空いている
          seg.indices[1] === nextSeg.indices[0] - 1 &&
          // 数字の位置関係が正しい
          seg.number < nextSeg.number &&
          // 同じ接辞
          ((isSameAffix(seg, nextSeg) &&
            // 区切り
            ['〜', '-', '/', '・'].includes(divider)) ||
            // seg: prefixのみ, nextSeg: affixなし
            (seg.prefix &&
              !seg.suffix &&
              !nextSeg.prefix &&
              !nextSeg.suffix &&
              // 区切り
              ['〜', '-'].includes(divider)))
        ) {
          return [seg, nextSeg]
        }
      }
    )
    .filter((v) => v != null)

  // 複数エピソード
  if (multipleEpisodesSegments.length) {
    // 連続しているものを結合
    ;[...multipleEpisodesSegments].reverse().forEach((segs, idx, ary) => {
      const prevSegs = ary[idx + 1]

      if (!prevSegs) return

      const divider = input[segs[0].indices[1]]!
      const prevDivider = input[prevSegs[0].indices[1]]!

      if (
        ['/', '・'].includes(divider) &&
        prevDivider === divider &&
        prevSegs[1]._id === segs[0]._id
      ) {
        prevSegs.push(...segs.slice(1))

        delete ary[idx]
      }
    })

    const segs = multipleEpisodesSegments.sort((a, b) => {
      return a.length === b.length ? a[0].indices[0] - b[0].indices[0] : b.length - a.length
    })[0]!
    const divider = input[segs[0].indices[1]]!

    episodes = segs.map(segmentToResultEpisode) as ExtractedResultMultipleEpisodes['episodes']
    episodesDivider = divider
  }
  // 単一エピソード
  else if (segments.episode.all.length) {
    const seasonSegIndices = segments.season.low.map((v) => v.indices)
    const episodeSeg =
      segments.episode.high[0] ??
      segments.episode.mid[0] ??
      segments.episode.low.find(
        ({ indices }) => !seasonSegIndices.some((v) => v[0] === indices[0] && v[1] === indices[1])
      )

    if (episodeSeg) {
      episode = segmentToResultEpisode(episodeSeg)

      if (episodeSeg._bracketId) {
        // 付属している括弧
        const bracketSeg = segments.episode.all.find((v) => v._id === episodeSeg._bracketId)!

        episodeAlt = segmentToResultEpisode(bracketSeg)
      }
    }
  }

  updateSeasonSegments()

  // シーズン
  let seasonSeg: ExtractedSegment | undefined

  if (episode || episodes) {
    seasonSeg = segments.season.high[0] ?? segments.season.mid[0] ?? segments.season.low.at(-1)
  } else if (segments.season.high.length) {
    seasonSeg = segments.season.high[0]
  } else if (2 <= segments.episode.all.length) {
    seasonSeg = segments.season.all[0]
  }

  if (seasonSeg) {
    if (seasonSeg._bracketTargetId) {
      // 括弧が付属している対象
      const targetSeg = segments.season.all.find((v) => v._id === seasonSeg._bracketTargetId)!

      season = segmentToResultSeason(targetSeg)
      seasonAlt = segmentToResultSeason(seasonSeg)
    } else {
      season = segmentToResultSeason(seasonSeg)

      if (seasonSeg._bracketId) {
        // 付属している括弧
        const bracketSeg = segments.season.all.find((v) => v._id === seasonSeg._bracketId)!

        seasonAlt = segmentToResultSeason(bracketSeg)
      }
    }
  }

  updateEpisodeSegments()

  // エピソード
  if (!episode && !episodes) {
    const episodeSeg = segments.episode.all[0]

    if (episodeSeg) {
      episode = segmentToResultEpisode(episodeSeg)

      if (episodeSeg._bracketId) {
        // 付属している括弧
        const bracketSeg = segments.episode.all.find((v) => v._id === episodeSeg._bracketId)!

        episodeAlt = segmentToResultEpisode(bracketSeg)
      }
    }
  }

  // タイトルを切り抜き
  title = getTitle()

  // シーズン (タイトルの末尾の数字)
  if (title && !season) {
    const seasonSeg = extractSeasonFromTitle(title)

    if (seasonSeg) {
      season = segmentToResultSeason(seasonSeg)

      // タイトルを切り抜き
      title = getTitle()
    }
  }

  if (title) {
    titleStripped = stripText(title)
  }

  // サブタイトルを切り抜き
  subtitle = getSubtitle()

  if (subtitle) {
    subtitleStripped = stripText(subtitle)
  }

  const extractedResult = {
    input,
    title,
    titleStripped,
    season,
    seasonAlt,
    subtitle,
    subtitleStripped,
  }

  if (episodes && episodesDivider) {
    return {
      ...extractedResult,
      episodes,
      episodesDivider,
      isSingleEpisode: false,
    } as ExtractedResult
  } else {
    return {
      ...extractedResult,
      episode,
      episodeAlt,
      isSingleEpisode: true,
    } as ExtractedResult
  }
}
