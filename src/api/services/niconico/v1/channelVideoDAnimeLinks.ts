import type {
  V1DAnimeLinksItem,
  V1DAnimeLinksResponse,
  V1DAnimeLinksResponseOk,
} from '@/types/api/niconico/v1/channelVideoDAnimeLinks'

import { logger } from '@/common/logger'

const API_BASE_URL =
  'https://public-api.ch.nicovideo.jp/v1/user/channelVideoDAnimeLinks'

function isResponseOk(
  json: V1DAnimeLinksResponse
): json is V1DAnimeLinksResponseOk {
  return json.meta.status === 200
}

export async function channelVideoDAnimeLinks(
  videoId: string
): Promise<V1DAnimeLinksItem | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('videoId', videoId)

  try {
    const res = await fetch(url, {
      headers: {
        'X-Frontend-Id': '6',
      },
      mode: 'cors',
      credentials: 'include',
    })
    const json = (await res.json()) as V1DAnimeLinksResponse

    if (isResponseOk(json)) {
      return json.data.items[0] ?? null
    }
  } catch (err) {
    logger.error('api/niconico/channelVideoDAnimeLinks', err)
  }

  return null
}
