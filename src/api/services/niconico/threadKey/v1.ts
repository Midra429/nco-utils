import type * as ThreadKeyV1 from '@/types/api/niconico/threadKey/v1'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://nvapi.nicovideo.jp/v1/comment/keys/thread'

function isResponseOk(
  json: ThreadKeyV1.Response
): json is Required<ThreadKeyV1.Response> {
  return json.meta.status === 200
}

export async function threadKeyV1(videoId: string): Promise<string | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('videoId', videoId)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Frontend-Id': '6',
        'X-Frontend-Version': '0',
        'X-Niconico-Language': 'ja-jp',
      },
    })
    const json = (await res.json()) as ThreadKeyV1.Response

    if (!isResponseOk(json)) {
      throw new Error(`${json.meta.status} ${json.meta.errorCode}`)
    }

    return json.data.threadKey
  } catch (err) {
    logger.error('api/niconico/threadKey/v1', err)
  }

  return null
}
