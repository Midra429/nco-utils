import type { GetDataFormatted } from '@/types/api/nicolog/get'
import type { LegacyXml } from '@/types/api/niconico/legacy/xml'
import type { V1Thread } from '@/types/api/niconico/v1/threads'

import { logger } from '@/common/logger'
import {
  legacyXmlToV1Threads,
  parseLegacyXml,
} from '@/api/utils/niconico/legacy/xml'

const API_BASE_URL = 'http://nicolog.ecchi.club/p'

export async function file<Compat extends boolean = false>(
  { path, sign }: GetDataFormatted,
  options?: {
    compatV1Thread?: Compat
  }
): Promise<
  | (Compat extends true ? V1Thread[] : never)
  | (Compat extends false ? LegacyXml : never)
  | null
> {
  try {
    const url = new URL(API_BASE_URL + path)

    url.searchParams.set('sign', sign)

    const res = await fetch(url)
    const text = await res.text()

    const xml = parseLegacyXml(text)

    if (options?.compatV1Thread) {
      const v1Threads = legacyXmlToV1Threads(xml, 'nicolog')

      return v1Threads as any
    } else {
      return xml as any
    }
  } catch (err) {
    logger.error('api/nicolog/file', err)
  }

  return null
}
