export interface LogOptions {
    context?: string; // e.g., module or function
    error?: Error; // optional error object
    [key: string]: any; // extra info
}

export abstract class BaseLogTarget {
    abstract log(
        level: 'info' | 'warn' | 'error' | 'debug',
        message: string,
        options?: LogOptions,
    ): void;

    protected formatMessage(level: string, message: string, options?: LogOptions) {
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            context: options?.context || 'unknown',
            stack: options?.error?.stack || null,
            meta: { ...options },
        };
    }
}
