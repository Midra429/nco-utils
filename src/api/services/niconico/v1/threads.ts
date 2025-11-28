import type { V1Threads, V1ThreadsOk, V1ThreadsData } from '@/types/api/niconico/v1/threads'
import type { DataComment, NvComment } from '@/types/api/niconico/video'

import { logger } from '@/utils/logger'

import { threadKey } from './threadKey'

function isResponseOk(json: V1Threads): json is V1ThreadsOk {
  return json.meta.status === 200
}

export interface ThreadsRequestBody {
  params: NvComment['params']
  threadKey: NvComment['threadKey']
  additionals: {
    when?: number
    res_from?: number
  }
}

export async function threads(
  comment: DataComment | null,
  additionals?: ThreadsRequestBody['additionals'],
  refreshThreadKey: boolean = true
): Promise<V1ThreadsData | null> {
  if (comment) {
    const url = new URL('/v1/threads', comment.nvComment.server)

    const body: ThreadsRequestBody = {
      params: comment.nvComment.params,
      threadKey: comment.nvComment.threadKey,
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
      const json = (await res.json()) as V1Threads

      if (!isResponseOk(json)) {
        // threadKeyを再取得
        if (refreshThreadKey && json.meta.errorCode === 'EXPIRED_TOKEN') {
          const key = await threadKey(comment.threads[0]!.videoId)

          if (key) {
            comment.nvComment.threadKey = key

            return threads(comment, additionals, false)
          }
        }

        throw new Error(`${json.meta.status} ${json.meta.errorCode}`)
      }

      return json.data
    } catch (err) {
      logger.error('api/niconico/threads', err)
    }
  }

  return null
}

export function multipleThreads(
  comments: (DataComment | null)[],
  additionals?: ThreadsRequestBody['additionals']
): Promise<(V1ThreadsData | null)[]> {
  return Promise.all(comments.map((comment) => threads(comment, additionals)))
}
