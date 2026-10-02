export interface Response {
  meta: Meta
  data?: Data
}

export interface Meta {
  status: number
  errorCode?: string
}

export interface Data {
  threadKey: string
}
