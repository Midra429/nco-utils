import type { JikkyoChannelId, TVerChannelId } from '@/types/api/constants'

import { CHANNEL_IDS_JIKKYO_TVER } from '@/api/constants'

export function tverToJikkyoChId(
  tverChId: TVerChannelId
): JikkyoChannelId | null {
  return CHANNEL_IDS_JIKKYO_TVER.find((v) => v[1] === tverChId)?.[0] ?? null
}
