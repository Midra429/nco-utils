import type { V1Thread, V1Comment } from '@/types/api/niconico/v1/threads'
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
    id: `${chat.thread ?? chat.user_id}:${chat.no}`,
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

export function legacyXmlToV1Thread(
  input: LegacyXml,
  additional: Pick<V1Thread, 'id' | 'fork'>
): V1Thread | null {
  const comments = input.packet.chat
    .filter((chat) => !chat.deleted && chat.user_id && !isCommentWithCommand(chat.content))
    .map(xmlChatToV1Comment)
  const commentCount = comments.length

  return {
    ...additional,
    commentCount,
    comments,
  }
}
