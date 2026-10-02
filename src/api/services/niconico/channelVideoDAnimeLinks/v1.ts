import type * as DAnimeLinksV1 from '@/types/api/niconico/channelVideoDAnimeLinks/v1'

import { logger } from '@/common/logger'

const API_BASE_URL =
  'https://public-api.ch.nicovideo.jp/v1/user/channelVideoDAnimeLinks'

function isResponseOk(
  json: DAnimeLinksV1.Response
): json is DAnimeLinksV1.ResponseOk {
  return json.meta.status === 200
}

export async function channelVideoDAnimeLinksV1(
  videoId: string
): Promise<DAnimeLinksV1.Item | null> {
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
    const json = (await res.json()) as DAnimeLinksV1.Response

    if (isResponseOk(json)) {
      return json.data.items[0] ?? null
    }
  } catch (err) {
    logger.error('api/niconico/channelVideoDAnimeLinks/v1', err)
  }

  return null
}
