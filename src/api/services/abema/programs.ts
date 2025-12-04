import type { ProgramResponse } from '@/types/api/abema/programs'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://api.p-c3-e.abema-tv.com/v1/video/programs/'

export async function programs(
  id: string,
  token: string
): Promise<ProgramResponse | null> {
  const url = new URL(id, API_BASE_URL)

  url.searchParams.set('division', '0')
  url.searchParams.set('include', 'tvod')

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const json = (await res.json()) as ProgramResponse

    if (json) {
      return json
    }
  } catch (err) {
    logger.error('api/abema/programs', err)
  }

  return null
}
