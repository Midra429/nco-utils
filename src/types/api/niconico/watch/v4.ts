export type Response = ResponseOk | ResponseError

export interface ResponseOk {
  meta: {
    status: 200
    code: string
  }
  data: ResponseData
}

export interface ResponseError {
  meta: {
    status: number
    code: string
  }
  data: ResponseErrorData
}

export interface ResponseErrorData {
  metadata: unknown
  response: ErrorData
}

export interface ErrorData {
  statusCode: number
  errorCode: string
  reasonCode: string
  deletedMessage: null
  publishScheduledAt: null
  dataSet: null
}

export interface ResponseData {
  metadata: Metadata
  googleTagManager: GoogleTagManager
  response: {
    $watchV4: {
      data: Data
    }
    pcweb: PcWeb
  }
}

export interface Data {
  responseType: string
  client: Client
  comment: Comment
  media: Media | null
  player: Player
  video: Video
  genre: Genre
  tags: Tags
  lazy: Lazy
  system: System
  viewer: Viewer
  videoAds: VideoAds
  videoLive: null
  payment: Payment
  baseVideo: BaseVideo
  metadata: WatchMetadata
  okReason: string
}

// ページメタデータ・Google Tag Manager

export interface Metadata {
  title: string
  linkTags: LinkTag[]
  metaTags: MetaTag[]
  jsonLds: JsonLdElement[]
}

export interface LinkTag {
  rel: LinkTagRel
  href: string
  attrs: unknown[] | LinkTagAttributes
}

export interface LinkTagAttributes {
  type?: LinkTagMimeType
  sizes?: LinkTagIconSize
  as?: LinkTagResourceType
  class?: LinkTagClass
  media?: string
  fetchpriority?: string
}

export type LinkTagRel =
  | 'shortcut icon'
  | 'icon'
  | 'preconnect'
  | 'preload'
  | 'canonical'
  | 'alternate'

export type LinkTagResourceType = 'script' | 'image'

export type LinkTagClass = 'Canonical' | 'Alternate'

export type LinkTagIconSize = '32x32' | '48x48' | '96x96' | '144x144'

export type LinkTagMimeType = 'image/png'

export interface MetaTag {
  name?: string
  content: string
  property?: string
}

export interface GoogleTagManager {
  user: GoogleTagManagerUser
  content: GoogleTagManagerContent
}

export interface GoogleTagManagerUser {
  login_status: string
  user_id: string
  member_status: string
  ui_area: string
  ui_lang: string
}

export interface GoogleTagManagerContent {
  player_type: string
  genre: string
  content_type: string
  channel_id?: string
  ch_register_status?: string
  pay_status?: string
}

// JSON-LD

export interface JsonLdElement {
  '@context': string
  '@type': JsonLdType
  '@id'?: string
  name?: string
  description?: string
  caption?: string
  url?: string
  duration?: string
  uploadstring?: string
  embedUrl?: string
  interactionStatistic?: JsonLdInteractionStatistic[]
  commentCount?: number
  thumbnail?: JsonLdThumbnail[]
  thumbnailUrl?: string[]
  requiresSubscription?: boolean
  isAccessibleForFree?: boolean
  regionsAllowed?: string
  expires?: string
  keywords?: string
  genre?: string
  playerType?: string
  provider?: JsonLdProvider
  author?: JsonLdAuthor
  itemListElement?: JsonLdItemListElement[]
}

export type JsonLdType = 'VideoObject' | 'WebSite' | 'BreadcrumbList'

export interface JsonLdAuthor {
  '@type': string
  name: string
  image: string
  url: string
  description?: string
}

export interface JsonLdProvider {
  '@type': string
  name: string
}

export interface JsonLdInteractionStatistic {
  '@type': JsonLdInteractionStatisticType
  interactionType: string
  userInteractionCount: number
}

export type JsonLdInteractionStatisticType = 'InteractionCounter'

export interface JsonLdItemListElement {
  '@type': JsonLdItemListElementType
  position: number
  item: string
  name: string
}

export type JsonLdItemListElementType = 'ListItem'

export interface JsonLdThumbnail {
  '@type': JsonLdThumbnailType
  url: string
  width?: number
  height?: number
}

export type JsonLdThumbnailType = 'ImageObject'

// クライアント

export interface Client {
  nicosid: string
  watchId: string
  watchTrackId: string
}

export interface Lazy {
  authKey: string
}

// コメント

export interface Comment {
  threads: CommentThread[]
  layers: CommentLayer[]
  ng: CommentNg
  isAttentionRequired: boolean
  nvComment: NvComment
  assist: CommentAssist
}

export interface CommentLayer {
  index: number
  isTranslucent: boolean
  components: CommentLayerComponent[]
}

export interface CommentLayerComponent {
  threadId: number
  fork: number
  forkLabel: CommentFork
}

export type CommentFork = 'owner' | 'main' | 'easy'

export interface CommentThread {
  id: number
  fork: number
  forkLabel: CommentFork
  videoId: string
  isPostTarget: boolean
  isOwnerThread: boolean
  is184Forced: boolean
  label: CommentThreadLabel
  postNgReason: null
  syncBufferTime: number
}

export type CommentThreadLabel = 'owner' | 'default' | 'community' | 'easy'

export interface CommentNg {
  ngScore: CommentNgScore
  owner: unknown[]
  viewer: CommentNgViewer
}

export interface CommentNgScore {
  isDisabled: boolean
}

export interface CommentNgViewer {
  revision: number
  count: number
  items: CommentNgItem[]
}

export interface CommentNgItem {
  type: CommentNgItemType
  source: string
  registeredAt: string
}

