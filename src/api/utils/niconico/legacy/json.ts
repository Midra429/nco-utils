import type {
  V1ThreadsOk,
  V1GlobalComment,
  V1Thread,
  V1Comment,
} from '@/types/api/niconico/v1/threads'
import type { LegacyJson, LegacyJsonChat } from '@/types/api/niconico/legacy/json'

import * as v from 'valibot'

import { LegacyJsonChatSchema } from '@/types/api/niconico/legacy/json'
import { toISOStringTz } from '@/utils/toISOStringTz'

function jsonChatToV1Comment(chat: LegacyJsonChat): V1Comment {
  const date_ms = Math.trunc(chat.date * 1000 + (chat.date_usec ? chat.date_usec / 1000 : 0))

  return {
    id: `${chat.thread ?? chat.user_id}:${chat.no}`,
    no: Number(chat.no),
    vposMs: Number(chat.vpos) * 10,
    body: chat.content,
    commands: chat.mail?.split(' ') ?? [],
    userId: chat.user_id,
    isPremium: chat.premium === 1,
    score: 0,
    postedAt: toISOStringTz(new Date(date_ms)),
    nicoruCount: chat.nicoru ?? 0,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export function parseLegacyJson(text: string): LegacyJson {
  const json: LegacyJson = JSON.parse(text)

  json.forEach((item, idx, ary) => {
    if (!('chat' in item)) return

    try {
      ary[idx] = { chat: v.parse(LegacyJsonChatSchema, item.chat) }
    } catch {
      delete ary[idx]
    }
  })

  return json
}

export function legacyJsonToV1Threads(input: LegacyJson): V1ThreadsOk {
  const globalCommentsMap: Record<string, V1GlobalComment> = {}
  const threadsMap: Record<string, V1Thread> = {}

  for (const item of input) {
    if ('global_num_res' in item) {
      const { thread, num_res } = item.global_num_res

      globalCommentsMap[thread] = {
        id: thread,
        count: num_res,
      }
    } else if ('chat' in item) {
      const chat = item.chat

      if (!chat.deleted) {
        threadsMap[chat.thread] ??= {
          id: chat.thread,
          fork: 'legacy-json',
          commentCount: 0,
          comments: [],
        }

        threadsMap[chat.thread]!.comments.push(jsonChatToV1Comment(chat))
      }
    }
  }

  const globalComments = Object.values(globalCommentsMap)
  const threads = Object.values(threadsMap).map((thread) => ({
    ...thread,
    commentCount: thread.comments.length,
  }))

  return {
    meta: { status: 200 },
    data: { globalComments, threads },
  }
}
