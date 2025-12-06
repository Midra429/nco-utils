import type { Slot, SlotsResponse } from '@/types/api/abema/slots'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://api.p-c3-e.abema-tv.com/v1/media/slots/'

export async function slots(id: string, token: string): Promise<Slot | null> {
  const url = new URL(id, API_BASE_URL)

  url.searchParams.set('include', 'payperview')

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const json = (await res.json()) as SlotsResponse

    if (json) {
      return json.slot
    }
  } catch (err) {
    logger.error('api/abema/slots', err)
  }

  return null
}
