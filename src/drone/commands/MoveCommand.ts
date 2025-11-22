import { Log } from '../../logger/Log';
import { BaseCommand, CommandOptions } from './BaseCommand';

export class MoveCommand extends BaseCommand {
    protected async run(options: CommandOptions): Promise<void> {
        const position = options.position;
        if (!position) throw new Error('Position is required for MoveCommand');

        Log.debug(`Moving drone to`, { context: 'MoveCommand', position });

        // TODO: Replace with MAVLink NAV_WAYPOINT or SET_POSITION_TARGET
        await this.adapter.sendCommand('MOVE', { position });

        Log.info(`Move command sent`, { context: 'MoveCommand', position });
    }
}
