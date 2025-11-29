import type { V1ThreadsOk, V1Comment } from '@/types/api/niconico/v1/threads'

import * as v from 'valibot'

import { V1CommentSchema } from '@/types/api/niconico/v1/threads'

export function parseV1Threads(text: string): V1ThreadsOk {
  const json: V1ThreadsOk = JSON.parse(text)

  for (const thread of json.data.threads) {
    thread.comments = thread.comments.flatMap<V1Comment>((cmt) => {
      try {
        return v.parse(V1CommentSchema, cmt)
      } catch {
        return []
      }
    })
  }

  return json
}
