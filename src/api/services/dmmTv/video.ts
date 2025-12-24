import type { Video as $Video, VideoResponse } from '@/types/api/dmmTv/video'

import { logger } from '@/common/logger'

export type Video = Pick<
  $Video,
  | 'id'
  | 'titleName'
  | 'seasonName'
  | 'customTag'
  | 'categories'
  | 'relatedSeasons'
  | 'episode'
>

const API_BASE_URL = 'https://api.tv.dmm.com/graphql'

const query = `
query GetVideo($seasonId: ID!, $contentId: ID!, $isContentId: Boolean!) {
  video(id: $seasonId) {
    id
    titleName
    seasonName
    customTag
    categories {
      name
      id
    }
    ... on VideoSeason {
      relatedSeasons {
        id
        title
      }
      episode(id: $contentId) @include(if: $isContentId) {
        id
        episodeTitle
        episodeNumber
        episodeNumberName
      }
    }
  }
}
`.trim()

export interface VideoVariables {
  seasonId: string
  contentId: string
  // device?: string
  // playDevice?: string
  // isLoggedIn?: boolean
  // isContentId?: boolean
}

export async function video(variables: VideoVariables): Promise<Video | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'GetVideo',
        query,
        variables: {
          // device: 'BROWSER',
          // playDevice: 'BROWSER',
          // isLoggedIn: false,
          isContentId: true,
          ...variables,
        },
      }),
    })
    const json = (await res.json()) as VideoResponse

    if (json.data.video) {
      return json.data.video
    }
  } catch (err) {
    logger.error('api/dmmTv/video', err)
  }

  return null
}
