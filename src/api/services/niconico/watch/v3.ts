import type * as WatchV3 from '@/types/api/niconico/watch/v3'

import { logger } from '@/common/logger'
import { VIDEO_ID_REGEXP } from '@/api/constants'

const API_BASE_URL = 'https://www.nicovideo.jp/watch/'

function isVideoId(id: string): boolean {
  return VIDEO_ID_REGEXP.test(id)
}

function isResponseOk(json: WatchV3.Response): json is WatchV3.ResponseOk {
  return json.meta.status === 200
}

export async function watchV3(
  contentId: string,
  credentials?: RequestInit['credentials']
): Promise<WatchV3.Data | null> {
  if (isVideoId(contentId)) {
    const url = new URL(contentId, API_BASE_URL)

    url.searchParams.set('responseType', 'json')

    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials,
      })
      const json = (await res.json()) as WatchV3.Response

      if (!isResponseOk(json)) {
        throw new Error(
          `${json.meta.status} ${json.meta.code}: ${json.data.response}`
        )
      }

      return json.data.response
    } catch (err) {
      logger.error('api/niconico/watch/v3', err)
    }
  }

  return null
}
