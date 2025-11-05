export interface ThreadKey {
  meta: ThreadKeyMeta
  data?: ThreadKeyData
}

export interface ThreadKeyMeta {
  status: number
  errorCode?: string
}

export interface ThreadKeyData {
  threadKey: string
}
