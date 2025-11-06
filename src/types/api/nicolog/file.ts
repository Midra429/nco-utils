export interface FileXml2js {
  packet: {
    chat: ChatItemXml2js[]
  }
}

export interface ChatItemXml2js {
  _: string
  $: {
    thread: string
    vpos: string
    date: string
    date_usec: string
    user_id?: string
    no?: string
    name?: string
    anonymity?: string
    mail?: string
    premium?: string
  }
}
