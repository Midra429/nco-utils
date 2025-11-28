import * as v from 'valibot'

export interface V1Threads {
  meta: V1ThreadsMeta
  data?: V1ThreadsData
}

export interface V1ThreadsMeta {
  status: number
  errorCode?: string
}

export interface V1ThreadsData {
  globalComments: {
    id: string
    count: number
  }[]
  threads: V1Thread[]
}

export interface V1Thread {
  id: string
  fork: string
  commentCount: number
  comments: V1Comment[]
}

export const V1CommentSchema = v.object({
  id: v.string(),
  no: v.number(),
  vposMs: v.number(),
  body: v.string(),
  commands: v.array(v.string()),
  userId: v.string(),
  isPremium: v.boolean(),
  score: v.number(),
  postedAt: v.string(),
  nicoruCount: v.number(),
  nicoruId: v.nullable(v.string()),
  source: v.string(),
  isMyPost: v.boolean(),
})
export type V1Comment = v.InferOutput<typeof V1CommentSchema>
