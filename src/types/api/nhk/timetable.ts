export type ServiceId =
  | 'g1'
  | 'g2'
  | 'e1'
  | 'e3'
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'

export type PublicationType = 'BroadcastEvent'
export type PublishedOnType = 'BroadcastService'

export type EpisodeMergeStatus = 'notMerged' | 'merge'
export type CopyrightType = 'Organization' | 'Person'

export type EpisodeOrderBy = 'releasedEvent' | 'recentEvent' | 'episodeNumber'
export type LayoutPattern = 'summary'
export type PublishLevel = 'full' | 'limited' | 'ready' | 'notyet'
export type SeriesPackStatus = 'notPacked' | 'pack'
export type SupportMedia = '@screen' | '@print'

export type EnvironmentId = 'hskOriginal'
export type StreamType = 'vod'

export type Name1 =
  | '趣味/教育'
  | 'スポーツ'
  | 'ドキュメンタリー/教養'
  | 'バラエティ'
  | '音楽'
  | 'アニメ/特撮'
  | '情報/ワイドショー'
  | 'ニュース/報道'
  | '福祉'
  | '劇場/公演'
  | 'ドラマ'
  | 'その他'
  | '映画'

export type AudioMode =
  | 'stereoLang2'
  | 'stereoKaisetsu'
  | 'multiple'
  | 'ch51'
  | 'lang2'
  | 'stereo'
  | 'ch222'
  | 'kaisetsu'

export type Coverage = 'nationwide' | 'block' | 'local'
export type DisplayVideoMode = 'none'
export type DisplayVideoRange = 'sdr' | 'hdr'
export type EventShareStatus = 'parent' | 'multiple' | 'child' | 'single'

export type ProgramType = 'program' | 'other' | 'spot'
export type ReleaseLevel = 'normal' | 'prime' | 'original' | 'repeat'

export type EncodingFormat =
  | 'video/X-arib-mpeg2'
  | 'audio/X-arib-mpeg2-aac'
  | 'video/X-arib2-broadcast'

export type VideoFormat = '2K' | '4K' | '8K'

export interface Location {
  id: string
  name: string
}

export interface Main {
  url: string
  width: number
  height: number
}

export interface Citation {
  name: string
  url: string
}

export interface Genre {
  id: string
  name1: Name1
  name2: string
}

export interface Copyright {
  type: CopyrightType
  name?: string
  notice: string
  year?: number
}

export interface LogoClass {
  large?: Main
  main: Main
  medium: Main
  small: Main
  url?: string
}

export interface EyecatchListClass {
  large: Main
  main: Main
  medium: Main
  small: Main
  copyright?: Copyright
  caption?: string
}

export interface Badge9X4 {
  url: string
  main: Main
  small: Main
  medium?: Main
}

export interface AboutIdentifierGroup {
  tvEpisodeId: string
  tvSeriesId: string
  tvEpisodeName: string
  tvSeriesName: string
  hashtag: string[]
  siteId?: string
  serviceId: ServiceId[]
  formatGenreTag?: Location[]
  themeGenreTag?: Location[]
  packedTVSeriesName?: string
  aliasId?: string
  tvSeriesNameOriginal?: string
}

export interface PartOfSeriesIdentifierGroup {
  tvSeriesId: string
  tvSeriesPlaylistId: string
  tvSeriesUId: string
  tvSeriesName: string
  hashtag: string[]
  siteId?: string
  serviceId: ServiceId[]
  formatGenre?: Location[]
  themeGenre?: Location[]
  aliasId?: string
}

export interface VideoIdentifierGroup {
  environmentId: EnvironmentId
  broadcastEventId: string
  serviceId: ServiceId
  streamType: StreamType
}

export interface PublicationIdentifierGroup {
  broadcastEventId: string
  tvEpisodeId?: string
  tvEpisodeName?: string
  tvSeriesId?: string
  tvSeriesName?: string
  serviceId: ServiceId
  areaId: string
  stationId: string
  date: string
  eventId: string
  genre: Genre[]
  siteId?: string
  onid: string
  sid: string
  tsid: string
  systemUniqueId?: string
}

export interface PublishedOnIdentifierGroup {
  serviceId: ServiceId
  serviceName: string
  areaId: string
  areaName: string
  channelId: string
  channelKey: string
  channelAreaName: string
  channelStationName: string
  shortenedName: string
  shortenedDisplayName: string
  multiChannelDisplayName?: string
}

export interface Style {
  textLight: string
  textDark: string
  linkLight: string
  linkDark: string
  primaryLight: string
  primaryDark: string
}

