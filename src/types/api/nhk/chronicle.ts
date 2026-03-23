export interface Chronicle {
  timestamp: string
  status: number
  path: string
  total: number
  result: ChronicleResult[]
  error: string
}

export interface ChronicleResult {
  epgKijutsu: string
  performer: Performer
  totalTime: string
  airtime1: string
  airtime2: string
  title1: string
  title2: string
  channel1: string
  title3: string
  seisaku: string
  episodeId: string
  airdate2: string
  airdate1: string
  seriesId: string
  airweek2: string
  crnId: string
  airweek1: string
  kakNaiyou: string
  epgNaiyo: string
  dasId: string
}

export interface Performer {
  name: string
  yakuwari: string
}
