import type { V1Thread, V1Comment } from '@xpadev-net/niconicomments'
import type { GetDataFormatted } from '@/types/api/nicolog/get'
import type { FileXml2js, ChatItemXml2js } from '@/types/api/nicolog/file'

import { parseStringPromise } from 'xml2js'

import { logger } from '@/utils/logger'
import { toISOStringTz } from '@/utils/toISOStringTz'

/**
 * コマンド付きコメント判定
 */
function isCommentWithCommand(cmt: string) {
  return /^\/[a-z_]+(?:\s|$)/.test(cmt)
}

function chatItemToV1Comment(chat: ChatItemXml2js): V1Comment {
  const date_ms = Math.trunc(parseInt(chat.$.date) * 1000 + parseInt(chat.$.date_usec) / 1000)

  return {
    id: `${chat.$.thread}:${chat.$.no}`,
    no: Number(chat.$.no!),
    vposMs: Number(chat.$.vpos),
    body: chat._,
    commands: chat.$.mail?.split(' ') ?? [],
    userId: chat.$.user_id!,
    isPremium: chat.$.premium === '1',
    score: 0,
    postedAt: toISOStringTz(new Date(date_ms)),
    nicoruCount: 0,
    nicoruId: null,
    source: 'truck',
    isMyPost: false,
  }
}

export async function file<
  Result extends
    | (Compat extends true ? V1Thread : never)
    | (Compat extends false ? FileXml2js : never),
  Compat extends boolean = false
>(
  { name, raw_url }: GetDataFormatted,
  options?: {
    compatV1Thread?: Compat
  }
): Promise<Result | null> {
  try {
    const res = await fetch(raw_url)
    const text = await res.text()

    const xml: FileXml2js = await parseStringPromise(text)

    if (options?.compatV1Thread) {
      const comments = xml.packet.chat
        .filter((v) => v.$.user_id && v.$.no && !isCommentWithCommand(v._))
        .map(chatItemToV1Comment)
      const commentCount = comments.length

      const v1Thread: V1Thread = {
        id: name,
        fork: 'nicolog',
        commentCount,
        comments,
      }

      return v1Thread as Result
    } else {
      return xml as Result
    }
  } catch (err) {
    logger.error('api/nicolog/file', err)
  }

  return null
}
