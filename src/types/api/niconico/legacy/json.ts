import * as v from 'valibot'

export type LegacyJson = LegacyJsonItem[]
export type LegacyJsonOutput = LegacyJsonItemOutput[]

export type LegacyJsonItem =
  | { ping: LegacyJsonPing }
  | { thread: LegacyJsonThread }
  | { leaf: LegacyJsonLeaf }
  | { global_num_res: LegacyJsonGlobalNumRes }
  | { chat: LegacyJsonChat }
export type LegacyJsonItemOutput =
  | { ping: LegacyJsonPing }
  | { thread: LegacyJsonThread }
  | { leaf: LegacyJsonLeaf }
  | { global_num_res: LegacyJsonGlobalNumRes }
  | { chat: LegacyJsonChatOutput }

export interface LegacyJsonPing {
  content: string
}

export interface LegacyJsonThread {
  resultcode: number
  thread: string
  server_time: number
  last_res: number
  ticket: string
  revision: number
}

export interface LegacyJsonLeaf {
  thread: string
  leaf?: number
  count: number
}

export interface LegacyJsonGlobalNumRes {
  thread: string
  num_res: number
}

export const LegacyJsonChatSchema = v.object({
  /**
   * コメントのスレッド ID
   */
  thread: v.optional(v.string()),

  /**
   * コメント番号（コメ番）
   */
  no: v.number(),

  /**
   * スレッド ID から起算したコメントの再生位置
   * @description 1/100秒
   */
  vpos: v.number(),

  leaf: v.optional(v.number()),

  /**
   * コメント投稿時間の UNIX タイムスタンプ
   */
  date: v.number(),

  /**
   * コメント投稿時間の小数点以下の時間
   * @description コメント投稿時間の正確なタイムスタンプは\
   * date: 1606431600・date_usec: 257855 なら 1606431600.257855 のようになる
   */
  date_usec: v.optional(v.number(), 0),

  nicoru: v.optional(v.number(), 0),

  /**
   * コメントしたユーザーがプレミアム会員であれば 1
   */
  premium: v.optional(v.number()),

  /**
   * 匿名コメントであれば 1
   */
  anonymity: v.optional(v.number()),

  /**
   * 削除フラグ？
   */
  deleted: v.optional(v.number()),

  /**
   * ユーザー ID
   * @description コマンドに 184 が指定されている場合は匿名化される
   */
  user_id: v.pipe(v.string(), v.minLength(1)),

  /**
   * コメントのコマンド
   * @description 184, red naka big など
   */
  mail: v.optional(
    v.pipe(
      v.string(),
      v.transform((v) => v.split(' '))
    ),
    ''
  ),

  /**
   * コメント本文
   * @description AA など、まれに複数行コメントがあるので注意
   */
  content: v.string(),
})
export type LegacyJsonChat = v.InferInput<typeof LegacyJsonChatSchema>
export type LegacyJsonChatOutput = v.InferOutput<typeof LegacyJsonChatSchema>
