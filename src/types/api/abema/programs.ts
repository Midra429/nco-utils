export interface ProgramResponse {
  id: string
  series: Series
  season?: Season
  genre: Genre
  info: Info
  providedInfo: ProvidedInfo
  episode: Episode
  credit: Credit
  mediaStatus: MediaStatus
  label: ProgramLabel
  imageUpdatedAt: number
  endAt: number
  freeEndAt?: number
  transcodeVersion: string
  sharedLink: SharedLink
  playback: Playback
  viewingPoint: ViewingPoint
  nextProgramInfo?: NextProgramInfo
  download: Download
  externalContent: ExternalContent
  broadcastRegionPolicy: number
  timelineThumbComponent: TimelineThumbComponent
  terms: Term[]
  episodeGroupId: string
}

export interface Credit {
  released: number
  casts: string[]
  crews: string[]
  copyrights: string[]
}

export interface Download {
  enable: boolean
}

export interface Episode {
  number: number
  title: string
  content: string
}

export interface ExternalContent {
  marks: MediaStatus
}

export interface MediaStatus {}

export interface Genre {
  id: string
  name: string
  subGenres: SubGenre[]
}

export interface SubGenre {
  id: string
  name: string
}

export interface Info {
  duration: number
}

export interface ProgramLabel {
  free?: boolean
}

export interface NextProgramInfo {
  programId: string
  title: string
  thumbImg: string
  sceneThumbImages?: string[]
  imageUpdatedAt: number
  endAt: number
  broadcastRegionPolicy: number
  terms: Term[]
}

export interface Term {
  onDemandType: number
  endAt: number
}

export interface Playback {
  hls: string
  dash: string
  hlsPreview?: string
  dashIPTV: string
}

export interface ProvidedInfo {
  thumbImg: string
  sceneThumbImgs?: string[]
}

export interface Season {
  id: string
  sequence: number
  name: string
  thumbComponent: MediaStatus
  order: number
}

export interface Series {
  id: string
  title: string
  label: SeriesLabel
  thumbComponent: ThumbComponent
  thumbPortraitComponent: ThumbComponent
}

export interface SeriesLabel {
  someFree?: boolean
  newest?: boolean
}

export interface ThumbComponent {
  urlPrefix: string
  filename: string
  query: string
  extension: string
}

export interface SharedLink {
  twitter: string
  facebook: string
  google: string
  line: string
  copy: string
  instagram: string
}

export interface TimelineThumbComponent {
  urlPrefix: string
  extension: string
}

export interface ViewingPoint {
  suggestion: number
}