export interface PartOfSeriesHero {
  main: Main
  medium: Main
}

export interface PublishedOnHero {
  url: string
  main: Main
  medium: Main
}

export interface DetailedDescription {
  epg40: string
  epg80: string
  epg200: string
  epgInformation: string
}

export interface DetailedContentStatus {
  environmentId: EnvironmentId
  streamType: StreamType
  contentStatus: PublishLevel
}

export interface VideoPublication {
  id: string
  url: string
  isLiveBroadcast: boolean
}

export interface Video {
  id: string
  name: string
  description: string
  url: string
  identifierGroup: VideoIdentifierGroup
  detailedContentStatus: DetailedContentStatus
  expires: string
  duration: string
  startDate: string
  endDate: string
  isDivided: boolean
  publication: VideoPublication[]
  uploadDate: string
}

export interface PartOfSeriesAdditionalProperty {
  publishLevel: PublishLevel
  layoutPattern: LayoutPattern
  episodeOrderBy: EpisodeOrderBy
  optional: EpisodeOrderBy[]
  seriesPackStatus: SeriesPackStatus
  supportMedia: SupportMedia[]
  supportMusicList: boolean
  supportPlusEmbed: boolean
}

export interface PartOfSeries {
  id: string
  name: string
  detailedSeriesNameRuby?: string
  identifierGroup: PartOfSeriesIdentifierGroup
  detailedSynonym: string[]
  sameAs: Citation[]
  canonical?: string
  description: string
  detailedCatch?: string
  logo: LogoClass
  eyecatch: LogoClass
  hero: PartOfSeriesHero
  style: Style
  additionalProperty: PartOfSeriesAdditionalProperty
  url: string
  itemUrl: string
}

export interface AboutAdditionalProperty {
  episodeMergeStatus: EpisodeMergeStatus
}

export interface About {
  id: string
  name: string
  detailedEpisodeNameRuby?: string
  episodeNumber?: number
  identifierGroup: AboutIdentifierGroup
  description: string
  partOfSeries: PartOfSeries
  eyecatch?: EyecatchListClass
  eyecatchList: EyecatchListClass[]
  url: string
  canonical?: string
  additionalProperty: AboutAdditionalProperty
  video: Video[]
}

export interface PublishedOn {
  type: PublishedOnType
  id: string
  name: string
  url: string
  broadcastDisplayName: string
  videoFormat: VideoFormat[]
  encodingFormat: EncodingFormat[]
  identifierGroup: PublishedOnIdentifierGroup
  logo: Badge9X4
  eyecatch: LogoClass
  hero: PublishedOnHero
  badge9x4: Badge9X4
}

export interface ActList {
  role?: string
  name: string
  nameRuby: string
  title?: string
}

export interface ByArtist {
  name: string
  role: string
  part: string
}

export interface MusicList {
  name: string
  nameruby: string
  lyricist: string
  composer: string
  arranger: string
  location: string
  provider: string
  label: string
  duration: string
  code: string
  byArtist: ByArtist[]
}

export interface Hsk {
  passedStartDateTime: string
  passedEndDateTime: string
  passedDeliveryPeriod: string
  passedLength: string
  updateDateTime: string
}

export interface Misc {
  displayVideoMode: DisplayVideoMode
  displayVideoRange: DisplayVideoRange
  displayAudioMode: AudioMode[]
  audioMode: AudioMode[]
  supportCaption: boolean
  supportSign: boolean
  supportHybridcast: boolean
  supportDataBroadcast: boolean
  isInteractive: boolean
  isChangeable: boolean
  releaseLevel: ReleaseLevel
  programType: ProgramType
  coverage: Coverage
  actList: ActList[]
  musicList: MusicList[]
  eventShareStatus: EventShareStatus
  hsk?: Hsk
  playControlSimul: boolean
  playControlDVR: boolean
  playControlVOD: boolean
  publishedPeriodFrom?: string
  publishedPeriodTo?: string
  freeLine?: string
}

export interface Publication {
  type: PublicationType
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  location: Location
  identifierGroup: PublicationIdentifierGroup
  misc: Misc
  url: string
  about?: About
  isLiveBroadcast: boolean
  detailedDescription: DetailedDescription
  duration: string
  posterframeList?: any[]
  citation?: Citation[]
}

export interface TimetableData {
  publishedOn: PublishedOn[]
  publication: Publication[]
}

export interface Timetable {
  g1: TimetableData
  g2: TimetableData
  e1: TimetableData
  e3: TimetableData
  s1: TimetableData
  s2: TimetableData
  s5: TimetableData
  s6: TimetableData
}
