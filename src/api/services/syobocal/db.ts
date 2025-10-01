import type {
  SyoboCalCommand,
  SyoboCalParameters,
  SyoboCalResponseXml,
  SyoboCalResponseJson,
} from '@/types/api/syobocal/db'

import { XMLParser } from 'fast-xml-parser'
import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://cal.syoboi.jp/db.php'

const xmlParser = new XMLParser({
  parseTagValue: false,
})

export async function db<Command extends SyoboCalCommand>(
  command: Command,
  params: SyoboCalParameters<Command>,
  options?: {
    userAgent?: string
  }
): Promise<SyoboCalResponseJson<Command> | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('Command', command)

  for (const key in params) {
    const val = params[key] as string | string[] | number
    url.searchParams.set(key, Array.isArray(val) ? val.join() : val.toString())
  }

  const headers = new Headers()

  if (options?.userAgent) {
    headers.set('X-User-Agent', options.userAgent)
  }

  try {
    const res = await fetch(url, { headers })
    const text = await res.text()

    const xml = text && (xmlParser.parse(text) as SyoboCalResponseXml<Command>)

    if (xml) {
      switch (command) {
        case 'TitleLookup': {
          const titleItem = (xml as SyoboCalResponseXml<'TitleLookup'>).TitleLookupResponse
            .TitleItems.TitleItem

          return Object.fromEntries(
            (Array.isArray(titleItem) ? titleItem : [titleItem]).map((item) => [item.TID, item])
          ) as SyoboCalResponseJson<'TitleLookup'>
        }

        case 'ProgLookup': {
          const progItem = (xml as SyoboCalResponseXml<'ProgLookup'>).ProgLookupResponse.ProgItems
            .ProgItem

          return Object.fromEntries(
            (Array.isArray(progItem) ? progItem : [progItem]).map((item) => [item.PID, item])
          ) as SyoboCalResponseJson<'ProgLookup'>
        }
      }
    }
  } catch (err) {
    logger.error('api/syobocal/db', err)
  }

  return null
}
