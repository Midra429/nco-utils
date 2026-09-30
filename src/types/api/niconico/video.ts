export type VideoResponse = VideoResponseOk | VideoResponseError

export interface VideoResponseOk {
  meta: {
    status: 200
    code: string
  }
  data: VideoResponseData
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
      deletedMessage: null
      publishScheduledAt: null
      dataSet: null
    }
  }
}

export interface VideoResponseData {
  metadata: Metadata
  googleTagManager: GoogleTagManager
  response: Response
}

export interface GoogleTagManager {
  user: User
  content: Content
}

export interface Content {
  player_type: string
  genre: string
  content_type: string
  channel_id?: string
  ch_register_status?: string
  pay_status?: string
}

export interface User {
  login_status: string
  user_id: string
  member_status: string
  ui_area: string
  ui_lang: string
}

export interface Metadata {
  title: string
  linkTags: LinkTag[]
  metaTags: MetaTag[]
  jsonLds: JSONLdElement[]
}

export interface JSONLdElement {
  '@context': string
  '@type': JSONLdType
  '@id'?: string
  name?: string
  description?: string
  caption?: string
  url?: string
  duration?: string
  uploadDate?: Date
  embedUrl?: string
  interactionStatistic?: InteractionStatistic[]
  commentCount?: number
  thumbnail?: ThumbnailElement[]
  thumbnailUrl?: string[]
  requiresSubscription?: boolean
  isAccessibleForFree?: boolean
  regionsAllowed?: string
  expires?: Date
  keywords?: string
  genre?: string
  playerType?: string
  provider?: Provider
  author?: Author
  itemListElement?: ItemListElement[]
}

export type JSONLdType = 'VideoObject' | 'WebSite' | 'BreadcrumbList'

export interface Author {
  '@type': string
  name: string
  image: string
  url: string
  description?: string
}

export interface InteractionStatistic {
  '@type': InteractionStatisticType
  interactionType: string
  userInteractionCount: number
}

export type InteractionStatisticType = 'InteractionCounter'

export interface ItemListElement {
  '@type': ItemListElementType
  position: number
  item: string
  name: string
}

export type ItemListElementType = 'ListItem'

export interface Provider {
  '@type': string
  name: string
}

export interface ThumbnailElement {
  '@type': ThumbnailType
  url: string
  width?: number
  height?: number
}

export type ThumbnailType = 'ImageObject'

export interface LinkTag {
  rel: Rel
  href: string
  attrs: unknown[] | AttrsClass
}

export interface AttrsClass {
  type?: AttrsType
  sizes?: Sizes
  as?: As
  class?: Class
  media?: string
  fetchpriority?: string
}

export type As = 'script' | 'image'

export type Class = 'Canonical' | 'Alternate'

export type Sizes = '32x32' | '48x48' | '96x96' | '144x144'

export type AttrsType = 'image/png'

export type Rel =
  | 'shortcut icon'
  | 'icon'
  | 'preconnect'
  | 'preload'
  | 'canonical'
  | 'alternate'

export interface MetaTag {
  name?: string
  content: string
  property?: string
}

export interface Response {
  $watchV4: WatchV4
  pcweb: Pcweb
}

export interface WatchV4 {
  data: WatchV4Data
}

export interface WatchV4Data {
  responseType: string
  client: Client
  comment: DataComment
  media: Media | null
  player: Player
  video: DataVideo
  genre: Genre
  tags: Tags
  lazy: Lazy
  system: System
  viewer: DataViewer
  videoAds: VideoAds
  videoLive: null
  payment: Payment
  baseVideo: BaseVideo
  metadata: WatchMetadata
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

export interface DataComment {
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
  type: PurpleType
  source: string
  registeredAt: Date
}

export type PurpleType = 'id' | 'command'

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
  quality: Quality
  bitrate: string
}

export type Quality = '高音質' | '標準音質' | '低音質'

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

export interface WatchMetadata {
  jsonLd: PurpleJSONLd
  gtm: Gtm
}

export interface Gtm {
  channel: Channel | null
}

export interface Channel {
  id: string
  isMember: boolean
}

export interface PurpleJSONLd {
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

export interface DataVideo {
  id: string
  contentType: string
  title: string
  description: string
  supplements: unknown[]
  count: Count
  duration: number
  thumbnail: VideoThumbnail
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

export interface VideoThumbnail {
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
  type: LinearTypeEnum
  timingMs: number | null
  additionalParams: ItemAdditionalParams
}

export interface ItemAdditionalParams {
  linearType: LinearTypeEnum
  adIdx: number
  skipType: number
  pod: number
}

export type LinearTypeEnum = 'preroll' | 'midroll' | 'postroll'

export interface DataViewer {
  id: number
  nickname: string
  isPremium: boolean
  allowSensitiveContents: boolean
}

export interface Pcweb {
  prebidAdSlotName: string
}
