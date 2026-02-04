export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  enableConsole: boolean
  enableFile: boolean
  logLevel: LogLevel
}

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

class Logger {
  private config: LoggerConfig

  constructor(config?: Partial<LoggerConfig>) {
    const isDevelopment = typeof process !== 'undefined' 
      ? process.env.NODE_ENV === 'development'
      : typeof window !== 'undefined' && window.location.hostname === 'localhost'
    
    this.config = {
      enableConsole: isDevelopment,
      enableFile: typeof process !== 'undefined' && process.env.LOG_TO_FILE === 'true',
      logLevel: (typeof process !== 'undefined' && process.env.LOG_LEVEL as LogLevel) || 'info',
      ...config
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return levels[level] >= levels[this.config.logLevel]
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.debug(`[DEBUG] ${message}`, data)
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info') && this.config.enableConsole) {
      console.info(`[INFO] ${message}`, data)
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn') && this.config.enableConsole) {
      console.warn(`[WARN] ${message}`, data)
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog('error') && this.config.enableConsole) {
      console.error(`[ERROR] ${message}`, error)
    }
  }
}

export const logger = new Logger()

// Global logger instance
export default logger
