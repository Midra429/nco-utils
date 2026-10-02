import type * as ThreadsV1 from '@/types/api/niconico/threads/v1'
import type { WatchResponse } from '..'
import type { ThreadsV1RequestBody } from './v1'

import { threadsV1 } from './v1'

export async function threads(
  watchResponse: WatchResponse,
  additionals?: ThreadsV1RequestBody['additionals']
): Promise<ThreadsV1.Data | null> {
  const { type, data, rawData } = watchResponse

  switch (type) {
    case 'v3':
    case 'v4': {
      return threadsV1({
        videoId: data.video.id,
        nvComment: rawData.comment.nvComment,
        additionals,
      })
    }
  }

  // return null
}
