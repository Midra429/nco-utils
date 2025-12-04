export interface ListResponse {
  code: number
  message: string
  data: ListData
}

export interface ListData {
  content: Content[]
  total: number
  readme: string
  header: string
  write: boolean
  provider: string
}

export interface Content {
  name: string
  size: number
  is_dir: boolean
  modified: string
  created: string
  sign: string
  thumb: string
  type: number
  hashinfo: string
  hash_info: null
}

export interface ListDataFormatted extends Omit<ListData, 'content'> {
  content: ContentFormatted[]
}

export interface ContentFormatted
  extends Omit<Content, 'modified' | 'created'> {
  modified: number
  created: number
}
