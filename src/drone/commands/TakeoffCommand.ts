import { Log } from '../../logger/Log';
import { BaseCommand, CommandOptions } from './BaseCommand';

export class TakeoffCommand extends BaseCommand {
    protected async run(options: CommandOptions): Promise<void> {
        const altitude = options.altitude || 10;

        Log.debug(`Preparing takeoff to ${altitude} meters`, { context: 'TakeoffCommand' });

        // TODO: Replace with actual MAVLink TAKEOFF message
        await this.adapter.sendCommand('TAKEOFF', { altitude });

        Log.info(`Takeoff command sent`, { context: 'TakeoffCommand', altitude });
    }
}
