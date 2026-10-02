import type * as ThreadsV1 from '@/types/api/niconico/threads/v1'

import * as v from 'valibot'

import { CommentSchema } from '@/types/api/niconico/threads/v1'

export function parseThreadsV1Response(text: string): ThreadsV1.ResponseOk {
  const json: ThreadsV1.ResponseOk = JSON.parse(text)

  for (const thread of json.data.threads) {
    const comments: ThreadsV1.Comment[] = []

    for (const cmt of thread.comments) {
      try {
        comments.push(v.parse(CommentSchema, cmt))
      } catch {}
    }

    thread.comments = comments
  }

  return json
}
