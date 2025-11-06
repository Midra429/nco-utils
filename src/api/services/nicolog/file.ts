import type { V1Thread } from '@xpadev-net/niconicomments'
import type { LegacyApiXml } from '@/types/api/niconico/legacy'
import type { GetDataFormatted } from '@/types/api/nicolog/get'

import { logger } from '@/utils/logger'
import { parseXml, legacyApiXmlToV1Thread } from '@/api/utils/niconico/legacy'

export async function file<
  Result extends
    | (Compat extends true ? V1Thread : never)
    | (Compat extends false ? LegacyApiXml : never),
  Compat extends boolean = false
>(
  { name, raw_url }: GetDataFormatted,
  options?: {
    compatV1Thread?: Compat
  }
): Promise<Result | null> {
  try {
    const res = await fetch(raw_url)
    const text = await res.text()

    const xml = parseXml(text)

    if (!xml) {
      return null
    }

    if (options?.compatV1Thread) {
      return legacyApiXmlToV1Thread(xml, {
        id: name,
        fork: 'nicolog',
      }) as Result
    } else {
      return xml as Result
    }
  } catch (err) {
    logger.error('api/nicolog/file', err)
  }

  return null
}
