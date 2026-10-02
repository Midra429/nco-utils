import * as v from 'valibot'

export type Response = ResponseOk | ResponseError

export interface ResponseOk {
  meta: {
    status: 200
    errorCode?: string
  }
  data: Data
}

export interface ResponseError {
  meta: {
    status: number
    errorCode?: string
  }
}

export interface Data {
  globalComments: GlobalComment[]
  threads: Thread[]
}

export interface GlobalComment {
  id: string
  count: number
}

export interface Thread {
  id: string
  fork: string
  commentCount: number
  comments: Comment[]
}

export const CommentSchema = v.object({
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
export type Comment = v.InferOutput<typeof CommentSchema>
