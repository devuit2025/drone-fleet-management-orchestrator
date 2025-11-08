import { DroneInterface } from "../drones/interfaces/DroneInterface";
import { EventBus } from "./EventBus";
import { Mission } from "../types";

export class FleetManager {
    private drones: Map<string, DroneInterface> = new Map();
    private bus = EventBus.getInstance();

    constructor() {
        this.bus.on("telemetry", (droneId: string, telemetry) => {
            console.log(`[FleetManager] Telemetry from ${droneId}:`, telemetry);
        });
    }

    registerDrone(drone: DroneInterface) {
        this.drones.set(drone.id, drone);
    }

    async connectAll() {
        for (const drone of this.drones.values()) {
            await drone.connect();
        }
    }

    assignMission(droneId: string, mission: Mission) {
        const drone = this.drones.get(droneId);
        if (!drone) throw new Error(`Drone ${droneId} not found`);
        console.log(`[FleetManager] Assigning mission ${mission.id} to ${droneId}`);
        // simple: just send first waypoint
        if (mission.waypoints.length > 0) {
            const wp = mission.waypoints[0];
            drone.sendCommand(`Go to ${wp.lat},${wp.lng},${wp.alt}`);
        }
    }

    broadcastCommand(cmd: string) {
        for (const drone of this.drones.values()) {
            drone.sendCommand(cmd);
        }
    }
}
