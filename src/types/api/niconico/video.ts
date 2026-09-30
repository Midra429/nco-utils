export type VideoResponse = VideoResponseOk | VideoResponseError

export interface VideoResponseOk {
  meta: {
    status: 200
    code: string
  }
  data: {
    googleTagManager: unknown
    metadata: unknown
    response: {
      $watchV4: {
        data: VideoData
      }
      pcweb: unknown
    }
  }
}

export interface VideoResponseError {
  meta: {
    status: number
    code: string
  }
  data: {
    metadata: unknown
    response: {
      statusCode: number
      errorCode: string
      reasonCode: string
    }
  }
}

export interface VideoData {
  responseType: string
  client: Client
  comment: VideoDataComment
  media: Media | null
  player: Player
  video: VideoDataVideo
  genre: Genre
  tags: Tags
  lazy: Lazy
  system: System
  viewer: VideoDataViewer
  videoAds: VideoAds
  videoLive: null
  payment: Payment
  baseVideo: BaseVideo
  metadata: Metadata
  okReason: string
}

export interface BaseVideo {
  baseVideoId: null
  contentType: null
  title: null
  thumbnail: null
}

export interface Client {
  nicosid: string
  watchId: string
  watchTrackId: string
}

export interface VideoDataComment {
  threads: Thread[]
  layers: Layer[]
  ng: Ng
  isAttentionRequired: boolean
  nvComment: NvComment
  assist: Assist
}

export interface Assist {
  sectionDurationSec: number
  minMatchCharacters: number
  ignorePostElapsedTimeSec: number
  ignoreCommentNgScoreThreshold: number
  commentCountThresholdList: Array<number[]>
  buttonDisplayDurationSec: number
  buttonDisplayOffsetSec: number
}

export interface Layer {
  index: number
  isTranslucent: boolean
  components: Component[]
}

export interface Component {
  threadId: number
  fork: number
  forkLabel: Fork
}

export type Fork = 'owner' | 'main' | 'easy'

export interface Ng {
  ngScore: NgScore
  owner: unknown[]
  viewer: NgViewer
}

export interface NgScore {
  isDisabled: boolean
}

export interface NgViewer {
  revision: number
  count: number
  items: ViewerItem[]
}

export interface ViewerItem {
  type: Type
  source: string
  registeredAt: Date
}

export type Type = 'id' | 'command'

export interface NvComment {
  threadKey: string
  server: string
  params: Params
}

export interface Params {
  targets: Target[]
  language: string
}

export interface Target {
  id: string
  fork: Fork
}

export interface Thread {
  id: number
  fork: number
  forkLabel: Fork
  videoId: string
  isPostTarget: boolean
  isOwnerThread: boolean
  is184Forced: boolean
  label: LabelEnum
  postNgReason: null
  syncBufferTime: number
}

export type LabelEnum = 'owner' | 'default' | 'community' | 'easy'

export interface Genre {
  key: string
  label: GenreLabelEnum
  isImmoral: boolean
  isDisabled: boolean
  isNotSet: boolean
}

export type GenreLabelEnum =
  | '未設定'
  | 'エンターテイメント'
  | 'ラジオ'
  | '音楽・サウンド'
  | 'ダンス'
  | '動物'
  | '自然'
  | '料理'
  | '旅行・アウトドア'
  | '乗り物'
  | 'スポーツ'
  | '社会・政治・時事'
  | '技術・工作'
  | '解説・講座'
  | 'アニメ'
  | 'ゲーム'
  | 'その他'
  | 'R-18'
  | '例のソレ'

export interface Lazy {
  authKey: string
}

export interface Media {
  contents: Contents
  isStoryboardAvailable: boolean
  accessRightKey: string
  hls: HLS
  lowDataMode: LowDataMode
}

export interface Contents {
  videos: VideoElement[]
  audios: Audio[]
}

