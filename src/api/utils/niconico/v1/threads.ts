import type { V1Comment, V1ThreadsOk } from '@/types/api/niconico/v1/threads'

import * as v from 'valibot'

import { V1CommentSchema } from '@/types/api/niconico/v1/threads'

export function parseV1Threads(text: string): V1ThreadsOk {
  const json: V1ThreadsOk = JSON.parse(text)

  for (const thread of json.data.threads) {
    const comments: V1Comment[] = []

    for (const cmt of thread.comments) {
      try {
        comments.push(v.parse(V1CommentSchema, cmt))
      } catch {}
    }

    thread.comments = comments
  }

  return json
}
