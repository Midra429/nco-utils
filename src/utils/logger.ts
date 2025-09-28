const LOGGER_NAME = '[nco-utils]'

let $levels: {
  verbose?: boolean
  info?: boolean
  warnings?: boolean
  errors?: boolean
} = {
  verbose: true,
  info: true,
  warnings: true,
  errors: true,
}

export function setLoggerLevels(levels: typeof $levels) {
  $levels = levels
}

export const logger = {
  ...console,

  // Verbose
  debug(label: string, ...data: any[]): void {
    if ($levels.verbose) {
      data.unshift(`${LOGGER_NAME} ${label}:`)

      console.log(...data)
    }
  },

  // Info
  info(label: string, ...data: any[]): void {
    if ($levels.info) {
      data.unshift(`${LOGGER_NAME} ${label}:`)

      console.log(...data)
    }
  },
  log(label: string, ...data: any[]): void {
    this.info(label, ...data)
  },

  // Warnings
  warn(label: string, ...data: any[]): void {
    if ($levels.warnings) {
      data.unshift(`${LOGGER_NAME} ${label}:`)

      console.warn(...data)
    }
  },

  // Errors
  error(label: string, ...data: any[]): void {
    if ($levels.errors) {
      data.unshift(`${LOGGER_NAME} ${label}:`)

      console.error(...data)
    }
  },
} satisfies Console
