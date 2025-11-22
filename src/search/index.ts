import { niconico } from './services/niconico'
import { syobocal } from './services/syobocal'
import { nicolog } from './services/nicolog'

export const ncoSearch = {
  niconico,
  syobocal,
  nicolog,
} as const
