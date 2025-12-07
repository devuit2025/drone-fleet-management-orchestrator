// telemetry/TelemetryConsumer.ts
import { ArdupilotTelemetryClient } from "./ardupilot/ArdupilotTelemetryClient";

export class TelemetryConsumer {
  registerSimVehicle(droneId: string, udpPort: number) {
    const client = new ArdupilotTelemetryClient(droneId, udpPort);
    client.start();
  }
}