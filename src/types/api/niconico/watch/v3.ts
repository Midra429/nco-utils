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
}

export interface ResponseData {
  metadata: Metadata
  googleTagManager: GoogleTagManager
  response: Data
}

export interface Data {
  ads: null
  category: null
  channel: Channel | null
  client: Client
  comment: Comment
  community: null
  easyComment: EasyComment
  external: External | null
  genre: Genre
  marquee: Marquee | null
  media: Media
  okReason: OkReason
  owner: Owner | null
  payment: Payment
  pcWatchPage: PcWatchPage | null
  player: Player
  ppv: Ppv | null
  ranking: Ranking
  series: Series | null
  smartphone: null
  system: System
  tag: Tag
  video: Video
  videoAds: VideoAds
  videoLive: VideoLive | null
  viewer: Viewer | null
  waku: Waku
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
  uploadDate?: Date
  embedUrl?: string
  interactionStatistic?: JsonLdInteractionStatistic[]
  commentCount?: number
  thumbnail?: JsonLdThumbnail[]
  thumbnailUrl?: string[]
  requiresSubscription?: boolean
  isAccessibleForFree?: boolean
  regionsAllowed?: string
  expires?: Date
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

export type OkReason = 'PURELY' | 'PAYMENT_PREVIEW_SUPPORTED'

// チャンネル・クライアント

export interface Channel {
  id: string
  name: string
  isOfficialAnime: boolean
  isDisplayAdBanner: boolean
  thumbnail: ChannelThumbnail
  viewer: ChannelViewer | null
}

export interface ChannelThumbnail {
  url: string
  smallUrl: string
}

export interface ChannelViewer {
  follow: ChannelFollow
}

export interface ChannelFollow {
  isFollowed: boolean
  isBookmarked: boolean
  token: string
  tokenTimestamp: number
}

export interface Client {
  nicosid: string
  watchId: string
  watchTrackId: string
}

// コメント

export interface Comment {
  server: CommentServer
  keys: CommentKeys
  layers: CommentLayer[]
  threads: CommentThread[]
  ng: CommentNg
  isAttentionRequired: boolean
  nvComment: NvComment
  assist: CommentAssist
}

export interface CommentServer {
  url: string
}

export interface CommentKeys {
  userKey: string
}

export interface CommentLayer {
  index: number
  isTranslucent: boolean
  threadIds: CommentThreadId[]
}

export interface CommentThreadId {
  id: number
  fork: number
  forkLabel: CommentFork
}

export type CommentFork = 'owner' | 'main' | 'easy' | 'ai'

export interface CommentThread extends CommentThreadId {
  videoId: string
  isActive: boolean
  isDefaultPostTarget: boolean
  isEasyCommentPostTarget: boolean
  isLeafRequired: boolean
  isOwnerThread: boolean
  isThreadkeyRequired: boolean
  threadkey: string | null
  is184Forced: boolean
  hasNicoscript: boolean
  label: CommentThreadLabel
  postkeyStatus: number
  server: string
}

export type CommentThreadLabel =
  | 'owner'
  | 'default'
  | 'main'
  | 'community'
  | 'extra-community'
  | 'easy'
  | 'extra-easy'
  | 'ai'

export interface CommentNg {
  ngScore: CommentNgScore
  channel: []
  owner: []
  viewer: CommentNgViewer | null
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
  type: 'word' | 'id' | 'command'
  source: string
  registeredAt: string
}

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
  commentCountThresholdList: [number, number][]
  buttonDisplayDurationSec: number
  buttonDisplayOffsetSec: number
}

export interface EasyComment {
  phrases: EasyCommentPhrase[]
}

export interface EasyCommentPhrase {
  text: string
  nicodic: Nicodic | null
}

export interface Nicodic {
  title: string
  viewTitle: string
  summary: string
  link: string
}

// 外部連携・ジャンル

export interface External {
  commons: Commons
  ichiba: Ichiba
}

