const WITH_COMMAND_REGEXP = /^\/[a-z_]+(?:\s|$)/

/**
 * コマンド付きコメント判定
 */
export function isCommentWithCommand(cmt: string) {
  return WITH_COMMAND_REGEXP.test(cmt)
}
