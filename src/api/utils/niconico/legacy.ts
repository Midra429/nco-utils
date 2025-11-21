import type { V1Thread, V1Comment } from '@xpadev-net/niconicomments'
import type { LegacyApiXml, ChatItem } from '@/types/api/niconico/legacy'

import { XMLParser } from 'fast-xml-parser'

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

export function parseXml(data: string | LegacyApiXml): LegacyApiXml | null {
  try {
    return typeof data === 'string' ? xmlParser.parse(data) : data
  } catch {}

  return null
}

export function chatItemToV1Comment(chat: ChatItem): V1Comment {
  const date_ms = Math.trunc(
    Number(chat.date) * 1000 + (chat.date_usec ? Number(chat.date_usec) / 1000 : 0)
  )

  return {
    id: `${chat.thread}:${chat.no}`,
    no: Number(chat.no),
    vposMs: Number(chat.vpos) * 10,
    body: chat.content,
    commands: chat.mail?.split(' ') ?? [],
    userId: chat.user_id!,
    isPremium: chat.premium === '1',
    score: 0,
    postedAt: toISOStringTz(new Date(date_ms)),
    nicoruCount: 0,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export function legacyApiXmlToV1Thread(
  input: string | LegacyApiXml,
  {
    id,
    fork,
  }: {
    id: string
    fork: string
  }
): V1Thread | null {
  const xml = parseXml(input)

  if (!xml) {
    return null
  }

  try {
    if (!Array.isArray(xml.packet.chat)) {
      xml.packet.chat = [xml.packet.chat]
    }

    const comments = xml.packet.chat
      .filter((chat) => {
        return (
          !chat.deleted &&
          chat.no &&
          chat.user_id &&
          chat.content &&
          !isCommentWithCommand(chat.content)
        )
      })
      .map(chatItemToV1Comment)
    const commentCount = comments.length

    const v1Thread: V1Thread = {
      id,
      fork,
      commentCount,
      comments,
    }

    return v1Thread
  } catch {}

  return null
}
