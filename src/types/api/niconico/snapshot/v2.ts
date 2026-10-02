import type { NiconicoGenre } from '@/types/api/constants'

/**
 * スナップショット検索API v2
 * @see https://site.nicovideo.jp/search-api-docs/snapshot
 */

/**
 * レスポンス
 */
export type Response<FieldKey extends QueryFieldKey = never> =
  | ResponseOk<FieldKey>
  | ResponseError

/**
 * レスポンス (成功)
 */
export interface ResponseOk<FieldKey extends QueryFieldKey = never> {
  /**
   * レスポンスのメタ情報フィールド
   */
  meta: {
    /** HTTPステータス */
    status: 200

    /** リクエストID */
    id: string

    /** ヒット件数 */
    totalCount: number
  }

  /**
   * ヒットしたコンテンツ。\
   * 要素の内容はパラメータ`fields`によって異なります
   */
  data: Data<FieldKey>[]
}

/**
 * レスポンス (エラー)
 */
export interface ResponseError {
  /**
   * レスポンスのメタ情報フィールド
   */
  meta: {
    /** HTTPステータス */
    status: number

    /** エラーコード */
    errorCode: string

    /** エラー内容 */
    errorMessage: string
  }
}

/**
 * コンテンツ
 */
export type Data<FieldKey extends QueryFieldKey = never> = {
  [key in FieldKey]: key extends
    | 'userId'
    | 'channelId'
    | 'lastResBody'
    | 'lastCommentTime'
    | 'categoryTags'
    | 'tags'
    | 'genre'
    ? Fields[key] | null
    : Fields[key]
}

/**
 * フィールド
 */
export interface Fields {
  /**
   * コンテンツID。\
   * `https://nico.ms/`の後に連結することでコンテンツへのURLになります。
   */
  contentId: string

  /** タイトル */
  title: string

  /** コンテンツの説明文。 */
  description: string

  /** ユーザー投稿動画の場合、投稿者のユーザーID */
  userId: number

  /** チャンネル動画の場合、チャンネルID */
  channelId: number

  /** 再生数 */
  viewCounter: number

  /** マイリスト数またはお気に入り数。 */
  mylistCounter: number

  /** いいね！数 */
  likeCounter: number

  /** 再生時間(秒) */
  lengthSeconds: number

  /** サムネイルのURL */
  thumbnailUrl: string

  /** コンテンツの投稿時間。 */
  startTime: string

  /** 最新のコメント */
  lastResBody: string

  /** コメント数 */
  commentCounter: number

  /** 最終コメント時間 */
  lastCommentTime: number

  /** カテゴリタグ */
  categoryTags: string

  /** タグ(空白区切り) */
  tags: string

  /** タグ完全一致(空白区切り) */
  tagsExact: string

  /** ジャンル */
  genre: string

  /** ジャンル完全一致 */
  'genre.keyword': NiconicoGenre

  /** 動画の種別 */
  contentType: 'long' | 'short'
}

export type FieldKey = keyof Fields

export type QueryFieldKey = Exclude<FieldKey, 'tagsExact' | 'genre.keyword'>

export type QueryFiltersKey = Exclude<
  FieldKey,
  | 'title'
  | 'description'
  | 'userId'
  | 'channelId'
  | 'thumbnailUrl'
  | 'lastResBody'
>

export type QuerySortKey = Extract<
  FieldKey,
  `${string}${'Counter' | 'Seconds' | 'Time'}`
>

export type SearchQuerySort = `${'-' | '+'}${QuerySortKey}`

/**
 * クエリパラメータ
 */
export interface QueryParameters<FieldKey extends QueryFieldKey = never> {
  /**
   * 検索キーワードです。
   * @example 'ゲーム'
   */
  q: string

  /**
   * 検索対象のフィールドです。\
   * キーワード検索の場合、`['title', 'description', 'tags']`を指定してください。\
   * タグ検索（キーワードに完全一致するタグがあるコンテンツをヒット）の場合、`['tagsExact']`を指定してください。\
   * キーワード無し検索の場合は省略できます。
   * @example ['title', 'description', 'tags']
   */
  targets?: FieldKey[]

  /**
   * レスポンスに含みたいヒットしたコンテンツのフィールドです。
   * @example ['contentId', 'title', 'description', 'tags']
   */
  fields?: FieldKey[]

  /**
   * 検索結果をフィルタの条件にマッチするコンテンツだけに絞ります。
   */
  filters?: QueryFilters

  /**
   * OR や AND の入れ子など複雑なフィルター条件を使う場合のみに使用します。\
   * OR / AND / NOT 単体で使用する場合は`filters`を使ってください。
   */
  jsonFilter?: QueryJsonFilter

  /**
   * ソート順をソートの方向の記号とフィールド名を連結したもので指定します。\
   * ソートの方向は昇順または降順かを`'+'`か`'-'`で指定してください。
   */
  _sort: SearchQuerySort

  /**
   * 返ってくるコンテンツの取得オフセット。最大:100,000
   * @default 0
   * @example 10
   */
  _offset?: number

  /**
   * 返ってくるコンテンツの最大数。最大:100
   * @default 10
   * @example 10
   */
  _limit?: number

  /**
   * サービスまたはアプリケーション名。最大:40文字
   * @example 'apiguide'
   */
  _context: string
}

/**
 * フィルター
 */
export type QueryFilters = {
  [key in QueryFiltersKey]?:
    | Fields[key][]
    | {
        /** `gt <` (超過) */
        gt?: Fields[key]
        /** `< lt` (未満) */
        lt?: Fields[key]
        /** `gte <=` (以上) */
        gte?: Fields[key]
        /** `<= lte` (以下) */
        lte?: Fields[key]
      }
}

/**
 * JSONフィルター
 */
export type QueryJsonFilter =
  | {
      [key in QueryFiltersKey]:
        | {
            type: 'equal'

            /** 対象にしたいフィールド */
            field: key

            /** 対象にしたい値 */
            value: Fields[key]
          }
        | {
            type: 'range'

            /** 対象にしたいフィールド */
            field: key

            /** 範囲の始点の値 */
            from: Fields[key]

            /** 範囲の終点の値 */
            to: Fields[key]

            /** `from`の値を範囲に含めるか */
            include_lower?: boolean

            /** `to`の値を範囲に含めるか */
            include_upper?: boolean
          }
    }[QueryFiltersKey]
  | {
      type: 'or' | 'and'

      /** JSONフィルターの配列 */
      filters: QueryJsonFilter[]
    }
  | {
      type: 'not'

      /** JSONフィルター */
      filter: QueryJsonFilter
    }
