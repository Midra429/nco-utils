import { closest, distance } from 'fastest-levenshtein'

function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length)

  if (max) {
    return (max - distance(a, b)) / max
  }

  return 1
}

export { distance, closest, similarity }
