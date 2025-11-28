import type {
  V1ThreadsOk,
  V1GlobalComment,
  V1Thread,
  V1Comment,
} from '@/types/api/niconico/v1/threads'
import type { LegacyXml, LegacyXmlChat } from '@/types/api/niconico/legacy/xml'

import * as v from 'valibot'
import { XMLParser } from 'fast-xml-parser'

import { LegacyXmlChatSchema } from '@/types/api/niconico/legacy/xml'
import { toISOStringTz } from '@/utils/toISOStringTz'

const xmlParser = new XMLParser({
  textNodeName: 'content',
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
})

function isCommentWithCommand(cmt: string) {
  return /^\/[a-z_]+(?:\s|$)/.test(cmt)
}

function xmlChatToV1Comment(chat: LegacyXmlChat): V1Comment {
  const date_ms = Math.trunc(
    Number(chat.date) * 1000 + (chat.date_usec ? Number(chat.date_usec) / 1000 : 0)
  )

  return {
    id: `${chat.thread}:${chat.no}`,
    no: Number(chat.no),
    vposMs: Number(chat.vpos) * 10,
    body: chat.content,
    commands: chat.mail?.split(' ') ?? [],
    userId: chat.user_id,
    isPremium: chat.premium === '1',
    score: 0,
    postedAt: toISOStringTz(new Date(date_ms)),
    nicoruCount: 0,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export function parseLegacyXml(text: string): LegacyXml {
  const xml: LegacyXml = xmlParser.parse(text)

  if (xml.packet.thread && !Array.isArray(xml.packet.thread)) {
    xml.packet.thread = [xml.packet.thread]
  }
  if (xml.packet.global_num_res && !Array.isArray(xml.packet.global_num_res)) {
    xml.packet.global_num_res = [xml.packet.global_num_res]
  }
  if (!Array.isArray(xml.packet.chat)) {
    xml.packet.chat = [xml.packet.chat]
  }

  xml.packet.chat = xml.packet.chat.flatMap((chat) => {
    try {
      return v.parse(LegacyXmlChatSchema, chat)
    } catch {
      return []
    }
  })

  return xml
}

export function legacyXmlToV1Threads(input: LegacyXml, fork?: string): V1ThreadsOk {
  fork ??= 'legacy-xml'

  const globalCommentsMap: Record<string, V1GlobalComment> = {}
  const threadsMap: Record<string, V1Thread> = {}

  let chatOnly = false

  if (input.packet.thread && input.packet.global_num_res) {
    for (const { thread, num_res } of input.packet.global_num_res) {
      globalCommentsMap[thread] = {
        id: thread,
        count: Number(num_res),
      }
    }
  } else {
    chatOnly = true
  }

  let threadId: string | null = null

  for (const chat of input.packet.chat) {
    if (!chat.deleted && !isCommentWithCommand(chat.content)) {
      let id: string

      if (chatOnly) {
        threadId ??= chat.thread
        id = threadId
      } else {
        id = chat.thread
      }

      chat.thread = id

      threadsMap[id] ??= {
        id,
        fork,
        commentCount: 0,
        comments: [],
      }

      threadsMap[id]!.comments.push(xmlChatToV1Comment(chat))
    }
  }

  if (threadId) {
    globalCommentsMap[threadId] = {
      id: threadId,
      count: threadsMap[threadId]?.comments.length ?? 0,
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
