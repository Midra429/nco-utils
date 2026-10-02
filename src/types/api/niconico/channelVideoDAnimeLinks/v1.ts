export type Response = ResponseOk | ResponseError

export interface ResponseOk {
  meta: {
    status: 200
  }
  data: Data
}

export interface ResponseError {
  meta: {
    status: number
    errorCode?: string
    errorMessage?: string
    errorDetails?: Record<string, string[]>
  }
}

export interface Data {
  items: Item[]
}

export interface Item {
  channel: Channel
  isChannelMember: boolean
  linkedVideoId: string
}

export interface Channel {
  id: number
  name: string
  description: string
  isFree: boolean
  screenName: string
  ownerName: string
  isAdult: boolean
  price: number
  bodyPrice: number
  url: string
  thumbnailUrl: string
  thumbnailSmallUrl: string
  canAdmit: boolean
}
