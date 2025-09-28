import type { Threads, ThreadsData } from '@/types/api/niconico/threads'
import type { NvComment } from '@/types/api/niconico/video'

import { logger } from '@/utils/logger'

export type ThreadsRequestBody = {
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
  nvComment: NvComment | null,
  additionals?: ThreadsRequestBody['additionals']
): Promise<ThreadsData | null> {
  if (nvComment) {
    const url = new URL('/v1/threads', nvComment.server)

    const body: ThreadsRequestBody = {
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
      const json = (await res.json()) as Threads

      if (!isResponseOk(json)) {
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
  nvComments: (NvComment | null)[],
  additionals?: ThreadsRequestBody['additionals']
): Promise<(ThreadsData | null)[]> {
  return Promise.all(nvComments.map((nvComment) => threads(nvComment, additionals)))
}
