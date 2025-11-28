export interface V1ThreadKeyResponse {
  meta: V1ThreadKeyMeta
  data?: V1ThreadKeyData
}

export interface V1ThreadKeyMeta {
  status: number
  errorCode?: string
}

export interface V1ThreadKeyData {
  threadKey: string
}
