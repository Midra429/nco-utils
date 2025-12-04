import type { GetResponse, GetDataFormatted, RelatedFormatted } from '@/types/api/nicolog/get'

import { logger } from '@/common/logger'

const API_BASE_URL = 'http://nicolog.ecchi.club/api/fs/get'

export interface GetRequestBody {
  path: string
  page?: number
  per_page?: number
  refresh?: boolean
}

export async function get(body: GetRequestBody): Promise<GetDataFormatted | null> {
  const url = new URL(API_BASE_URL)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as GetResponse

    if (json.code !== 200) {
      throw new Error(`${json.code} ${json.message}`)
    }

    const id = body.path.split('/').slice(2).join('/')
    const modified = new Date(json.data.modified).getTime()
    const created = new Date(json.data.created).getTime()
    const related =
      json.data.related &&
      json.data.related.map<RelatedFormatted>((val) => ({
        ...val,
        modified: new Date(val.modified).getTime(),
        created: new Date(val.created).getTime(),
      }))

    return {
      ...json.data,
      id,
      modified,
      created,
      related,
    }
  } catch (err) {
    logger.error('api/nicolog/get', err)
  }

  return null
}
