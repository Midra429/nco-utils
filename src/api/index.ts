import * as abema from './services/abema'
import * as danime from './services/danime'
import * as dmmTv from './services/dmmTv'
import * as fod from './services/fod'
import * as jikkyo from './services/jikkyo'
import * as netflix from './services/netflix'
import * as nhkPlus from './services/nhkPlus'
import * as nicolog from './services/nicolog'
import * as niconico from './services/niconico'
import * as syobocal from './services/syobocal'
import * as tver from './services/tver'
import * as unext from './services/unext'

export const ncoApi = {
  danime,
  abema,
  dmmTv,
  unext,
  fod,
  netflix,
  niconico,
  nhkPlus,
  tver,
  jikkyo,
  syobocal,
  nicolog,
} as const
