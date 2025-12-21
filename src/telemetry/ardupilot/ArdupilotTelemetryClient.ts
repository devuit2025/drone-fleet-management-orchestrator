// telemetry/ardupilot/ArdupilotTelemetryClient.ts
import { ArdupilotTelemetryAdapter } from './adapters/ArdupilotTelemetryAdapter';
import { DroneStateStore } from '../state/DroneStateStore';
import { TelemetryReducer } from '../reducer/TelemetryReducer';
import { TelemetryPublisher } from '../publisher/TelemetryPublisher';

export class ArdupilotTelemetryClient {
    private stateStore = new DroneStateStore();
    private reducer = new TelemetryReducer(this.stateStore);
    private publisher = new TelemetryPublisher();

    constructor(
        private droneId: string,
        private port: number,
    ) {}

    start() {
        const adapter = new ArdupilotTelemetryAdapter(this.port);

        adapter.start(normalized => {
            if (!normalized) {
                return;
            }

            const reduced = this.reducer.reduce({
                drone_id: this.droneId,
                timestamp: Date.now(),
                ...normalized,
            });

            if (reduced) {
                this.publisher.publish(reduced);
            }
        });
    }
}
