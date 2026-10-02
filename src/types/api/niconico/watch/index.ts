// 共通化した動画情報
export interface Data {
  comment: Comment
  owner: Owner | null
  channel: Channel | null
  genre: Genre
  tags: Tag[]
  video: Video
}

// コメント取得・表示
export interface Comment {
  threads: CommentThread[]
  layers: CommentLayer[]
  ng: CommentNg
}

export interface CommentThread {
  id: number
  fork: number
  forkLabel: CommentThreadForkLabel
  label: CommentThreadLabel
  videoId: string
  isPostTarget: boolean
  isOwnerThread: boolean
  is184Forced: boolean
}

export type CommentThreadForkLabel = 'owner' | 'main' | 'easy' | 'ai'

export type CommentThreadLabel =
  | 'default'
  | 'owner'
  | 'main'
  | 'community'
  | 'extra-community'
  | 'easy'
  | 'extra-easy'
  | 'ai'

export interface CommentLayer {
  index: number
  isTranslucent: boolean
  components: CommentLayerComponent[]
}

export interface CommentLayerComponent {
  threadId: number
  fork: number
  forkLabel: CommentThreadForkLabel
}

export interface CommentNg {
  owner: unknown[]
  viewer: CommentNgViewer | null
}

export interface CommentNgViewer {
  revision: number
  count: number
  items: CommentNgItem[]
}

export interface CommentNgItem {
  type: CommentNgItemType
  source: string
}

export type CommentNgItemType = 'word' | 'id' | 'command'

// 投稿者
export interface Owner {
  id: string
  name: string
  iconUrl: string
}

// チャンネル
export interface Channel extends Owner {
  isOfficialAnime: boolean
}

// ジャンル
export interface Genre {
  key: string
  label: string
  isImmoral: boolean
  isDisabled: boolean
  isNotSet: boolean
}

// タグ
export interface Tag {
  name: string
  isLocked: boolean
}

// 動画
export interface Video {
  id: string
  contentType: VideoContentType
  title: string
  description: string
  count: VideoCount
  duration: number
  thumbnail: VideoThumbnail
  registeredAt: number
}

export type VideoContentType = 'long' | 'short'

export interface VideoCount {
  view: number
  comment: number
  mylist: number
  like: number
}

export interface VideoThumbnail {
  normal: string
  middle: string | null
  large: string | null
  player: string
  ogp: string
  short: string | null
}
