import type {
  LegacyJson,
  LegacyJsonChatOutput,
  LegacyJsonOutput,
} from '@/types/api/niconico/legacy/json'
import type { V1Comment, V1Thread } from '@/types/api/niconico/v1/threads'

import * as v from 'valibot'

import { LegacyJsonChatSchema } from '@/types/api/niconico/legacy/json'
import { toISOStringTz } from '@/common/toISOStringTz'

function jsonChatToV1Comment(chat: LegacyJsonChatOutput): V1Comment {
  const date_ms = Math.trunc(chat.date * 1000 + chat.date_usec / 1000)

  return {
    id: `${chat.thread}:${chat.no}`,
    no: chat.no,
    vposMs: chat.vpos * 10,
    body: chat.content,
    commands: chat.mail,
    userId: chat.user_id,
    isPremium: chat.premium === 1,
    score: 0,
    postedAt: toISOStringTz(new Date(date_ms)),
    nicoruCount: chat.nicoru,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export function parseLegacyJson(text: string): LegacyJsonOutput {
  const json: LegacyJson = JSON.parse(text)

  const results: LegacyJsonOutput = []

  for (const item of json) {
    if ('chat' in item) {
      try {
        results.push({
          chat: v.parse(LegacyJsonChatSchema, item.chat),
        })
      } catch {}
    } else {
      results.push(item)
    }
  }

  return results
}

export function legacyJsonToV1Threads(input: LegacyJsonOutput): V1Thread[] {
  const threadsMap: Record<string, V1Thread> = {}

  for (const item of input) {
    if (!('chat' in item)) continue

    const { chat } = item

    if (chat.deleted || !chat.thread) continue

    threadsMap[chat.thread] ??= {
      id: chat.thread,
      fork: 'legacy-json',
      commentCount: 0,
      comments: [],
    }

    const thread = threadsMap[chat.thread]!

    thread.commentCount++
    thread.comments.push(jsonChatToV1Comment(chat))
  }

  return Object.values(threadsMap)
}
