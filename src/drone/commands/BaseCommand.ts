import { Log } from '../../logger/Log';
import { DroneAdapterInterface } from '../interfaces/DroneAdapterInterface';

export interface CommandOptions {
    altitude?: number;
    position?: { lat: number; lon: number; alt: number };
    speed?: number;
    [key: string]: any;
}

export abstract class BaseCommand {
    protected adapter: DroneAdapterInterface;

    constructor(adapter: DroneAdapterInterface) {
        this.adapter = adapter;
    }

    /**
     * Execute the command with optional parameters
     */
    async execute(options: CommandOptions = {}): Promise<void> {
        try {
            Log.info(`Executing command: ${this.constructor.name}`, {
                context: 'Command',
                options,
            });
            await this.run(options);
            Log.info(`Command executed successfully: ${this.constructor.name}`, {
                context: 'Command',
                options,
            });
        } catch (err: any) {
            Log.error(`Command failed: ${this.constructor.name}`, {
                context: 'Command',
                options,
                error: err,
            });
            await this.handleError(err, options);
            throw err; // propagate error if necessary
        }
    }

    /**
     * Actual command logic implemented by subclasses
     */
    protected abstract run(options: CommandOptions): Promise<void>;

    /**
     * Optional error handling / rollback
     */
    protected async handleError(err: Error, options: CommandOptions): Promise<void> {
        Log.warn(`Handling error for command: ${this.constructor.name}`, {
            context: 'Command',
            options,
            error: err,
        });
    }
}
