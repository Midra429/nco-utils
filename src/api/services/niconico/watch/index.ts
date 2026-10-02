import type * as Watch from '@/types/api/niconico/watch'
import type * as WatchV3 from '@/types/api/niconico/watch/v3'
import type * as WatchV4 from '@/types/api/niconico/watch/v4'

import { logger } from '@/common/logger'
import { VIDEO_ID_REGEXP } from '@/api/constants'
import { normalizeWatchV3Data } from '@/api/utils/niconico/watch/v3'
import { normalizeWatchV4Data } from '@/api/utils/niconico/watch/v4'

const API_BASE_URL = 'https://www.nicovideo.jp/watch/'

function isVideoId(id: string): boolean {
  return VIDEO_ID_REGEXP.test(id)
}

function isResponseOk(
  json: WatchV3.Response | WatchV4.Response
): json is WatchV3.ResponseOk | WatchV4.ResponseOk {
  return json.meta.status === 200
}

function isV3Response(
  json: WatchV3.ResponseOk | WatchV4.ResponseOk
): json is WatchV3.ResponseOk {
  return 'ads' in json.data.response && 'tag' in json.data.response
}
function isV4Response(
  json: WatchV3.ResponseOk | WatchV4.ResponseOk
): json is WatchV4.ResponseOk {
  return '$watchV4' in json.data.response
}

export type WatchResponse =
  | {
      type: 'v3'
      data: Watch.Data
      rawData: WatchV3.Data
    }
  | {
      type: 'v4'
      data: Watch.Data
      rawData: WatchV4.Data
    }

export async function watch(
  videoId: string,
  credentials?: RequestInit['credentials']
): Promise<WatchResponse | null> {
  if (isVideoId(videoId)) {
    const url = new URL(videoId, API_BASE_URL)

    url.searchParams.set('responseType', 'json')

    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials,
      })
      const json = (await res.json()) as WatchV3.Response | WatchV4.Response

      if (!isResponseOk(json)) {
        throw new Error(
          `${json.meta.status} ${json.meta.code}: ${json.data.response}`
        )
      }

      // v3
      if (isV3Response(json)) {
        const rawData = json.data.response

        return {
          type: 'v3',
          data: normalizeWatchV3Data(rawData),
          rawData,
        }
      }

      // v4
      if (isV4Response(json)) {
        const rawData = json.data.response.$watchV4.data

        return {
          type: 'v4',
          data: normalizeWatchV4Data(rawData),
          rawData,
        }
      }
    } catch (err) {
      logger.error('api/niconico/watch', err)
    }
  }

  return null
}
