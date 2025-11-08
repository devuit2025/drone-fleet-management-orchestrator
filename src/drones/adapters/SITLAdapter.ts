import { DroneInterface } from "../interfaces/DroneInterface";
import { Telemetry } from "../../types";
import { EventBus } from "../../fleet/EventBus";

export class SITLAdapter implements DroneInterface {
    id: string;
    name: string;
    private telemetry: Telemetry;
    private interval?: NodeJS.Timer;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.telemetry = { lat: 0, lng: 0, alt: 0, battery: 100, speed: 0 };
    }

    async connect() {
        console.log(`[SITL] ${this.name} connected.`);
        const bus = EventBus.getInstance();
        this.interval = setInterval(() => {
            // simple simulation
            this.telemetry.lat += Math.random() * 0.0001;
            this.telemetry.lng += Math.random() * 0.0001;
            this.telemetry.alt += Math.random() * 0.1;
            this.telemetry.battery -= 0.1;
            this.telemetry.speed = Math.random() * 5;

            bus.emit("telemetry", this.id, { ...this.telemetry });
        }, 1000);
    }

    sendCommand(cmd: string) {
        console.log(`[SITL] ${this.name} executing command: ${cmd}`);
    }

    getTelemetry(): Telemetry {
        return this.telemetry;
    }
}
