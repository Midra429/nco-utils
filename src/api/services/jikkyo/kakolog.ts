import type { JikkyoChannelId } from '@/types/api/constants'
import type {
  JikkyoKakologFormat,
  JikkyoKakologParams,
  JikkyoKakologResponse,
  JikkyoKakologResponseOk,
} from '@/types/api/jikkyo/kakolog'
import type { V1Thread, V1Comment } from '@/types/api/niconico/v1/threads'

import * as v from 'valibot'

import { LegacyXmlChatSchema } from '@/types/api/niconico/legacy/xml'
import { logger } from '@/utils/logger'
import { toISOStringTz } from '@/utils/toISOStringTz'

const API_BASE_URL = 'https://jikkyo.tsukumijima.net/api/kakolog/'

function isResponseJsonOk(
  json: JikkyoKakologResponse<'json'>
): json is JikkyoKakologResponseOk<'json'> {
  return 'packet' in json && !('error' in json)
}

/**
 * コマンド付きコメント判定
 */
function isCommentWithCommand(cmt: string) {
  return /^\/[a-z_]+(?:\s|$)/.test(cmt)
}

export async function kakolog<Format extends JikkyoKakologFormat, Compat extends boolean = false>(
  jkChId: JikkyoChannelId,
  params: JikkyoKakologParams<Format>,
  options?: {
    compatV1Thread?: Compat
    userAgent?: string
  }
): Promise<
  | (Compat extends true ? V1Thread : never)
  | (Compat extends false ? JikkyoKakologResponseOk<Format> : never)
  | null
> {
  if (params.starttime < params.endtime) {
    const url = new URL(jkChId, API_BASE_URL)

    const starttime =
      params.starttime instanceof Date ? params.starttime.getTime() / 1000 : params.starttime
    const endtime =
      params.endtime instanceof Date ? params.endtime.getTime() / 1000 : params.endtime
    const format = options?.compatV1Thread ? 'json' : params.format

    url.searchParams.set('starttime', starttime.toString())
    url.searchParams.set('endtime', endtime.toString())
    url.searchParams.set('format', format)

    const headers = new Headers()

    if (options?.userAgent) {
      headers.set('X-User-Agent', options.userAgent)
    }

    try {
      const res = await fetch(url, { headers })

      switch (format) {
        case 'xml': {
          const xml = (await res.text()) as JikkyoKakologResponse<'xml'>

          if (xml) {
            return xml as any
          }
        }

        case 'json': {
          const json = (await res.json()) as JikkyoKakologResponse<'json'>

          if (!isResponseJsonOk(json)) {
            throw new Error(`${res.status} ${res.statusText}: ${json.error}`)
          }

          if (options?.compatV1Thread) {
            const starttime_ms = starttime * 1000

            const comments: V1Comment[] = []

            for (const { chat: raw } of json.packet) {
              const { success, output: chat } = v.safeParse(LegacyXmlChatSchema, raw)

              if (!success || chat.deleted || !chat.thread || isCommentWithCommand(chat.content)) {
                continue
              }

              const date_ms = Math.trunc(chat.date * 1000 + chat.date_usec / 1000)

              comments.push({
                id: `${chat.thread}:${chat.no}`,
                no: chat.no,
                vposMs: date_ms - starttime_ms,
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
              })
            }

            const commentCount = comments.length

            const v1Thread: V1Thread = {
              id: `${jkChId}:${starttime}-${endtime}`,
              fork: 'jikkyo',
              commentCount,
              comments,
            }

            return v1Thread as any
          } else {
            return json as any
          }
        }
      }
    } catch (err) {
      logger.error('api/jikkyo/kakolog', err)
    }
  }

  return null
}
