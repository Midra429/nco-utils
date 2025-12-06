import { expect, test } from 'bun:test'

import { compare } from '@midra/nco-utils/compare'
import { parse } from '@midra/nco-utils/parse'

import examples from './compare-examples.json'

test('compare', () => {
  examples.forEach((val) => {
    const parsedA = parse(val[0]!)
    const parsedB = parse(val[1]!)
    const result = compare(parsedA, parsedB)

    if (!result) {
      console.error({
        A: parsedA,
        B: parsedB,
      })

      expect().fail(`A: ${val[0]}\nB: ${val[1]}`)
    }
  })
})
