import type { NhkChannelId } from '@/types/api/constants'
import type { Chronicle, ChronicleResult } from '@/types/api/nhk/chronicle'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://noa-api.nhk.jp/r1/db/_search'

const CHANNEL_IDS_DEFAULT: NhkChannelId[] = ['21', '31', '11', '10', '44']
const ONWARDS_DEFAULT: string = '20091128'

const HALF_WIDTH_SYMBOLS_REGEXP = /[!-\/:-@\[-`\{-~]/g
const OPEN_PUNCTUATION_REGEXP = /(?<=[^\s])(\p{Ps})/gu
const CLOSE_PUNCTUATION_REGEXP = /(\p{Pe})(?=[^\s])/gu

function convertKeyword(keyword: string): string {
  return (
    keyword
      // 半角記号 -> 全角記号
      .replace(HALF_WIDTH_SYMBOLS_REGEXP, (str) => {
        return String.fromCharCode(str.charCodeAt(0) + 0xfee0)
      })
      // 括弧の前後にスペースを入れる
      .replace(OPEN_PUNCTUATION_REGEXP, ' $1')
      .replace(CLOSE_PUNCTUATION_REGEXP, '$1 ')
      // 連続した空白を1つに
      .replace(/\s+/g, ' ')
      .trim()
      // 検索用のクエリに変換
      .split(' ')
      .map((v) => `"${v}"`)
      .join(' AND ')
  )
}

export interface ChronicleParams {
  channelIds?: NhkChannelId[]
  onwards?: string
}

export async function chronicle(
  keyword: string,
  params: ChronicleParams = {}
): Promise<ChronicleResult[] | null> {
  params.channelIds ??= CHANNEL_IDS_DEFAULT
  params.onwards = Math.max(
    Number(ONWARDS_DEFAULT),
    Number(params.onwards || -1)
  ).toString()

  const url = new URL(API_BASE_URL)

  const query = [
    `(${convertKeyword(keyword)})`,
    `channel1.keyword:(${params.channelIds.join(' OR ')})`,
    `airdate1:(>=${params.onwards})`,
  ].join(' AND ')

  url.searchParams.set('index', 'crn_data')
  url.searchParams.set('q', query)
  url.searchParams.set('sortkey', 'crnId')
  url.searchParams.set('order', 'asc')
  url.searchParams.set('limit', '10')
  url.searchParams.set('from', '0')

  try {
    const res = await fetch(url)
    const json = (await res.json()) as Chronicle

    if (json.result.length) {
      return json.result
    }
  } catch (err) {
    logger.error('api/nhk/chronicle', err)
  }

  return null
}
