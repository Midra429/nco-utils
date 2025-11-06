import type { ChatItem } from '@/types/api/niconico/legacy'

/**
 * レスポンスのフォーマット
 */
export type JikkyoKakologFormat = 'xml' | 'json'

/**
 * パラメータ
 */
export interface JikkyoKakologParams<Format extends JikkyoKakologFormat> {
  starttime: number | Date
  endtime: number | Date
  format: Format
}

export interface JikkyoKakologResponseJsonOk {
  packet: {
    chat: ChatItem
  }[]
}

export interface JikkyoKakologResponseJsonError {
  error: string
}

export type JikkyoKakologResponseOk<Format extends JikkyoKakologFormat> =
  | (Format extends 'xml' ? string : never)
  | (Format extends 'json' ? JikkyoKakologResponseJsonOk : never)

export type JikkyoKakologResponseError<Format extends JikkyoKakologFormat> =
  | (Format extends 'xml' ? undefined : never)
  | (Format extends 'json' ? JikkyoKakologResponseJsonError : never)

export type JikkyoKakologResponse<Format extends JikkyoKakologFormat> =
  | JikkyoKakologResponseOk<Format>
  | JikkyoKakologResponseError<Format>
