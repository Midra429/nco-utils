import { test, expect } from 'bun:test'
import equal from 'fast-deep-equal'

import { parse } from '@midra/nco-utils/parse'

import examples from './parse-examples.json'

test('parse', () => {
  examples.forEach((val) => {
    const result = parse(val.input)

    function fail(name: string) {
      const id = val.id.toString().padStart(3, '0')

      console.log(`${id}:`, result)

      expect().fail(`${id}: ${name}`)
    }

    if (result.title !== val.title) {
      fail('title')

      return
    }

    if (
      val.season &&
      (result.season?.text !== val.season.text || result.season?.number !== val.season.number)
    ) {
      fail('season')

      return
    }

    if (result.isSingleEpisode) {
      if (
        val.episode &&
        (result.episode?.text !== val.episode.text || result.episode?.number !== val.episode.number)
      ) {
        fail('episode')

        return
      }

      if (
        val.episodeAlt &&
        (result.episodeAlt?.text !== val.episodeAlt.text ||
          result.episodeAlt?.number !== val.episodeAlt.number)
      ) {
        fail('episodeAlt')

        return
      }
    } else {
      if (
        val.episodes &&
        !equal(
          result.episodes?.map(({ text, number }) => ({ text, number })),
          val.episodes
        )
      ) {
        fail('episodes')

        return
      }

      if (val.episodesDivider && result.episodesDivider !== val.episodesDivider) {
        fail('episodesDivider')

        return
      }
    }

    if (val.subtitle && result.subtitle !== val.subtitle) {
      fail('subtitle')
    }

    return result
  })
})
