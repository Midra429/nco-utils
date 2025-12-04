import type { JikkyoChannelId, SyoboCalChannelId } from '@/types/api/constants'

import { CHANNEL_IDS_JIKKYO_SYOBOCAL } from '@/api/constants'

export function syobocalToJikkyoChId(
  scChId: SyoboCalChannelId
): JikkyoChannelId | null {
  return CHANNEL_IDS_JIKKYO_SYOBOCAL.find((v) => v[1] === scChId)?.[0] ?? null
}
