import type { BuildSearchQueryArgs } from '@midra/nco-utils/search/lib/buildSearchQuery'

import { test } from 'bun:test'

// import { parse } from '@midra/nco-utils/parse'
// import { ncoApi } from '@midra/nco-utils/api'
import { ncoSearch } from '@midra/nco-utils/search'
import { buildSearchQuery } from '@midra/nco-utils/search/lib/buildSearchQuery'

const args: BuildSearchQueryArgs = {
  input: '月が導く異世界道中　第二幕 第一夜 え？荒城の月？',
  duration: 1420,
  targets: {
    official: true,
    danime: true,
  },
  userAgent: 'api-test',
}

test('playground:buildSearchQuery', () => {
  const query = buildSearchQuery(args)

  console.log(JSON.stringify(query, null, 2))
})

test('playground:search.niconico', async () => {
  const result = await ncoSearch.niconico(args)

  console.log(JSON.stringify(result, null, 2))
})

test('playground:search.syobocal', async () => {
  const result = await ncoSearch.syobocal({
    input: args.input,
    userAgent: args.userAgent,
  })

  console.log(JSON.stringify(result?.programs, null, 2))
})
