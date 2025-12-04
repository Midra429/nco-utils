import type { V1Thread, V1Comment } from '@/types/api/niconico/v1/threads'
import type {
  LegacyXml,
  LegacyXmlOutput,
  LegacyXmlChatOutput,
} from '@/types/api/niconico/legacy/xml'

import * as v from 'valibot'
import { XMLParser } from 'fast-xml-parser'

import { LegacyXmlChatSchema } from '@/types/api/niconico/legacy/xml'
import { uid } from '@/common/uid'
import { toISOStringTz } from '@/common/toISOStringTz'

const xmlParser = new XMLParser({
  textNodeName: 'content',
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
})

function isCommentWithCommand(cmt: string) {
  return /^\/[a-z_]+(?:\s|$)/.test(cmt)
}

function xmlChatToV1Comment(chat: LegacyXmlChatOutput): V1Comment {
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
    nicoruCount: 0,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export function parseLegacyXml(text: string): LegacyXmlOutput {
  const { packet }: LegacyXml = xmlParser.parse(text)

  if (packet.thread && !Array.isArray(packet.thread)) {
    packet.thread = [packet.thread]
  }
  if (packet.global_num_res && !Array.isArray(packet.global_num_res)) {
    packet.global_num_res = [packet.global_num_res]
  }
  if (!Array.isArray(packet.chat)) {
    packet.chat = [packet.chat]
  }

  const chat = packet.chat.flatMap<LegacyXmlChatOutput>((chat) => {
    try {
      return v.parse(LegacyXmlChatSchema, chat)
    } catch {
      return []
    }
  })

  return {
    packet: { ...packet, chat },
  }
}

export function legacyXmlToV1Threads({ packet }: LegacyXmlOutput, fork?: string): V1Thread[] {
  fork ??= 'legacy-xml'

  const threadsMap: Record<string, V1Thread> = {}

  let customThreadId: string | null = null

  if (!packet.thread && !packet.global_num_res) {
    const threadIds = packet.chat.map((v) => v.thread)

    if (packet.chat.length === new Set(threadIds).size) {
      customThreadId = uid()
    }
  }

  for (const chat of packet.chat) {
    if (chat.deleted || !chat.thread || isCommentWithCommand(chat.content)) continue

    if (customThreadId) {
      chat.thread = customThreadId
    }

    threadsMap[chat.thread] ??= {
      id: chat.thread,
      fork,
      commentCount: 0,
      comments: [],
    }

    const thread = threadsMap[chat.thread]!

    thread.commentCount++
    thread.comments.push(xmlChatToV1Comment(chat))
  }

  return Object.values(threadsMap)
}
