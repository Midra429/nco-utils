import type * as Watch from '@/types/api/niconico/watch'
import type * as WatchV4 from '@/types/api/niconico/watch/v4'

export function normalizeWatchV4Data(data: WatchV4.Data): Watch.Data {
  const { comment, tags, video, metadata, genre } = data
  const { owner } = metadata.jsonLd

  return {
    comment: {
      threads: comment.threads,
      layers: comment.layers,
      ng: {
        owner: comment.ng.owner,
        viewer: comment.ng.viewer
          ? {
              ...comment.ng.viewer,
              items: comment.ng.viewer.items.map((item) => ({
                type: item.type,
                source: item.source,
              })),
            }
          : null,
      },
    },

    owner:
      owner.type === 'user'
        ? {
            id: owner.id,
            name: owner.name,
            iconUrl: owner.iconUrl,
          }
        : null,

    channel:
      owner.type === 'channel'
        ? {
            id: owner.id,
            name: owner.name,
            iconUrl: owner.iconUrl,
            isOfficialAnime: genre.key === 'anime' || genre.label === 'アニメ',
          }
        : null,

    genre: {
      key: genre.key,
      label: genre.label,
      isImmoral: genre.isImmoral,
      isDisabled: genre.isDisabled,
      isNotSet: genre.isNotSet,
    },

    tags: tags.items.map((item) => ({
      name: item.name,
      isLocked: item.isLocked,
    })),

    video: {
      id: video.id,
      contentType: video.contentType,
      title: video.title,
      description: video.description,
      count: video.count,
      duration: video.duration,
      thumbnail: video.thumbnail,
      registeredAt: new Date(video.registeredAt).getTime(),
    },
  }
}
