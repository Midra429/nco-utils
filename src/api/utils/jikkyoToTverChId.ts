import type { JikkyoChannelId, TVerChannelId } from '@/types/api/constants'

import { CHANNEL_IDS_JIKKYO_TVER } from '@/api/constants'

export function jikkyoToTverChId(jkChId: JikkyoChannelId): TVerChannelId | null {
  return CHANNEL_IDS_JIKKYO_TVER.find((v) => v[0] === jkChId)?.[1] ?? null
}
