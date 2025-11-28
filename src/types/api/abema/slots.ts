export interface SlotsResponse {
  slot: Slot
}

export interface Slot {
  id: string
  title: string
  startAt: number
  endAt: number
  programs: Program[]
  tableStartAt: number
  tableEndAt: number
  highlight: string
  detailHighlight?: string
  content: string
  displayProgramId: string
  mark: Mark
  flags: Flags
  channelId: string
  timeshiftEndAt: number
  slotGroup?: SlotGroup
  hashtag?: string
  links: null
  sharedLink: SharedLink
  playback: Playback
  externalContent: ExternalContent
  reservable: boolean
  download: Download
  chasePlayback: Playback
  broadcastRegionPolicies: BroadcastRegionPolicies
  timelineThumbComponent: TimelineThumbComponent
  chasePlayFeatureAuthorityIds: string[]
}

export interface BroadcastRegionPolicies {
  linear: number
  timeshift: number
}

export interface Playback {
  hls: string
  dash: string
  dashIPTV: string
  arin?: string
}

export interface Download {
  enable: boolean
}

export interface ExternalContent {
  buttonText: string
  marks: Marks
}

export interface Marks {}

export interface Flags {
  timeshift: boolean
  chasePlay: boolean
  archiveComment: boolean
}

export interface Mark {
  newcomer?: boolean
  recommendation?: boolean
}

export interface Program {
  id: string
  episode: Episode
  credit: Credit
  series: Series
  providedInfo: ProvidedInfo
}

export interface Credit {
  casts: string[]
  crews: string[]
  copyrights: string[]
}

export interface Episode {
  sequence: number
}

export interface ProvidedInfo {
  thumbImg: string
  sceneThumbImgs: string[]
  updatedAt: number
}

export interface Series {
  id: string
  themeColor: Marks
  genreId: string
  subGenreIds: string[]
  updatedAt: number
}

export interface SharedLink {
  twitter: string
  facebook: string
  google: string
  line: string
  copy: string
  screen: string
  instagram: string
}

export interface SlotGroup {
  id: string
  lastSlotId: string
  title: string
  thumbComponent: ThumbComponent
  expireAt: number
}

export interface ThumbComponent {
  urlPrefix: string
  filename: string
  extension: string
}

export interface TimelineThumbComponent {
  urlPrefix: string
  extension: string
}
