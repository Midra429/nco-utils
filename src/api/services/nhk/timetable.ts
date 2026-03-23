import type { NhkAreaId } from '@/types/api/constants'
import type { Timetable } from '@/types/api/nhk/timetable'

import { logger } from '@/common/logger'
import { zeroPadding } from '@/common/zeroPadding'

const API_BASE_URL = 'https://api.nhk.jp/r8/pg/date/tv'

export async function timetable(
  date: `${string}-${string}-${string}` | Date,
  areaId: NhkAreaId = '130'
): Promise<Timetable | null> {
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = zeroPadding(date.getMonth() + 1, 2)
    const day = zeroPadding(date.getDate(), 2)

    date = `${year}-${month}-${day}`
  }

  const url = `${API_BASE_URL}/${areaId}/${date}.json`

  try {
    const res = await fetch(url)
    const json = (await res.json()) as Timetable

    return json
  } catch (err) {
    logger.error('api/nhk/timetable', err)
  }

  return null
}
