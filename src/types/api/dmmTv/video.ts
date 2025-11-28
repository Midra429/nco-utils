export interface VideoResponse {
  data: VideoData
}

export interface VideoData {
  video: Video
}

export interface Video {
  id: string
  seasonType: string
  titleName: string
  seasonName: string
  highlight: null | string
  description: string
  notices: null
  packageImage: string
  productionYear: number | null
  isNewArrival: boolean
  customTag: string
  isPublic: boolean
  isExclusive: boolean
  isBeingDelivered: boolean
  viewingTypes: string[]
  url: string
  startPublicAt: Date
  campaign: null
  rating: Rating
  casts: Cast[]
  staffs: Staff[]
  categories: CategoryElement[]
  genres: CategoryElement[]
  copyright: string
  relatedItems: RelatedItems
  __typename: string
  metaDescription: string
  keyVisualImage: string
  keyVisualWithoutLogoImage: string
  reviewSummary: ReviewSummary
  relatedSeasons: RelatedSeason[]
  nextDeliveryEpisode: NextDeliveryEpisode
  priceSummary: null
  episode?: Episode
  episodes: Episodes
  specialEpisode: SpecialEpisode
  pvEpisode: PVEpisode
}

export interface Cast {
  castName: string
  actorName: string
  person: Person
  __typename: CastTypename
}

export type CastTypename = 'Cast'

export interface Person {
  id: string
  __typename: PersonTypename
}

export type PersonTypename = 'Person'

export interface CategoryElement {
  name: string
  id: string
  __typename: CategoryTypename
}

export type CategoryTypename = 'VideoCategory' | 'VideoGenre'

export interface Episode {
  id: string
  episodeTitle: string
  episodeImage: string
  episodeNumber: number
  episodeNumberName: string
  episodeDetail: string
  drmLevel: DRMLevel
  playInfo: EpisodePlayInfo
  viewingRights: ViewingRights
  freeProduct: FreeProduct
  ppvProducts: any[]
  svodProduct: SvodProduct
  priceSummary: null
  __typename: string
}

export interface DRMLevel {
  hasStrictProtection: boolean
  __typename: string
}

export interface FreeProduct {
  contentId: string
  __typename: string
}

export interface EpisodePlayInfo {
  highestQuality: string
  isSupportHDR: boolean
  highestAudioChannelLayout: string
  duration: number
  audioRenditions: string[]
  textRenditions: string[]
  parts: PurplePart[]
  __typename: string
}

export interface PurplePart {
  contentId: string
  number: number
  duration: number
  __typename: string
}

export interface SvodProduct {
  startDeliveryAt: Date
  __typename: string
}

export interface ViewingRights {
  isDownloadable: boolean
  isStreamable: boolean
  __typename: string
}

export interface Episodes {
  edges: EpisodesEdge[]
  total: number
  __typename: string
}

export interface EpisodesEdge {
  node: PurpleNode
  __typename: string
}

export interface PurpleNode {
  id: string
  sampleMovie: string
  episodeTitle: string
  episodeNumber: number
  episodeNumberName: null | string
  drmLevel: DRMLevel
  playInfo: PurplePlayInfo
  viewingRights: ViewingRights
  freeProduct: FreeProduct | null
  ppvProducts: any[]
  svodProduct: SvodProduct
  priceSummary: null
  __typename: string
}

export interface PurplePlayInfo {
  highestQuality: string
  isSupportHDR: boolean
  highestAudioChannelLayout: string
  duration: number
  audioRenditions: string[]
  textRenditions: string[]
  parts: FluffyPart[]
  __typename: string
}

export interface FluffyPart {
  number: number
  __typename: string
}

export interface NextDeliveryEpisode {
  isBeforeDelivered: boolean
  startDeliveryAt: Date | null
  __typename: string
}

export interface PVEpisode {
  edges: PVEpisodeEdge[]
  total: number
  __typename: string
}

export interface PVEpisodeEdge {
  node: FluffyNode
  __typename: string
}

export interface FluffyNode {
  id: string
  sampleMovie: string
  playInfo: FluffyPlayInfo
  __typename: string
}

export interface FluffyPlayInfo {
  duration: number
  __typename: string
}

export interface Rating {
  category: CategoryEnum
  __typename: RatingTypename
}

export type RatingTypename = 'VideoRating'

export type CategoryEnum = 'G' | 'NR'

export interface RelatedItems {
  videos: VideoElement[]
  books: Book[]
  mono: Mono | null
  scratch: null
  onlineCrane: null
  __typename: string
}

export interface Book {
  seriesId: string
  title: string
  thumbnail: string
  url: string
  __typename: BookTypename
}

export type BookTypename = 'RelatedBook'

export interface Mono {
  banner: string
  url: string
  __typename: string
}

export interface VideoElement {
  seasonId: string
  video: VideoVideo
  __typename: string
}

export interface VideoVideo {
  id: string
  titleName: string
  packageImage: string
  isNewArrival: boolean
  customTag: string
  isExclusive: boolean
  rating: Rating
  __typename: string
}

export interface RelatedSeason {
  id: string
  title: string
  __typename: string
}

export interface ReviewSummary {
  averagePoint: number
  reviewerCount: number
  reviewCommentCount: number
  __typename: string
}

export interface SpecialEpisode {
  total: number
  __typename: string
}

export interface Staff {
  roleName: string
  staffName: string
  person: Person
  __typename: StaffTypename
}

export type StaffTypename = 'Staff'