export interface Commons {
  hasContentTree: boolean
}

export interface Ichiba {
  isEnabled: boolean
}

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

// メディア・配信品質

export interface Media {
  domand: Domand | null
  delivery: null
  deliveryLegacy: null
}

export interface Domand {
  videos: DomandVideo[]
  audios: DomandAudio[]
  isStoryboardAvailable: boolean
  accessRightKey: string
}

export interface DomandVideo {
  id: DomandVideoId
  isAvailable: boolean
  label: DomandVideoLabel
  bitRate: number
  width: number
  height: number
  qualityLevel: number
  recommendedHighestAudioQualityLevel: number
}

export type DomandVideoId =
  | 'video-h264-144p'
  | 'video-h264-360p-lowest'
  | 'video-h264-360p'
  | 'video-h264-480p'
  | 'video-h264-720p'
  | 'video-h264-1080p'

export type DomandVideoLabel =
  | '低画質'
  | '144p'
  | '360p'
  | '480p'
  | '720p'
  | '1080p'

export interface DomandAudio {
  id: DomandAudioId
  isAvailable: boolean
  bitRate: number
  samplingRate: number
  integratedLoudness: number
  truePeak: number
  qualityLevel: number
  loudnessCollection: LoudnessCollection[]
}

export type DomandAudioId =
  | 'audio-aac-64kbps'
  | 'audio-aac-128kbps'
  | 'audio-aac-192kbps'

export interface LoudnessCollection {
  type: LoudnessCollectionType
  value: number
}

export type LoudnessCollectionType =
  | 'video'
  | 'pureAdPreroll'
  | 'houseAdPreroll'
  | 'networkAdPreroll'
  | 'pureAdMidroll'
  | 'houseAdMidroll'
  | 'networkAdMidroll'
  | 'pureAdPostroll'
  | 'houseAdPostroll'
  | 'networkAdPostroll'
  | 'nicoadVideoIntroduce'
  | 'nicoadBillboard'
  | 'marquee'

// 投稿者・課金

export interface Owner {
  id: number
  nickname: string
  iconUrl: string
  channel: null
  live: null
  isVideosPublic: boolean
  isMylistsPublic: boolean
  videoLiveNotice: null
  viewer: null
}

export interface Payment {
  video: PaymentVideo
  preview: PaymentPreview
}

export interface PaymentVideo {
  isPpv: boolean
  isAdmission: boolean
  isContinuationBenefit: boolean
  isPremium: boolean
  watchableUserType: PaymentUserType
  commentableUserType: PaymentUserType
  billingType: BillingType
}

export type PaymentUserType = 'all' | 'purchaser'

export type BillingType = 'free' | 'custom'

export interface PaymentPreview {
  ppv: PaymentPreviewItem
  admission: PaymentPreviewItem
  continuationBenefit: PaymentPreviewItem
  premium: PaymentPreviewItem
}

export interface PaymentPreviewItem {
  isEnabled: boolean
}

export interface Ppv {
  accessFrom: null
}

// 視聴ページ・プレイヤー

export interface PcWatchPage {
  tagRelatedBanner: null
  videoEnd: VideoEnd
  showOwnerMenu: boolean
  showOwnerThreadCoEditingLink: boolean
  showMymemoryEditingLink: boolean
}

export interface VideoEnd {
  bannerIn: null
  overlay: null
}

export interface Player {
  initialPlayback: null
  comment: PlayerComment
  layerMode: number
}

export interface PlayerComment {
  isDefaultInvisible: boolean
}

// ランキング・シリーズ

export interface Ranking {
  genre: RankingGenre | null
  popularTag: PopularTag[]
}

export interface RankingGenre {
  rank: number
  genre: GenreLabel
  dateTime: string
}

export interface PopularTag {
  tag: string
  regularizedTag: string
  rank: number
  genre: GenreLabel
  dateTime: string
}

export interface Series {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  video: SeriesVideo
}

