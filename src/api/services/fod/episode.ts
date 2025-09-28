import type { Episode } from '@/types/api/fod/episode'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://i.fod.fujitv.co.jp/apps/api/episode/detail'

export async function episode(id: string, token: string): Promise<Episode | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('ep_id', id)
  url.searchParams.set('is_premium', 'false')

  try {
    const res = await fetch(url, {
      headers: {
        'X-Authorization': `Bearer ${token}`,
      },
    })
    const json = (await res.json()) as Episode

    if (json) {
      return json
    }
  } catch (err) {
    logger.error('api/fod/episode', err)
  }

  return null
}
