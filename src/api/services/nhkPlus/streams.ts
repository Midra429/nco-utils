import type { NhkAreaId } from '@/types/api/constants'
import type { StreamsResponse, Body as StreamBody } from '@/types/api/nhkPlus/streams'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://api-plus.nhk.jp/r5/pl2/streams/4/'

export async function streams(streamId: string, areaId?: NhkAreaId): Promise<StreamBody | null> {
  const url = new URL(streamId, API_BASE_URL)

  url.searchParams.set('area_id', areaId ?? '130')

  try {
    const res = await fetch(url)
    const json = (await res.json()) as StreamsResponse

    if (json.body[0]) {
      return json.body[0]
    }
  } catch (err) {
    logger.error('api/nhkPlus/streams', err)
  }

  return null
}
