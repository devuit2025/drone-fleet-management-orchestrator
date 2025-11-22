import { Log } from '../../logger/Log';
import { BaseCommand, CommandOptions } from './BaseCommand';

export class ReturnToHomeCommand extends BaseCommand {
    protected async run(options: CommandOptions): Promise<void> {
        Log.debug(`Returning drone to home`, { context: 'ReturnToHomeCommand' });

        // TODO: Implement MAVLink RTL (Return To Launch) command
        await this.adapter.sendCommand('RETURN_TO_HOME');

        Log.info(`Return to Home command sent`, { context: 'ReturnToHomeCommand' });
    }
}
