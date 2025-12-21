// telemetry/ardupilot/adapters/ArdupilotTelemetryAdapter.ts
import { MavlinkParser } from '../parser/MavlinkParser';
import { MESSAGE_NORMALIZERS } from '../parser/MavlinkMessageMap';

export class ArdupilotTelemetryAdapter {
    constructor(private udpPort: number) {}

    start(onTelemetry: (data: any) => void) {
        const parser = new MavlinkParser(this.udpPort);

        parser.start(decoded => {
            const normalizer = MESSAGE_NORMALIZERS[decoded.msgId];
            if (!normalizer) return;

            const normalized = normalizer.normalize(decoded.payload);

            /** Common schema */
            normalized.msg_name = decoded.msgName,
            normalized.msg_id = decoded.msgId,
            
            onTelemetry(normalized);
        });
    }
}
