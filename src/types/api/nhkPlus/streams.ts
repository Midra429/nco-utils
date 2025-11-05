export interface StreamsResponse {
  playlist_id: string
  playlist_name: string
  playlist_description: null
  playlist_seeds: string
  playlist_category: string
  playlist_type: string
  schema_version: number
  styles: string
  operations: any[]
  created_at: string
  modified_at: string
  expired_at: string
  images: StreamsResponseImages
  behavior: Behavior
  config_ext: string
  hsk: HskElement[]
  body: Body[]
}

export interface Behavior {
  if_empty: string
  if_expired: string
  if_finished: string
}

export interface Body {
  stream_id: string
  stream_fmt: string
  stream_name: string
  stream_type: StreamType
  play_control: PlayControl
  published_period_from: string
  published_period_to: string
  play_mode: PlayMode
}

export interface PlayControl {
  simul: boolean
  dvr: boolean
  vod: boolean
  multi: null
}

export interface PlayMode {
  has_controls: boolean
  is_mute: boolean
  autoplay_delay: number
}

export interface StreamType {
  type: string
  current_position: number
  program_id: string
  service_id: string
  date: string
  start_time: string
  program: Program
}

export interface Program {
  id: string
  area: Area
  date: string
  service: Service
  event_id: string
  start_time: string
  end_time: string
  genre: string[]
  title: string
  subtitle: string
  content: string
  images: ProgramImages
  info: string
  act: string
  music: string
  free: string
  rate: string
  flags: Flags
  change: any[]
  icis: Icis
  lastupdate: string
  site_id: string
  url: Url
  keywords: string[]
  hashtags: string[]
  codes: Codes
  ch: Ch
  hsk: ProgramHsk
  extra: Extra
}

export interface Area {
  id: string
  name: string
}

export interface Ch {
  id: string
  name: string
  station: string
}

export interface Codes {
  code: string
  split1: string[]
}

export interface Extra {
  pr_movies: any[]
}

export interface Flags {
  sound: string
  teletext: string
  databroad: string
  rebroad: string
  multivoice: string
  interactive: string
  shuwa: string
  oneseg: string
  subchannel: string
  honyo: string
  saihoflag: string
  hybridcastid: string
  kido: string
  gashitsu: string
  sozai: string
  eizo: string
  marume: string
  bantype: string
  dohaishin: string
  hayamodoshi: string
  minogashi: string
  nod: string
}

export interface ProgramHsk {
  system_unique_id: string
  concurrent_delivery: string
  early_back_delivery: string
  passed_delivery: string
  nod_delivery: string
  passed_start_date_time: string
  passed_end_date_time: string
  passed_delivery_period: string
  passed_length: string
  early_back_delivery_reusable_flag: string
  passed_type: string
  genban_edit_flag: string
  genban_caption_flag: string
  news_xml_url: string
  posterframe_image_url: string
  qf_flag: string
  qf_program_name: string
  update_date_time: string
  passed_delivery_readyable_flag: string
  program_kind: string
  flow_code: string
  audio_mode1: string
  audio_mode2: string
  marume_id: string
  epg_disp_id: string
  event_share_gtv: string
  event_share_gtv_sub: string
  event_share_etv: string
  event_share_etv_sub: string
  event_share_bs: string
  event_share_bs_sub: string
  kido: string
  kidofuyo: string
  shikiiki: string
  broadcast_range: string
  video_descriptor: string
  rewritable_event_id: string
  variable_speed_flag: string
  epg_info: EpgInfo
  nol: Nol
}

export interface EpgInfo {
  event_id: string
  title: string
  start_time: string
  end_time: string
}

export interface Nol {
  seriesId: string
  seriesName: string
  episodeId: string
  episodeName: string
  image: string
}

export interface Icis {
  series_id: string
  contents_id: string
}

export interface ProgramImages {
  logo_l: BadgeClass
  thumbnail_m: BadgeClass
  hsk_posterframe: HskPosterframeClass
  nol_image: HskPosterframeClass
}

export interface HskPosterframeClass {
  url: string
}

export interface BadgeClass {
  url: string
  width: string
  height: string
}

export interface Service {
  id: string
  name: string
  images: ServiceImages
}

export interface ServiceImages {
  logo_s: BadgeClass
  logo_m: BadgeClass
  logo_l: BadgeClass
  badgeSmall: BadgeClass
  badge: BadgeClass
  logoSmall: BadgeClass
  badge9x4: BadgeClass
}

export interface Url {
  pc: string
  short: string
  nod: string
  nod_portal: string
}

export interface HskElement {
  service_id: string
  qf_mode: string
}

export interface StreamsResponseImages {
  logo_l: HskPosterframeClass
  thumbnail_m: HskPosterframeClass
}
