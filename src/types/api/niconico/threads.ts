import type { V1Thread } from '@xpadev-net/niconicomments'

export interface Threads {
  meta: ThreadsMeta
  data?: ThreadsData
}

export interface ThreadsMeta {
  status: number
  errorCode?: string
}

export interface ThreadsData {
  globalComments: {
    id: string
    count: number
  }[]
  threads: V1Thread[]
}
