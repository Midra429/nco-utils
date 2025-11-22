import type { UnionToIntersection } from 'utility-types'
import type {
  SyoboCalReqCommand,
  SyoboCalParameters,
  SyoboCalResponse,
} from '@/types/api/syobocal/json'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://cal.syoboi.jp/json.php'

interface JsonFunction {
  <Command extends SyoboCalReqCommand>(
    commands: Command[],
    params: SyoboCalParameters<Command>,
    options?: {
      userAgent?: string
    }
  ): Promise<UnionToIntersection<SyoboCalResponse<Command>> | null>
}

export const json: JsonFunction = async (commands, params, options) => {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('Req', commands.join())

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
    const json = (await res.json()) as any

    if (
      ('Titles' in json && json['Titles']) ||
      ('Programs' in json && json['Programs']) ||
      ('SubTitles' in json && json['SubTitles'])
    ) {
      return json
    }
  } catch (err) {
    logger.error('api/syobocal/json', err)
  }

  return null
}
