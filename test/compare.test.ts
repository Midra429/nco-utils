import { test, expect } from 'bun:test'

import { parse } from '@midra/nco-utils/parse'
import { compare } from '@midra/nco-utils/compare'

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
