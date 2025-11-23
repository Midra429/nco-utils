import type {
  Item,
  ChannelVideoDAnimeLinksResponse,
  ChannelVideoDAnimeLinksResponseOk,
} from '@/types/api/niconico/channelVideoDAnimeLinks'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://public-api.ch.nicovideo.jp/v1/user/channelVideoDAnimeLinks'

function isResponseOk(
  json: ChannelVideoDAnimeLinksResponse
): json is ChannelVideoDAnimeLinksResponseOk {
  return json.meta.status === 200
}

export async function channelVideoDAnimeLinks(videoId: string): Promise<Item | null> {
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
    const json = (await res.json()) as ChannelVideoDAnimeLinksResponse

    if (isResponseOk(json)) {
      return json.data.items[0] ?? null
    }
  } catch (err) {
    logger.error('api/niconico/channelVideoDAnimeLinks', err)
  }

  return null
}
