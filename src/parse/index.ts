import type { ExtractedResult } from './libs/extract'

import { normalize } from './libs/normalize'
import { clean } from './libs/clean'
import { extract } from './libs/extract'

/**
 * アニメタイトルを解析
 * @description `normalize` -> `clean` -> `extract`
 */
export function parse(input: string | ExtractedResult): ExtractedResult {
  if (typeof input !== 'string') {
    return input
  }

  input = normalize(input)
  input = clean(input)

  return extract(input)
}
