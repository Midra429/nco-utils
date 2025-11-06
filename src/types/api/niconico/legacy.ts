export interface LegacyApiXml {
  packet: {
    thread: {
      resultcode: string
      thread: string
      server_time: string
      ticket: string
      revision: string
    }

    global_num_res: {
      thread: string
      num_res: string
    }

    chat: ChatItem | ChatItem[]
  }
}

export interface ChatItem {
  /**
   * コメントのスレッド ID
   */
  thread?: string

  /**
   * コメント番号（コメ番）
   */
  no?: string

  /**
   * スレッド ID から起算したコメントの再生位置
   * @description 1/100秒
   */
  vpos: string

  /**
   * コメント投稿時間の UNIX タイムスタンプ
   */
  date?: string

  /**
   * コメント投稿時間の小数点以下の時間
   * @description コメント投稿時間の正確なタイムスタンプは\
   * date: 1606431600・date_usec: 257855 なら 1606431600.257855 のようになる
   */
  date_usec?: string

  /**
   * ユーザー ID
   * @description コマンドに 184 が指定されている場合は匿名化される
   */
  user_id?: string

  /**
   * コメントのコマンド
   * @description 184, red naka big など
   */
  mail?: string

  /**
   * コメントしたユーザーがプレミアム会員であれば 1
   */
  premium?: '1'

  /**
   * 匿名コメントであれば 1
   */
  anonymity?: '1'

  /**
   * NX-Jikkyo に投稿されたコメントであれば 1 (過去ログ API 独自のフィールド)
   * ニコニコ実況に投稿されたコメントでは省略される
   */
  nx_jikkyo?: '1'

  /**
   * コメント本文
   * @description AA など、まれに複数行コメントがあるので注意
   */
  content: string

  /**
   * 削除フラグ？
   */
  deleted?: string
}
