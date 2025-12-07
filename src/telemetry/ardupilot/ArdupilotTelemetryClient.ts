// telemetry/ardupilot/ArdupilotTelemetryClient.ts
import { ArdupilotTelemetryAdapter } from "./adapters/ArdupilotTelemetryAdapter";
import { publishTelemetryGlobalPosition } from 'broker-sdk';

export class ArdupilotTelemetryClient {
  constructor(private droneId: string, private port: number) {}

  start() {
    const adapter = new ArdupilotTelemetryAdapter(this.port);

    adapter.start((telemetry) => {
        publishTelemetryGlobalPosition(this.droneId, telemetry)
      console.log(`[${this.droneId}]`, telemetry);
    });
  }
}
