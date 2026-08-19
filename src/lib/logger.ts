/**
 * Structured JSON logger for SamayPe.AI
 * Replaces raw console.log/warn/error with correlation-ID-aware, parseable output.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  requestId?: string;
  userId?: string;
  route?: string;
  latencyMs?: number;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ?? {}),
  };
  // In production this goes to stdout → Cloud Logging / log aggregator.
  // console.log serialises to a single-line JSON string.
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
  debug: (message: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV === 'development') log('debug', message, meta);
  },
};

/** Generate a short random request ID for log correlation. */
export function generateRequestId(): string {
  return Math.random().toString(36).slice(2, 10);
}
