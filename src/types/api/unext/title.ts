export interface TitleResponse {
  data: {
    webfront_title_stage: TitleStage
  }
}

export interface TitleStage {
  id: string
  titleName: string
  episode: Episode
}

export interface Episode {
  id: string
  displayNo: string
  episodeName: string
  duration: number
}
