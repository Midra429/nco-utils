import type { ThreadKey } from '@/types/api/niconico/thread_key'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://nvapi.nicovideo.jp/v1/comment/keys/thread'

function isResponseOk(json: ThreadKey): json is Required<ThreadKey> {
  return json.meta.status === 200
}

export async function thread_key(videoId: string): Promise<string | null> {
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
    const json = (await res.json()) as ThreadKey

    if (!isResponseOk(json)) {
      throw new Error(`${json.meta.status} ${json.meta.errorCode}`)
    }

    return json.data.threadKey
  } catch (err) {
    logger.error('api/niconico/thread_key', err)
  }

  return null
}
