import type * as Watch from '@/types/api/niconico/watch'
import type * as WatchV3 from '@/types/api/niconico/watch/v3'

export function normalizeWatchV3Data(data: WatchV3.Data): Watch.Data {
  const { comment, tag, video, genre, channel, owner } = data

  return {
    comment: {
      threads: comment.threads.map((thread) => ({
        id: thread.id,
        fork: thread.fork,
        forkLabel: thread.forkLabel,
        label: thread.label,
        videoId: thread.videoId,
        isPostTarget: thread.isDefaultPostTarget,
        isOwnerThread: thread.isOwnerThread,
        is184Forced: thread.is184Forced,
      })),
      layers: comment.layers.map((layer) => ({
        index: layer.index,
        isTranslucent: layer.isTranslucent,
        components: layer.threadIds.map((thread) => ({
          threadId: thread.id,
          fork: thread.fork,
          forkLabel: thread.forkLabel,
        })),
      })),
      ng: {
        owner: [...comment.ng.channel, ...comment.ng.owner],
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

    owner: owner
      ? {
          id: owner.id.toString(),
          name: owner.nickname,
          iconUrl: owner.iconUrl,
        }
      : null,

    channel: channel
      ? {
          id: channel.id,
          name: channel.name,
          iconUrl: channel.thumbnail.url,
          isOfficialAnime: channel.isOfficialAnime,
        }
      : null,

    genre: {
      key: genre.key,
      label: genre.label,
      isImmoral: genre.isImmoral,
      isDisabled: genre.isDisabled,
      isNotSet: genre.isNotSet,
    },

    tags: tag.items.map((item) => ({
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
      thumbnail: {
        normal: video.thumbnail.url,
        middle: video.thumbnail.middleUrl,
        large: video.thumbnail.largeUrl,
        player: video.thumbnail.player,
        ogp: video.thumbnail.ogp,
        short: video.thumbnail.short,
      },
      registeredAt: new Date(video.registeredAt).getTime(),
    },
  }
}
