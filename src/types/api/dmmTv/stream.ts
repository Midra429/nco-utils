export interface StreamResponse {
  data: StreamData
}

export interface StreamData {
  stream: Stream
}

export interface Stream {
  chapter: Chapter
}

export interface Chapter {
  op: ChapterData | null
  ed: ChapterData | null
  skippable: ChapterData | null
}

export interface ChapterData {
  start: number
  end: number
}
