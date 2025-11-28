import type { PartResponse, PartData } from '@/types/api/danime/part'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://animestore.docomo.ne.jp/animestore/rest/WS010105'

export async function part(partId: string): Promise<PartData | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('viewType', '5')
  url.searchParams.set('partId', partId)

  try {
    const res = await fetch(url)
    const json = (await res.json()) as PartResponse

    if (json.data) {
      return json.data
    }
  } catch (err) {
    logger.error('api/danime/part', err)
  }

  return null
}
