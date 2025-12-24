import type { Stream, StreamResponse } from '@/types/api/dmmTv/stream'

import { logger } from '@/common/logger'

const API_BASE_URL = 'https://api.tv.dmm.com/graphql'

const query = `
query FetchStream(
  $id: ID!
  $protectionCapabilities: [ProtectionCapability!]!
  $audioChannelLayouts: [StreamingAudioChannelLayout!]!
  $device: PlayDevice!
) {
  stream(
    id: $id
    protectionCapabilities: $protectionCapabilities
    audioChannelLayouts: $audioChannelLayouts
    device: $device
  ) {
    chapter {
      op {
        start
        end
      }
      ed {
        start
        end
      }
      skippable {
        start
        end
      }
    }
  }
}
`.trim()

export interface StreamVariables {
  id: string
}

export async function stream(
  variables: StreamVariables
): Promise<Stream | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'FetchStream',
        query,
        variables: {
          protectionCapabilities: [
            {
              systemId: 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed',
              format: 'DASH',
              audio: [],
              video: [
                {
                  codec: 'AVC',
                  bpc: 8,
                  rate: 497664000,
                },
              ],
            },
          ],
          audioChannelLayouts: [],
          device: 'BROWSER',
          ...variables,
        },
      }),
    })
    const json = (await res.json()) as StreamResponse

    if (json.data.stream) {
      return json.data.stream
    }
  } catch (err) {
    logger.error('api/dmmTv/stream', err)
  }

  return null
}
