import type { ParsedResult } from '@/parse'
import type { GetDataFormatted } from '@/types/api/nicolog/get'

import { compare } from '@/compare'
import { parse } from '@/parse'
import * as nicologApi from '@/api/services/nicolog'

const FILE_NAME_SUFFIX_REGEXP =
  /(?:(?:振り返り)?上映会|一挙放送)(?:_raw)?\.xml$/

const IGNORE_FILE_NAME_SUFFIXES = [
  '_raw.xml',
  '振り返り上映会.xml',
  '一挙放送.xml',
]

export async function nicolog(
  input: string | ParsedResult
): Promise<GetDataFormatted | null> {
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

  const base = parse(`${parsed.titleStripped} ${parsed.season?.text ?? ''} #0`)
  const targetDirectories = directories.filter((dir) => {
    return compare(base, `${dir.name} #0`)
  })

  for (const directory of targetDirectories) {
    const directoryName = directory.name.replaceAll('/', ' ')
    const directoryPath = `${nicologApi.NICO_LIVE_ANIME_ROOT}/${directoryName}`

    // ファイルリスト
    const fileList = await nicologApi.list({
      path: directoryPath,
    })
    const files = fileList?.content.filter(({ is_dir, name }) => {
      return !is_dir && !IGNORE_FILE_NAME_SUFFIXES.some((v) => name.endsWith(v))
    })

    // ファイル
    const file = files?.find((file) => {
      const fileNameParsed = parse(
        file.name.replace(FILE_NAME_SUFFIX_REGEXP, '')
      )

      // 話数だけ一致
      return (
        fileNameParsed.isSingleEpisode &&
        fileNameParsed.episode?.number === parsed.episode!.number
      )
    })

    if (!file) continue

    const detail = await nicologApi.get({
      path: `${directoryPath}/${file.name}`,
    })

    return detail
  }

  return null
}
