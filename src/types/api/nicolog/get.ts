export interface Get {
  code: number
  message: string
  data: GetData
}

export interface GetData {
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
  raw_url: string
  readme: string
  header: string
  provider: string
  related: Related[] | null
}

export interface Related {
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

export interface GetDataFormatted extends Omit<GetData, 'modified' | 'created' | 'related'> {
  modified: number
  created: number
  related: RelatedFormatted[] | null
}

export interface RelatedFormatted extends Omit<Related, 'modified' | 'created'> {
  modified: number
  created: number
}