export type CommentNgItemType = 'id' | 'command'

export interface NvComment {
  server: string
  params: NvCommentParams
  threadKey: string
}

export interface NvCommentParams {
  targets: NvCommentTarget[]
  language: 'ja-jp'
}

export interface NvCommentTarget {
  id: string
  fork: CommentFork
}

export interface CommentAssist {
  sectionDurationSec: number
  minMatchCharacters: number
  ignorePostElapsedTimeSec: number
  ignoreCommentNgScoreThreshold: number
  commentCountThresholdList: number[][]
  buttonDisplayDurationSec: number
  buttonDisplayOffsetSec: number
}

// ジャンル

export interface Genre {
  key: string
  label: GenreLabel
  isImmoral: boolean
  isDisabled: boolean
  isNotSet: boolean
}

export type GenreLabel =
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

// メディア・配信品質

export interface Media {
  contents: MediaContents
  isStoryboardAvailable: boolean
  accessRightKey: string
  hls: Hls
  lowDataMode: LowDataMode
}

export interface MediaContents {
  videos: MediaVideo[]
  audios: MediaAudio[]
}

export interface MediaVideo {
  id: string
  isAvailable: boolean
  qualityLevel: number
  label: string
  bitRate: number
  width: number
  height: number
}

export interface MediaAudio {
  id: string
  isAvailable: boolean
  qualityLevel: number
  bitRate: number
  samplingRate: number
  integratedLoudness: number
  truePeak: number
  loudnessCollection: LoudnessCollection[]
  label: MediaAudioLabel
}

export interface MediaAudioLabel {
  quality: MediaAudioQuality
  bitrate: string
}

export type MediaAudioQuality = '高音質' | '標準音質' | '低音質'

export interface LoudnessCollection {
  type: string
  value: number
}

export interface Hls {
  url: string
  outputs: HlsOutput[]
  createdAt: string
  expiredAt: string
}

export interface HlsOutput {
  assetUnitNames: string[]
}

export interface LowDataMode {
  videoUpperLimit: number
  audioUpperLimit: number
}

// 動画メタデータ・投稿者

export interface WatchMetadata {
  jsonLd: WatchJsonLd
  gtm: WatchGtm
}

export interface WatchJsonLd {
  owner: Owner
  videoObject: WatchJsonLdVideoObject
}

export interface WatchJsonLdVideoObject {
  regionsAllowed: string | null
  expiresAt: string | null
}

export interface WatchGtm {
  channel: WatchGtmChannel | null
}

export interface WatchGtmChannel {
  id: string
  isMember: boolean
}

export interface Owner {
  id: string
  type: OwnerType
  name: string
  description: string
  iconUrl: string
}

export type OwnerType = 'user' | 'channel'

// 課金

export interface Payment {
  ppv: PaymentItem
  admission: PaymentItem
  continuationBenefit: PaymentItem
  premium: PaymentItem
  watchableUserType: string
  commentableUserType: string
  billingType: string
}

export interface PaymentItem {
  isEnabled: boolean
  showPromotion: boolean
}

// 視聴ページ・プレイヤー

export interface PcWeb {
  prebidAdSlotName: string
}

export interface Player {
  comment: PlayerComment
  initialPlayback: null
  layerMode: number
}

export interface PlayerComment {
  isDefaultInvisible: boolean
}

// システム・タグ

export interface System {
  serverTime: string
  isStellaAlive: boolean
  channelGtmContainerId: string
}

export interface Tags {
  items: TagItem[]
  hasR18Tag: boolean
  isPublishedNicoscript: boolean
  edit: TagEdit
}

export interface TagItem {
  name: string
  isLocked: boolean
}

export interface TagEdit {
  isEditable: boolean
  uneditableReason: string | null
  editKey: string | null
}

// 動画

export interface Video {
  id: string
  contentType: VideoContentType
  title: string
  description: string
  supplements: unknown[]
  count: VideoCount
  duration: number
  thumbnail: VideoThumbnail
  registeredAt: string
  permission: VideoPermission
  hasLyrics: boolean
  isHighRiskVideo: boolean
  isChannelVideo: boolean
  isOwnedByViewer: boolean
  showOwnerMenu: boolean
  isLikedByViewer: boolean
}

export type VideoContentType = 'long' | 'short'

export interface VideoCount {
  view: number
  comment: number
  mylist: number
  like: number
}

export interface VideoThumbnail {
  normal: string
  middle: string | null
  large: string | null
  player: string
  ogp: string
  short: null
}

export interface VideoPermission {
  isPrivate: boolean
  isDeleted: boolean
  isAuthenticationRequired: boolean
  isEmbedPlayerAllowed: boolean
  isGiftAllowed: boolean
  isNgForVocacolleApp: boolean
  rating: VideoRating
}

export interface VideoRating {
  isAdult: boolean
}

export interface BaseVideo {
  baseVideoId: null
  contentType: null
  title: null
  thumbnail: null
}

// 動画広告

export interface VideoAds {
  additionalParams: VideoAdsAdditionalParams
  items: VideoAdsItem[]
  reason: string | null
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
  type: VideoAdLinearType
  timingMs: number | null
  additionalParams: VideoAdsItemAdditionalParams
}

export interface VideoAdsItemAdditionalParams {
  linearType: VideoAdLinearType
  adIdx: number
  skipType: number
  pod: number
}

export type VideoAdLinearType = 'preroll' | 'midroll' | 'postroll'

// 視聴者

export interface Viewer {
  id: number
  nickname: string
  isPremium: boolean
  allowSensitiveContents: boolean
}
