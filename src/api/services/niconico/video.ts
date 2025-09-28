import type { VideoResponse, VideoResponseOk, VideoData } from '@/types/api/niconico/video'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://www.nicovideo.jp/watch/'

function isVideoId(id: string): boolean {
  return /^[a-z]{2}\d+$/.test(id)
}

function isResponseOk(json: VideoResponse): json is VideoResponseOk {
  return json.meta.status === 200
}

export async function video(
  contentId: string,
  credentials?: RequestInit['credentials']
): Promise<VideoData | null> {
  if (isVideoId(contentId)) {
    const url = new URL(contentId, API_BASE_URL)

    url.searchParams.set('responseType', 'json')

    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials,
      })
      const json = (await res.json()) as VideoResponse

      if (!isResponseOk(json)) {
        throw new Error(`${json.meta.status} ${json.meta.code}: ${json.data.response}`)
      }

      return json.data.response
    } catch (err) {
      logger.error('api/niconico/video', err)
    }
  }

  return null
}

export function multipleVideo(
  contentIds: string[],
  credentials?: RequestInit['credentials']
): Promise<(VideoData | null)[]> {
  return Promise.all(contentIds.map((contentId) => video(contentId, credentials)))
}
