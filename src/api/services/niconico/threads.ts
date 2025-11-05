import type { Threads, ThreadsData } from '@/types/api/niconico/threads'
import type { DataComment, NvComment } from '@/types/api/niconico/video'

import { logger } from '@/utils/logger'

import { thread_key } from './thread_key'

export interface ThreadsRequestBody {
  params: NvComment['params']
  threadKey: NvComment['threadKey']
  additionals: {
    when?: number
    res_from?: number
  }
}

function isResponseOk(json: Threads): json is Required<Threads> {
  return json.meta.status === 200
}

export async function threads(
  comment: DataComment | null,
  additionals?: ThreadsRequestBody['additionals'],
  refreshThreadKey: boolean = true
): Promise<ThreadsData | null> {
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
      const json = (await res.json()) as Threads

      if (!isResponseOk(json)) {
        // threadKeyを再取得
        if (refreshThreadKey && json.meta.errorCode === 'EXPIRED_TOKEN') {
          const threadKey = await thread_key(comment.threads[0]!.videoId)

          if (threadKey) {
            comment.nvComment.threadKey = threadKey

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
): Promise<(ThreadsData | null)[]> {
  return Promise.all(comments.map((comment) => threads(comment, additionals)))
}
