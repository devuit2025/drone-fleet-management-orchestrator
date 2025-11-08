import { EventBus } from "./EventBus";

export class SafetyMonitor {
    private bus = EventBus.getInstance();

    constructor() {
        this.bus.on("telemetry", (droneId: string, telemetry: any) => {
            if (telemetry.battery < 20) {
                console.warn(`[SafetyMonitor] Low battery on ${droneId}: ${telemetry.battery}%`);
            }
        });
    }
}
