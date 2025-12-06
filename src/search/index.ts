import { nicolog } from './services/nicolog'
import { niconico } from './services/niconico'
import { syobocal } from './services/syobocal'

export const ncoSearch = {
  niconico,
  syobocal,
  nicolog,
} as const
