import type { GetDataFormatted } from '@/types/api/nicolog/get'
import type { V1Thread } from '@/types/api/niconico/v1/threads'
import type { LegacyXml } from '@/types/api/niconico/legacy/xml'

import { logger } from '@/common/logger'
import { parseLegacyXml, legacyXmlToV1Threads } from '@/api/utils/niconico/legacy/xml'

export async function file<Compat extends boolean = false>(
  { raw_url }: GetDataFormatted,
  options?: {
    compatV1Thread?: Compat
  }
): Promise<
  (Compat extends true ? V1Thread[] : never) | (Compat extends false ? LegacyXml : never) | null
> {
  try {
    const res = await fetch(raw_url)
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
