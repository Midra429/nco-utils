import type { Metadata, Video } from '@/types/api/netflix/metadata'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://www.netflix.com/nq/website/memberapi/release/metadata'

export async function metadata(movieid: string | number): Promise<Video | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('movieid', movieid.toString())
  url.searchParams.set('_', Date.now().toString())

  try {
    const res = await fetch(url)
    const json = (await res.json()) as Metadata

    if (json.video) {
      return json.video
    }
  } catch (err) {
    logger.error('api/netflix/metadata', err)
  }

  return null
}
