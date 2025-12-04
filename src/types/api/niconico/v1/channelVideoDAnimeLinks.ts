export type V1DAnimeLinksResponse =
  | V1DAnimeLinksResponseOk
  | V1DAnimeLinksResponseError

export interface V1DAnimeLinksResponseOk {
  meta: {
    status: 200
  }
  data: {
    items: V1DAnimeLinksItem[]
  }
}

export interface V1DAnimeLinksResponseError {
  meta: {
    status: number
    errorCode?: string
    errorMessage?: string
    errorDetails?: Record<string, string[]>
  }
}

export interface V1DAnimeLinksItem {
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
