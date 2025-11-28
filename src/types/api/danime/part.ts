export interface PartResponse {
  resultCd: string
  version: string
  selfLink: string
  data: PartData
}

export interface PartData {
  appType: string
  partId: string
  workTitle: string
  workTitleKana: string
  mainKeyVisualPath: string
  partDispNumber: string
  partExp: string
  partTitle: string
  partMeasureSecond: number
  mainScenePath: string
  partIndex: number
  serviceId: string
  oneTimeKey: string
  viewOneTimeToken: string
  movieFilename: null
  movieFileSize: null
  movieFileSizeList: null
  title: string
  webInitiatorUri: string
  contentUri: string[]
  contentUrls: ContentUrls
  defaultPlay: string
  laUrl: string
  castCustomDataUrl: string
  castOneTimeKey: string
  castContentUri: string
  apiUrl: string
  thumbnailUrl: string
  startStatus: string
  resumePoint: number
  resumePointLastUpdate: number
  resumeInfoUrl: string
  resumeInfoUrlExpiration: number
  keepAliveInterval: number
  resumeInfoSendMode: number
  resumeFlag: string
  multideviceState: number
  snsTwitter: string
  snsFacebook: string
  snsGoogle: string
  snsHatebu: string
  snsLine: string
  prevTitle: string | null
  prevMainScenePath: string
  prevPartDispNumber: string
  prevPartTitle: string
  prevPartExp: string
  prevContentInfoUri: string | null
  nextTitle: string
  nextMainScenePath: string
  nextPartDispNumber: string
  nextPartTitle: string
  nextPartExp: string
  nextContentInfoUri: string | null
  previousWebViewUrl: null
  adPartId: null
  adContentUri: null
  advertiser: null
  adClickUri: null
  adNotifyUri: null
  adSkipCount: null
  chapters: Chapter[]
  skipWaitTime: number
  minTimeToSkip: number
  recommendContentInfo: any[]
  animeNextContentInfoTitle: string
  animeRecommendInfoTitle: string
  bookWorkInfoTitle: string
  bookRecommendInfoTitle: string
  bookRecommendInfoUri: string
  productsRecommendInfoTitle: string
  productsRecommendInfoUri: string
  goodsProductsDetailInfoUri: string
  bookSpecifiedVolumeInfoTitle: string
  bookSpecifiedVolumeInfoUri: string
  afterJoinPromotionBannerUrl: null
  opSkipAvailable: string
}

export interface ContentUrls {
  highest: string
  high: string
  middle: string
  low: string
  lowest: string
}

export interface Chapter {
  type: ChapterType
  start: number
  end: number
  showInterface?: boolean
}

export type ChapterType = 'none' | 'avant' | 'mainStory' | 'cPart'
