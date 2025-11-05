export type VideoResponse = VideoResponseOk | VideoResponseError

export interface VideoResponseOk {
  meta: {
    status: 200
    code: string
  }
  data: {
    metadata: unknown
    googleTagManager: unknown
    response: VideoData
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
  ads: null
  category: null
  channel: Channel | null
  client: Client
  comment: DataComment
  community: null
  easyComment: EasyComment
  external: External | null
  genre: DataGenre
  marquee: Marquee | null
  media: Media
  okReason: OkReason
  owner: DataOwner | null
  payment: Payment
  pcWatchPage: PcWatchPage | null
  player: Player
  ppv: Ppv | null
  ranking: Ranking
  series: Series | null
  smartphone: null
  system: System
  tag: Tag
  video: DataVideo
  videoAds: VideoAds
  videoLive: VideoLive | null
  viewer: DataViewer | null
  waku: Waku
}

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
  follow: Follow
}

export interface Follow {
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

export interface DataComment {
  server: Server
  keys: Keys
  layers: Layer[]
  threads: Thread[]
  ng: Ng
  isAttentionRequired: boolean
  nvComment: NvComment
  assist: Assist
}

export interface Keys {
  userKey: string
}

export interface Layer {
  index: number
  isTranslucent: boolean
  threadIds: ThreadId[]
}

export interface ThreadId {
  id: number
  fork: number
  forkLabel: Fork
}

export type Fork = 'owner' | 'main' | 'easy'

export interface Ng {
  ngScore: NgScore
  channel: []
  owner: []
  viewer: NgViewer | null
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
  type: 'word' | 'id' | 'command'
  source: string
  registeredAt: string
}

export interface NvComment {
  threadKey: string
  server: string
  params: Params
}

export interface Assist {
  sectionDurationSec: number
  minMatchCharacters: number
  ignorePostElapsedTimeSec: number
  ignoreCommentNgScoreThreshold: number
  commentCountThresholdList: [number, number][]
  buttonDisplayDurationSec: number
  buttonDisplayOffsetSec: number
}

export interface Params {
  targets: Target[]
  language: 'ja-jp'
}

export interface Target {
  id: string
  fork: Fork
}

export interface Server {
  url: string
}

export interface Thread {
  id: number
  fork: number
  forkLabel: Fork
  videoId: string
  isActive: boolean
  isDefaultPostTarget: boolean
  isEasyCommentPostTarget: boolean
  isLeafRequired: boolean
  isOwnerThread: boolean
  isThreadkeyRequired: boolean
  threadkey: null | string
  is184Forced: boolean
  hasNicoscript: boolean
  label: ThreadLabel
  postkeyStatus: number
  server: string
}

export type ThreadLabel =
  | 'owner'
  | 'default'
  | 'community'
  | 'easy'
  | 'extra-community'
  | 'extra-easy'

export interface EasyComment {
  phrases: Phrase[]
}

export interface Phrase {
  text: string
  nicodic: Nicodic | null
}

export interface Nicodic {
  title: string
  viewTitle: string
  summary: string
  link: string
}

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

export interface DataGenre {
  key: string
  label: GenreEnum
  isImmoral: boolean
  isDisabled: boolean
  isNotSet: boolean
}

export type GenreEnum =
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

export interface Marquee {
  isDisabled: boolean
  tagRelatedLead: null
}

export interface Media {
  domand: Domand | null
  delivery: null
  deliveryLegacy: null
}

export interface Domand {
  videos: VideoElement[]
  audios: Audio[]
  isStoryboardAvailable: boolean
  accessRightKey: string
}

export interface Audio {
  id: AudioId
  isAvailable: boolean
  bitRate: number
  samplingRate: number
  integratedLoudness: number
  truePeak: number
  qualityLevel: number
  loudnessCollection: LoudnessCollection[]
}

export type AudioId = 'audio-aac-64kbps' | 'audio-aac-128kbps' | 'audio-aac-192kbps'

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

export interface VideoElement {
  id: VideoId
  isAvailable: boolean
  label: VideoLabel
  bitRate: number
  width: number
  height: number
  qualityLevel: number
  recommendedHighestAudioQualityLevel: number
}

export type VideoId =
  | 'video-h264-144p'
  | 'video-h264-360p-lowest'
  | 'video-h264-360p'
  | 'video-h264-480p'
  | 'video-h264-720p'
  | 'video-h264-1080p'

export type VideoLabel = '低画質' | '144p' | '360p' | '480p' | '720p' | '1080p'

export type OkReason = 'PURELY' | 'PAYMENT_PREVIEW_SUPPORTED'

export interface DataOwner {
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
  preview: Preview
}

export interface Preview {
  ppv: Ichiba
  admission: Ichiba
  continuationBenefit: Ichiba
  premium: Ichiba
}

export interface PaymentVideo {
  isPpv: boolean
  isAdmission: boolean
  isContinuationBenefit: boolean
  isPremium: boolean
  watchableUserType: CommentableUserTypeForPayment
  commentableUserType: CommentableUserTypeForPayment
  billingType: BillingType
}

export type BillingType = 'free' | 'custom'

export type CommentableUserTypeForPayment = 'all' | 'purchaser'

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

export interface Ppv {
  accessFrom: null
}

export interface Ranking {
  genre: RankingGenre | null
  popularTag: PopularTag[]
}

export interface RankingGenre {
  rank: number
  genre: GenreEnum
  dateTime: string
}

export interface PopularTag {
  tag: string
  regularizedTag: string
  rank: number
  genre: GenreEnum
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
  prev: First | null
  next: First
  first: First
}

export interface First {
  'type': string
  'id': string
  'title': string
  'registeredAt': string
  'count': Count
  'thumbnail': FirstThumbnail
  'duration': number
  'shortDescription': string
  'latestCommentSummary': string
  'isChannelVideo': boolean
  'isPaymentRequired': boolean
  'playbackPosition': number | null
  'owner': FirstOwner
  'requireSensitiveMasking': boolean
  'videoLive': null
  'isMuted': boolean
  '9d091f87': boolean
  'acf68865': boolean
}

export interface Count {
  view: number
  comment: number
  mylist: number
  like: number
}

export interface FirstOwner {
  ownerType: string
  type: string
  visibility: string
  id: string
  name: string
  iconUrl: string
}

export interface FirstThumbnail {
  url: string
  middleUrl: string
  largeUrl: string
  listingUrl: string
  nHdUrl: string
}

export interface System {
  serverTime: string
  isPeakTime: boolean
  isStellaAlive: boolean
}

export interface Tag {
  items: TagItem[]
  hasR18Tag: boolean
  isPublishedNicoscript: boolean
  edit: Edit
  viewer: Edit | null
}

export interface Edit {
  isEditable: boolean
  uneditableReason: UneditableReason
  editKey: null | string
}

export type UneditableReason = 'PREMIUM_ONLY' | 'NEED_LOGIN' | 'USER_FORBIDDEN'

export interface TagItem {
  name: string
  isCategory: boolean
  isCategoryCandidate: boolean
  isNicodicArticleExists: boolean
  isLocked: boolean
}

export interface DataVideo {
  'id': string
  'title': string
  'description': string
  'count': Count
  'duration': number
  'thumbnail': VideoThumbnail
  'rating': Rating
  'registeredAt': string
  'isPrivate': boolean
  'isDeleted': boolean
  'isNoBanner': boolean
  'isAuthenticationRequired': boolean
  'isEmbedPlayerAllowed': boolean
  'isGiftAllowed': boolean
  'viewer': VideoViewer | null
  'watchableUserTypeForPayment': CommentableUserTypeForPayment
  'commentableUserTypeForPayment': CommentableUserTypeForPayment
  '9d091f87': boolean
}

export interface Rating {
  isAdult: boolean
}

export interface VideoThumbnail {
  url: string
  middleUrl: null | string
  largeUrl: null | string
  player: string
  ogp: string
}

export interface VideoViewer {
  isOwner: boolean
  like: Like
}

export interface Like {
  isLiked: boolean
  count: null
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
  lang: 'ja-jp'
  watchTrackId: string
  channelId?: string
  genre?: string
  gender?: string
  age?: number
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
  skippableType: number
  pod: number
}

export type LinearTypeEnum = 'preroll' | 'midroll' | 'postroll'

export interface VideoLive {
  programId: string
  beginAt: string
  endAt: string
}

export interface DataViewer {
  id: number
  nickname: string
  isPremium: boolean
  allowSensitiveContents: boolean
  existence: Existence
}

export interface Existence {
  age: number
  prefecture: string
  sex: string
}

export interface Waku {
  information: null
  bgImages: any[]
  addContents: null
  addVideo: null
  tagRelatedBanner: TagRelatedBanner
  tagRelatedMarquee: null
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
