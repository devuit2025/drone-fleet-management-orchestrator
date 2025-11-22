import { DroneAdapterInterface } from './interfaces/DroneAdapterInterface';
import { BaseCommand, CommandOptions } from './commands/BaseCommand';
import { TakeoffCommand } from './commands/TakeoffCommand';
import { LandCommand } from './commands/LandCommand';
import { MoveCommand } from './commands/MoveCommand';
import { ReturnToHomeCommand } from './commands/ReturnToHomeCommand';
import { Log } from '../logger/Log';

export class CommandManager {
    private commandQueue: { command: BaseCommand; options: CommandOptions; immediate: boolean }[] =
        [];
    private isProcessing = false;

    constructor(private adapter: DroneAdapterInterface) {}

    // === Command getters ===
    public takeoff = async (options: CommandOptions = {}, immediate = true) => {
        const cmd = new TakeoffCommand(this.adapter);
        await this.enqueueCommand(cmd, options, immediate);
    };

    public land = async (options: CommandOptions = {}, immediate = true) => {
        const cmd = new LandCommand(this.adapter);
        await this.enqueueCommand(cmd, options, immediate);
    };

    public move = async (options: CommandOptions, immediate = true) => {
        const cmd = new MoveCommand(this.adapter);
        await this.enqueueCommand(cmd, options, immediate);
    };

    public returnToHome = async (options: CommandOptions = {}, immediate = true) => {
        const cmd = new ReturnToHomeCommand(this.adapter);
        await this.enqueueCommand(cmd, options, immediate);
    };

    // === Queue handling ===
    private async enqueueCommand(
        command: BaseCommand,
        options: CommandOptions = {},
        immediate: boolean = true,
    ) {
        this.commandQueue.push({ command, options, immediate });

        if (immediate) {
            await this.runNext();
        }
    }

    private async runNext() {
        if (this.isProcessing || this.commandQueue.length === 0) return;

        this.isProcessing = true;

        while (this.commandQueue.length > 0) {
            const { command, options } = this.commandQueue.shift()!;
            try {
                Log.info(`Executing command: ${command.constructor.name}`, {
                    context: 'CommandManager',
                    options,
                });
                await command.execute(options);
                Log.info(`Command executed: ${command.constructor.name}`, {
                    context: 'CommandManager',
                    options,
                });
            } catch (err: any) {
                Log.error(`Command failed: ${command.constructor.name}`, {
                    context: 'CommandManager',
                    options,
                    error: err,
                });
                // optionally break on failure
            }
        }

        this.isProcessing = false;
    }
}
