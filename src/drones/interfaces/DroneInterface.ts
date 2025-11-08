import { Telemetry } from "../../types";

export interface DroneInterface {
    id: string;
    name: string;
    connect(): Promise<void>;
    sendCommand(cmd: string): void;
    getTelemetry(): Telemetry;
}
