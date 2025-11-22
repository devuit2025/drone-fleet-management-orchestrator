import winston, { Logger } from 'winston';
import util from 'util';

// Define standard log options
export interface LogOptions {
    context?: string; // e.g., module or class name
    error?: Error; // optional error object
    [key: string]: any; // extra metadata
}

const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const logMeta = meta as LogOptions;
    const context = logMeta.context || 'unknown';
    const stack = logMeta.error?.stack ? `\n${logMeta.error.stack}` : '';

    // Remove known fields and symbols to pretty-print only useful metadata
    const extraMeta: Record<string, any> = {};
    Object.keys(meta).forEach(key => {
        if (!key.startsWith('Symbol(') && key !== 'context' && key !== 'error') {
            extraMeta[key] = meta[key];
        }
    });

    const metaString = Object.keys(extraMeta).length
        ? '\n' +
          util
              .inspect(extraMeta, { depth: 5, colors: true, compact: false })
              .split('\n')
              .map(line => '  ' + line)
              .join('\n')
        : '';

    // Add an extra newline at the end
    return `[${timestamp}] [${level}] [${context}] ${message}${stack}${metaString}\n`;
});

// Create Winston logger instance
const logger: Logger = winston.createLogger({
    /**
     * Log level controls the **minimum severity** logged:
     * debug < info < warn < error
     * - debug: detailed debugging info (dev only)
     * - info: general operational info
     * - warn: something unexpected but not fatal
     * - error: errors that must be addressed
     */
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',

    defaultMeta: {
        /** Set default meta data */
    },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat,
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Add colorized console output for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                logFormat,
            ),
        }),
    );
}

function cleanMeta(meta: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    Object.keys(meta).forEach(key => {
        if (!key.startsWith('Symbol(')) {
            clean[key] = meta[key];
        }
    });
    return clean;
}

// Export concise logging functions
export const Log = {
    info: (message: string, options: LogOptions = {}) => logger.info(message, options),
    warn: (message: string, options: LogOptions = {}) => logger.warn(message, options),
    error: (message: string, options: LogOptions = {}) => logger.error(message, options),
    debug: (message: string, options: LogOptions = {}) => logger.debug(message, options),
};
