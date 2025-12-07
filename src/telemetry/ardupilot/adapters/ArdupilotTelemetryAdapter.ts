// telemetry/ardupilot/adapters/ArdupilotTelemetryAdapter.ts
import { MavlinkParser } from "../parser/MavlinkParser";
import { MESSAGE_NORMALIZERS } from "../parser/MavlinkMessageMap";

export class ArdupilotTelemetryAdapter {
  constructor(private udpPort: number) {}

  start(onTelemetry: (data: any) => void) {
    const parser = new MavlinkParser(this.udpPort);

    parser.start((decoded) => {
        console.log('ArdupilotTelemetryAdapter:', decoded.msgId)
        const normalizer = MESSAGE_NORMALIZERS[decoded.msgId];
        if (!normalizer) return;

        const normalized = normalizer.normalize(decoded.payload);
        onTelemetry(normalized);
    });
  }
}
