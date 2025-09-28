import type {
  SearchQuery,
  SearchQueryFieldKey,
  SearchResponse,
  SearchResponseOk,
} from '@/types/api/niconico/search'

import { logger } from '@/utils/logger'

const API_BASE_URL = 'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search'

function isResponseOk(json: SearchResponse): json is SearchResponseOk {
  return json.meta.status === 200
}

export async function search<FieldKey extends SearchQueryFieldKey = never>(
  query: SearchQuery<FieldKey>
): Promise<SearchResponseOk<FieldKey> | null> {
  const url = new URL(API_BASE_URL)

  url.searchParams.set('q', query.q)
  url.searchParams.set('_sort', query._sort)
  url.searchParams.set('_context', query._context)

  if (query.targets?.length) {
    url.searchParams.set('targets', query.targets.join())
  }

  if (query.fields?.length) {
    url.searchParams.set('fields', query.fields.join())
  }

  if (query.filters) {
    for (const [field, value] of Object.entries(query.filters)) {
      if (typeof value === 'undefined') continue

      const entries = Array.isArray(value)
        ? value.map((v, i) => [i, v])
        : Object.entries<string | number>(value)

      for (const [key, val] of entries) {
        if (typeof val === 'undefined') continue

        url.searchParams.set(`filters[${field}][${key}]`, val.toString())
      }
    }
  }

  if (query.jsonFilter) {
    url.searchParams.set('jsonFilter', JSON.stringify(query.jsonFilter))
  }

  if (typeof query._offset === 'number') {
    url.searchParams.set('_offset', query._offset.toString())
  }

  if (typeof query._limit === 'number') {
    url.searchParams.set('_limit', query._limit.toString())
  }

  try {
    const res = await fetch(url)
    const json = (await res.json()) as SearchResponse<FieldKey>

    if (!isResponseOk(json)) {
      throw new Error(`${json.meta.status} ${json.meta.errorCode}: ${json.meta.errorMessage}`)
    }

    return json
  } catch (err) {
    logger.error('api/niconico/search', err)
  }

  return null
}
