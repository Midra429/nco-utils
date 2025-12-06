import type { ParsedResult } from '@/parse'

import { compare } from '@/compare'
import { parse } from '@/parse'
import * as nicologApi from '@/api/services/nicolog'

const FILE_NAME_SUFFIX_REGEXP =
  /(?:(?:振り返り)?上映会|一挙放送)(?:_raw)?\.xml$/

export async function nicolog(input: string | ParsedResult) {
  const parsed = parse(input)

  if (!parsed.isSingleEpisode || !parsed.title || !parsed.episode) {
    return null
  }

  // 作品リスト
  const directoryList = await nicologApi.list()
  const directories = directoryList?.content.filter((v) => v.is_dir)

  if (!directories?.length) {
    return null
  }

  const base = parse(`${parsed.titleStripped} #0`)
  const directory = directories.find((v) => compare(base, `${v.name} #0`))

  if (!directory) {
    return null
  }

  // ファイルリスト
  const fileList = await nicologApi.list({
    path: `${nicologApi.NICO_LIVE_ANIME_ROOT}/${directory.name}`,
  })
  const files = fileList?.content.filter(
    (v) => !v.is_dir && !v.name.endsWith('_raw.xml')
  )

  if (!files?.length) {
    return null
  }

  const file = files.find((v) =>
    compare(parsed, v.name.replace(FILE_NAME_SUFFIX_REGEXP, ''))
  )

  if (!file) {
    return null
  }

  const detail = await nicologApi.get({
    path: `${nicologApi.NICO_LIVE_ANIME_ROOT}/${directory.name}/${file.name}`,
  })

  return detail
}
