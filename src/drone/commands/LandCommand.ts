import { Log } from '../../logger/Log';
import { BaseCommand, CommandOptions } from './BaseCommand';

export class LandCommand extends BaseCommand {
    protected async run(options: CommandOptions): Promise<void> {
        Log.debug(`Preparing to land drone`, { context: 'LandCommand' });

        // TODO: Replace with MAVLink LAND message
        await this.adapter.sendCommand('LAND');

        Log.info(`Land command sent`, { context: 'LandCommand' });
    }
}
