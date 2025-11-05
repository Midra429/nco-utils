export interface Metadata {
  version?: string
  trackIds?: TrackIds
  video?: Video
}

export interface TrackIds {
  nextEpisode: number
  episodeSelector: number
}

export interface Video {
  title: string
  synopsis: string
  matchScore: MatchScore
  rating: string
  artwork: Artwork[]
  boxart: Artwork[]
  storyart: Artwork[]
  type: string
  unifiedEntityId: string
  id: number
  userRating: UserRating
  skipMarkers: SkipMarkers
  currentEpisode?: number
  hiddenEpisodeNumbers: boolean
  requiresAdultVerification: boolean
  requiresPin: boolean
  requiresPreReleasePin: boolean
  seasons?: Season[]
  merchedVideoId: null
  cinematch: Cinematch
  start?: number
  end?: number
  year?: number
  creditsOffset?: number
  runtime?: number
  displayRuntime?: number
  autoplayable?: boolean
  liveEvent?: LiveEvent
  taglineMessages?: TaglineMessages
  bookmark?: Bookmark
  hd?: boolean
  stills?: Artwork[]
}

export interface Artwork {
  w: number
  h: number
  url: string
}

export interface Bookmark {
  watchedDate: number
  offset: number
}

export interface Cinematch {
  type: string
  value: string
}

export interface LiveEvent {
  hasLiveEvent: boolean
}

export interface MatchScore {
  isNewForPvr: boolean
  computeId: string
  trackingInfo: TrackingInfo
}

export interface TrackingInfo {
  matchScore: string
  tooNewForMatchScore: string
  matchRequestId: string
}

export interface Season {
  year: number
  shortName: string
  longName: string
  hiddenEpisodeNumbers: boolean
  title: string
  id: number
  seq: number
  episodes: Episode[]
}

export interface Episode {
  start: number
  end: number
  synopsis: string
  episodeId: number
  liveEvent: LiveEvent
  taglineMessages: TaglineMessages
  requiresAdultVerification: boolean
  requiresPin: boolean
  requiresPreReleasePin: boolean
  creditsOffset: number
  runtime: number
  displayRuntime: number
  watchedToEndOffset: number
  autoplayable: boolean
  title: string
  id: number
  bookmark: Bookmark
  skipMarkers: SkipMarkers
  hd: boolean
  thumbs: Artwork[]
  stills: Artwork[]
  seq: number
  hiddenEpisodeNumbers: boolean
}

export interface SkipMarkers {
  credit: Credit
  recap: Credit
}

export interface Credit {
  start: number | null
  end: number | null
}

export interface TaglineMessages {
  tagline: string
  classification: Classification
}

export type Classification = 'REGULAR' | 'MOST_LIKED'

export interface UserRating {
  type: string
  userRating: number
}
