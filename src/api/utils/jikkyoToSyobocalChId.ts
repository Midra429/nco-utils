import type { JikkyoChannelId, SyoboCalChannelId } from '@/types/api/constants'

import { CHANNEL_IDS_JIKKYO_SYOBOCAL } from '@/api/constants'

export function jikkyoToSyobocalChId(jkChId: JikkyoChannelId): SyoboCalChannelId | null {
  return CHANNEL_IDS_JIKKYO_SYOBOCAL.find((v) => v[0] === jkChId)?.[1] ?? null
}
