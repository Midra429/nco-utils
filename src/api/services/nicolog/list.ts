import type { List, ListDataFormatted, ContentFormatted } from '@/types/api/nicolog/list'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'http://nicolog.ecchi.club/api/fs/list'

export const NICO_LIVE_ANIME_ROOT = '/nico-live-anime'

interface ListRequestBody {
  path?: string
  page?: number
  per_page?: number
  refresh?: boolean
}

export async function list(body?: ListRequestBody): Promise<ListDataFormatted | null> {
  body ??= {}
  body.path ||= NICO_LIVE_ANIME_ROOT

  const url = new URL(API_BASE_URL)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as List

    if (json.code !== 200) {
      throw new Error(`${json.code} ${json.message}`)
    }

    const content = json.data.content.map<ContentFormatted>((val) => ({
      ...val,
      modified: new Date(val.modified).getTime(),
      created: new Date(val.created).getTime(),
    }))

    return {
      ...json.data,
      content,
    }
  } catch (err) {
    logger.error('api/nicolog/list', err)
  }

  return null
}
