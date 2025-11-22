import { BaseLogTarget, LogOptions } from './BaseLogTarget';

export class ConsoleLogTarget extends BaseLogTarget {
    log(level: 'info' | 'warn' | 'error' | 'debug', message: string, options?: LogOptions): void {
        const formatted = this.formatMessage(level, message, options);
        console.log(
            `[${formatted.timestamp}] [${formatted.level}] [${formatted.context}] ${formatted.message}`,
            formatted.meta,
        );
    }
}
