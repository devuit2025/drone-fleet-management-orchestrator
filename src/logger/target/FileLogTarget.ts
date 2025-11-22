// core/logger/FileLogTarget.ts
import { BaseLogTarget, LogOptions } from './BaseLogTarget';
import winston from 'winston';

export class FileLogTarget extends BaseLogTarget {
    private logger: winston.Logger;

    constructor(filename: string = 'app.log') {
        super();
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            transports: [new winston.transports.File({ filename })],
        });
    }

    log(level: 'info' | 'warn' | 'error' | 'debug', message: string, options?: LogOptions): void {
        const formatted = this.formatMessage(level, message, options);
        this.logger.log(level, formatted);
    }
}
