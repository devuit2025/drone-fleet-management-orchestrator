import dgram from "dgram";
import { DroneInterface } from "../interfaces/DroneInterface";
import { Telemetry } from "../../types";
import { EventBus } from "../../fleet/EventBus";

export class MAVLinkAdapter implements DroneInterface {
    id: string;
    name: string;
    private host: string;
    private port: number;
    private client: dgram.Socket;
    private telemetry: Telemetry = { lat: 0, lng: 0, alt: 0, battery: 100, speed: 0 };
    private bus = EventBus.getInstance();

    constructor(id: string, name: string, host: string, port: number) {
        this.id = id;
        this.name = name;
        this.host = host;
        this.port = port;
        this.client = dgram.createSocket("udp4");
    }

    async connect() {
        this.client.on("message", (msg) => {
            // For simplicity, assume message is JSON telemetry (later decode MAVLink)
            try {
                const data = JSON.parse(msg.toString());
                this.telemetry = { ...data };
                this.bus.emit("telemetry", this.id, this.telemetry);
            } catch (e) {
                console.warn(`[MAVLinkAdapter] Failed to parse message:`, msg.toString());
            }
        });

        this.client.on("error", (err) => {
            console.error(`[MAVLinkAdapter] Error for ${this.name}:`, err);
        });

        console.log(`[MAVLinkAdapter] Connected to ${this.name} at ${this.host}:${this.port}`);
    }

    sendCommand(cmd: string) {
        // For now, send plain text command (later use MAVLink packet)
        const message = Buffer.from(JSON.stringify({ cmd }));
        this.client.send(message, this.port, this.host, (err) => {
            if (err) console.error(`[MAVLinkAdapter] Failed to send command:`, err);
        });
        console.log(`[MAVLinkAdapter] Command sent to ${this.name}: ${cmd}`);
    }

    getTelemetry(): Telemetry {
        return this.telemetry;
    }
}
