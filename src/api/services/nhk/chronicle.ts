import type { NhkChannelId } from '@/types/api/constants'
import type { Chronicle, ChronicleResult } from '@/types/api/nhk/chronicle'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://noa-api.nhk.jp/r1/db/_search'

const HALF_WIDTH_SYMBOLS_REGEXP = /[!-\/:-@\[-`\{-~]/g
const OPEN_PUNCTUATION_REGEXP = /(?<=[^\s])(\p{Ps})/gu
const CLOSE_PUNCTUATION_REGEXP = /(\p{Pe})(?=[^\s])/gu

function convertKeyword(keyword: string): string {
  return (
    keyword
      // 半角記号 -> 全角記号
      .replace(HALF_WIDTH_SYMBOLS_REGEXP, function (str) {
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

export async function chronicle(
  keyword: string,
  channelIds: NhkChannelId[] = ['21', '31', '11', '10', '44']
): Promise<ChronicleResult[] | null> {
  const url = new URL(API_BASE_URL)

  const query = [
    `(${convertKeyword(keyword)})`,
    `channel1.keyword:(${channelIds.join(' OR ')})`,
    // 2009/11/28以降
    'airdate1:(>=20091128)',
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