export interface SeriesVideo {
  prev: SeriesVideoItem | null
  next: SeriesVideoItem
  first: SeriesVideoItem
}

export interface SeriesVideoItem {
  type: string
  id: string
  title: string
  registeredAt: string
  count: VideoCount
  thumbnail: SeriesVideoThumbnail
  duration: number
  shortDescription: string
  latestCommentSummary: string
  isChannelVideo: boolean
  isPaymentRequired: boolean
  playbackPosition: number | null
  owner: SeriesVideoOwner
  requireSensitiveMasking: boolean
  videoLive: null
  isMuted: boolean
  '9d091f87': boolean
  acf68865: boolean
}

export interface SeriesVideoOwner {
  ownerType: string
  type: string
  visibility: string
  id: string
  name: string
  iconUrl: string
}

export interface SeriesVideoThumbnail {
  url: string
  middleUrl: string
  largeUrl: string
  listingUrl: string
  nHdUrl: string
}

// システム・タグ

export interface System {
  serverTime: string
  isPeakTime: boolean
  isStellaAlive: boolean
}

export interface Tag {
  items: TagItem[]
  hasR18Tag: boolean
  isPublishedNicoscript: boolean
  edit: TagEdit
  viewer: TagEdit | null
}

export interface TagItem {
  name: string
  isCategory: boolean
  isCategoryCandidate: boolean
  isNicodicArticleExists: boolean
  isLocked: boolean
}

export interface TagEdit {
  isEditable: boolean
  uneditableReason: TagUneditableReason
  editKey: string | null
}

export type TagUneditableReason =
  | 'PREMIUM_ONLY'
  | 'NEED_LOGIN'
  | 'USER_FORBIDDEN'

// 動画

export interface Video {
  id: string
  contentType: VideoContentType
  title: string
  description: string
  count: VideoCount
  duration: number
  thumbnail: VideoThumbnail
  rating: VideoRating
  registeredAt: string
  isPrivate: boolean
  isDeleted: boolean
  isNoBanner: boolean
  isAuthenticationRequired: boolean
  isEmbedPlayerAllowed: boolean
  isGiftAllowed: boolean
  viewer: VideoViewer | null
  watchableUserTypeForPayment: PaymentUserType
  commentableUserTypeForPayment: PaymentUserType
  '9d091f87': boolean
}

export type VideoContentType = 'long' | 'short'

export interface VideoCount {
  view: number
  comment: number
  mylist: number
  like: number
}

export interface VideoThumbnail {
  url: string
  middleUrl: string | null
  largeUrl: string | null
  player: string
  ogp: string
  short: string | null
}

export interface VideoRating {
  isAdult: boolean
}

export interface VideoViewer {
  isOwner: boolean
  like: VideoLike
}

export interface VideoLike {
  isLiked: boolean
  count: null
}

// 動画広告・ライブ

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
  lang: 'ja-jp'
  watchTrackId: string
  channelId?: string
  genre?: string
  gender?: string
  age?: number
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
  skippableType: number
  pod: number
}

export type VideoAdLinearType = 'preroll' | 'midroll' | 'postroll'

export interface VideoLive {
  programId: string
  beginAt: string
  endAt: string
}

// 視聴者・バナー

export interface Viewer {
  id: number
  nickname: string
  isPremium: boolean
  allowSensitiveContents: boolean
  existence: ViewerExistence
}

export interface ViewerExistence {
  age: number
  prefecture: string
  sex: string
}

export interface Waku {
  information: null
  bgImages: unknown[]
  addContents: null
  addVideo: null
  tagRelatedBanner: TagRelatedBanner
  tagRelatedMarquee: null
}

export interface Marquee {
  isDisabled: boolean
  tagRelatedLead: null
}

export interface TagRelatedBanner {
  title: string
  imageUrl: string
  description: string
  isEvent: boolean
  linkUrl: string
  linkType: LinkType
  linkOrigin: string
  isNewWindow: boolean
}

export type LinkType = 'video' | 'link' | 'live'
