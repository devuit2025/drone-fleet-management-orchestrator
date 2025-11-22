import { DroneAdapterInterface } from './interfaces/DroneAdapterInterface';
import { CommandManager } from './CommandManager';

/**
 * @todo move to /src/core
 */
export class DroneFacade {
    private commandManager: CommandManager;

    constructor(private adapter: DroneAdapterInterface) {
        this.commandManager = new CommandManager(adapter);
    }

    async connect() {
        await this.adapter.connect();
    }

    async disconnect() {
        await this.adapter.disconnect();
    }
    async takeOff(altitude: number = 10, immediate: boolean = true) {
        await this.commandManager.takeoff({ altitude }, immediate);
    }

    async land(immediate: boolean = true) {
        await this.commandManager.land({}, immediate);
    }

    async move(position: { lat: number; lon: number; alt: number }, immediate: boolean = true) {
        await this.commandManager.move({ position }, immediate);
    }

    async returnToHome(immediate: boolean = true) {
        await this.commandManager.returnToHome({}, immediate);
    }
}