export interface Audio {
  id: string
  isAvailable: boolean
  qualityLevel: number
  bitRate: number
  samplingRate: number
  integratedLoudness: number
  truePeak: number
  loudnessCollection: LoudnessCollection[]
  label: LabelClass
}

export interface LabelClass {
  quality: string
  bitrate: string
}

export interface LoudnessCollection {
  type: string
  value: number
}

export interface VideoElement {
  id: string
  isAvailable: boolean
  qualityLevel: number
  label: string
  bitRate: number
  width: number
  height: number
}

export interface HLS {
  url: string
  outputs: Output[]
  createdAt: Date
  expiredAt: Date
}

export interface Output {
  assetUnitNames: string[]
}

export interface LowDataMode {
  videoUpperLimit: number
  audioUpperLimit: number
}

export interface Metadata {
  jsonLd: JSONLd
  gtm: Gtm
}

export interface Gtm {
  channel: Channel | null
}

export interface Channel {
  id: string
  isMember: boolean
}

export interface JSONLd {
  owner: Owner
  videoObject: VideoObject
}

export interface Owner {
  id: string
  type: string
  name: string
  description: string
  iconUrl: string
}

export interface VideoObject {
  regionsAllowed: null | string
  expiresAt: Date | null
}

export interface Payment {
  ppv: Admission
  admission: Admission
  continuationBenefit: Admission
  premium: Admission
  watchableUserType: string
  commentableUserType: string
  billingType: string
}

export interface Admission {
  isEnabled: boolean
  showPromotion: boolean
}

export interface Player {
  comment: PlayerComment
  initialPlayback: null
  layerMode: number
}

export interface PlayerComment {
  isDefaultInvisible: boolean
}

export interface System {
  serverTime: Date
  isStellaAlive: boolean
  channelGtmContainerId: string
}

export interface Tags {
  items: TagsItem[]
  hasR18Tag: boolean
  isPublishedNicoscript: boolean
  edit: Edit
}

export interface Edit {
  isEditable: boolean
  uneditableReason: null | string
  editKey: null | string
}

export interface TagsItem {
  name: string
  isLocked: boolean
}

export interface VideoDataVideo {
  id: string
  contentType: string
  title: string
  description: string
  supplements: unknown[]
  count: Count
  duration: number
  thumbnail: Thumbnail
  registeredAt: Date
  permission: Permission
  hasLyrics: boolean
  isHighRiskVideo: boolean
  isChannelVideo: boolean
  isOwnedByViewer: boolean
  showOwnerMenu: boolean
  isLikedByViewer: boolean
}

export interface Count {
  view: number
  comment: number
  mylist: number
  like: number
}

export interface Permission {
  isPrivate: boolean
  isDeleted: boolean
  isAuthenticationRequired: boolean
  isEmbedPlayerAllowed: boolean
  isGiftAllowed: boolean
  isNgForVocacolleApp: boolean
  rating: Rating
}

export interface Rating {
  isAdult: boolean
}

export interface Thumbnail {
  normal: string
  middle: null | string
  large: null | string
  player: string
  ogp: string
  short: null
}

export interface VideoAds {
  additionalParams: VideoAdsAdditionalParams
  items: VideoAdsItem[]
  reason: null | string
}

export interface VideoAdsAdditionalParams {
  videoId: string
  videoDuration: number
  isAdultRatingNG: boolean
  isAuthenticationRequired: boolean
  isR18: boolean
  nicosid: string
  lang: string
  watchTrackId: string
  channelId?: string
  genre?: string
  gender: string
  age: number
}

export interface VideoAdsItem {
  type: string
  timingMs: null
  additionalParams: ItemAdditionalParams
}

export interface ItemAdditionalParams {
  linearType: string
  adIdx: number
  skipType: number
  pod: number
}

export interface VideoDataViewer {
  id: number
  nickname: string
  isPremium: boolean
  allowSensitiveContents: boolean
}
