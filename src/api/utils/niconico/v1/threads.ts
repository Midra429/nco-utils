import type { V1Threads } from '@/types/api/niconico/v1/threads'

import * as v from 'valibot'

import { V1CommentSchema } from '@/types/api/niconico/v1/threads'

export function parseV1Threads(text: string): V1Threads {
  const json: V1Threads = JSON.parse(text)

  json.data?.threads.forEach((thread) => {
    thread.comments = thread.comments.flatMap((cmt) => {
      try {
        return v.parse(V1CommentSchema, cmt)
      } catch {
        return []
      }
    })
  })

  return json
}
