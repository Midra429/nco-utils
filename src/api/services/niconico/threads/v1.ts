import type * as ThreadsV1 from '@/types/api/niconico/threads/v1'
import type * as WatchV3 from '@/types/api/niconico/watch/v3'
import type * as WatchV4 from '@/types/api/niconico/watch/v4'

import { logger } from '@/common/logger'

import { threadKeyV1 } from '../threadKey/v1'

type NvComment = WatchV3.NvComment | WatchV4.NvComment

function isResponseOk(json: ThreadsV1.Response): json is ThreadsV1.ResponseOk {
  return json.meta.status === 200
}

export interface ThreadsV1RequestBody {
  params: NvComment['params']
  threadKey: NvComment['threadKey']
  additionals: {
    when?: number
    res_from?: number
  }
}

export interface ThreadsV1Params {
  videoId: string
  nvComment: NvComment
  additionals?: ThreadsV1RequestBody['additionals']
  _refreshThreadKey?: boolean
}

export async function threadsV1({
  videoId,
  nvComment,
  additionals,
  _refreshThreadKey = true,
}: ThreadsV1Params): Promise<ThreadsV1.Data | null> {
  const url = new URL('/v1/threads', nvComment.server)

  const body: ThreadsV1RequestBody = {
    params: nvComment.params,
    threadKey: nvComment.threadKey,
    additionals: additionals ?? {},
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Frontend-Id': '6',
        'X-Frontend-Version': '0',
        'X-Client-Os-Type': 'others',
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ThreadsV1.Response

    if (!isResponseOk(json)) {
      // threadKeyを再取得
      if (_refreshThreadKey && json.meta.errorCode === 'EXPIRED_TOKEN') {
        const key = await threadKeyV1(videoId)

        if (key) {
          nvComment.threadKey = key

          return threadsV1({
            videoId,
            nvComment,
            additionals,
            _refreshThreadKey: false,
          })
        }
      }

      throw new Error(`${json.meta.status} ${json.meta.errorCode}`)
    }

    return json.data
  } catch (err) {
    logger.error('api/niconico/threads/v1', err)
  }

  return null
}
