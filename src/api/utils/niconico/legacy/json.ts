import type { V1Thread, V1Comment } from '@/types/api/niconico/v1/threads'
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
    nicoruCount: 0,
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

export function legacyJsonToV1Thread(
  input: LegacyJson,
  additional: Pick<V1Thread, 'id' | 'fork'>
): V1Thread | null {
  const comments = input
    .flatMap((v) => ('chat' in v ? v.chat : []))
    .filter((chat) => !chat.deleted && chat.user_id)
    .map(jsonChatToV1Comment)
  const commentCount = comments.length

  return {
    ...additional,
    commentCount,
    comments,
  }
}
