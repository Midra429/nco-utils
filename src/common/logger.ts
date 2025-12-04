let $name: string = '[nco-utils]'
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

export function setLoggerName(name: typeof $name) {
  $name = `[${name}]`
}
export function setLoggerLevels(levels: typeof $levels) {
  $levels = levels
}

export const logger = {
  ...console,

  // Verbose
  debug(label: string, ...data: any[]): void {
    if ($levels.verbose) {
      if (data.length) {
        data.unshift(`${$name} ${label}:`)
      } else {
        data.unshift($name)
        data.push(label)
      }

      console.log(...data)
    }
  },

  // Info
  info(label: string, ...data: any[]): void {
    if ($levels.info) {
      if (data.length) {
        data.unshift(`${$name} ${label}:`)
      } else {
        data.unshift($name)
        data.push(label)
      }

      console.log(...data)
    }
  },
  log(label: string, ...data: any[]): void {
    this.info(label, ...data)
  },

  // Warnings
  warn(label: string, ...data: any[]): void {
    if ($levels.warnings) {
      if (data.length) {
        data.unshift(`${$name} ${label}:`)
      } else {
        data.unshift($name)
        data.push(label)
      }

      console.warn(...data)
    }
  },

  // Errors
  error(label: string, ...data: any[]): void {
    if ($levels.errors) {
      if (data.length) {
        data.unshift(`${$name} ${label}:`)
      } else {
        data.unshift($name)
        data.push(label)
      }

      console.error(...data)
    }
  },
} satisfies Console
