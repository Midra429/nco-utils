export type ThreadKey = {
  meta: ThreadKeyMeta
  data?: ThreadKeyData
}

export type ThreadKeyMeta = {
  status: number
  errorCode?: string
}

export type ThreadKeyData = {
  threadKey: string
}
