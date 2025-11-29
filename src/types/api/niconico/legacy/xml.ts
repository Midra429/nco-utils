import * as v from 'valibot'

export interface LegacyXml {
  packet: {
    thread?: LegacyXmlThread[]
    global_num_res?: LegacyXmlGlobalNumRes[]
    chat: LegacyXmlChat[]
  }
}
export interface LegacyXmlOutput {
  packet: {
    thread?: LegacyXmlThread[]
    global_num_res?: LegacyXmlGlobalNumRes[]
    chat: LegacyXmlChatOutput[]
  }
}

export interface LegacyXmlThread {
  resultcode: string
  thread: string
  server_time: string
  ticket: string
  revision: string
}

export interface LegacyXmlGlobalNumRes {
  thread: string
  num_res: string
}

export const LegacyXmlChatSchema = v.object({
  /**
   * コメントのスレッド ID
   */
  thread: v.optional(v.string()),

  /**
   * コメント番号（コメ番）
   */
  no: v.pipe(v.string(), v.toNumber()),

  /**
   * スレッド ID から起算したコメントの再生位置
   * @description 1/100秒
   */
  vpos: v.pipe(v.string(), v.toNumber()),

  /**
   * コメント投稿時間の UNIX タイムスタンプ
   */
  date: v.pipe(v.string(), v.toNumber()),

  /**
   * コメント投稿時間の小数点以下の時間
   * @description コメント投稿時間の正確なタイムスタンプは\
   * date: 1606431600・date_usec: 257855 なら 1606431600.257855 のようになる
   */
  date_usec: v.optional(v.pipe(v.string(), v.toNumber()), '0'),

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
   * コメントしたユーザーがプレミアム会員であれば 1
   */
  premium: v.optional(v.pipe(v.string(), v.toNumber())),

  /**
   * 匿名コメントであれば 1
   */
  anonymity: v.optional(v.pipe(v.string(), v.toNumber())),

  /**
   * NX-Jikkyo に投稿されたコメントであれば 1 (過去ログ API 独自のフィールド)
   * ニコニコ実況に投稿されたコメントでは省略される
   */
  nx_jikkyo: v.optional(v.pipe(v.string(), v.toNumber())),

  /**
   * 削除フラグ？
   */
  deleted: v.optional(v.pipe(v.string(), v.toNumber())),

  /**
   * コメント本文
   * @description AA など、まれに複数行コメントがあるので注意
   */
  content: v.pipe(v.string(), v.minLength(1)),
})
export type LegacyXmlChat = v.InferInput<typeof LegacyXmlChatSchema>
export type LegacyXmlChatOutput = v.InferOutput<typeof LegacyXmlChatSchema>
