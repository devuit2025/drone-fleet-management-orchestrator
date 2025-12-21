import { TelemetryEvent } from '../types/TelemetryEvent';
import { MSG_ID } from "../../telemetry/ardupilot/parser/MavlinkMessageMap";

export class DeltaEvaluator {
    changed(state: any, event: TelemetryEvent): boolean {
        switch (event.msg_id) {
            case MSG_ID.GLOBAL_POSITION_INT:
                return this.gps(state, event);
            // case 'BATTERY':
            //     return this.battery(state, event);
            // case 'ATTITUDE':
            //     return this.attitude(state, event);
            default:
                return true;
        }
    }

    private gps(state: any, event: TelemetryEvent): boolean {
        if (!state.location || event.lat == null) return true;

        return (
            Math.abs(state.location.lat - event.lat) > 0.00001 ||
            Math.abs(state.location.lng - event.lng!) > 0.00001
        );
    }

    private battery(state: any, event: TelemetryEvent): boolean {
        if (state.battery_pct == null || event.battery_pct == null) return true;
        return Math.abs(state.battery_pct - event.battery_pct) > 0.3;
    }

    private attitude(state: any, event: TelemetryEvent): boolean {
        if (state.roll_deg == null || event.roll_deg == null) return true;

        return (
            Math.abs(state.roll_deg - event.roll_deg) > 1 ||
            Math.abs(state.pitch_deg! - event.pitch_deg!) > 1 ||
            Math.abs(state.yaw_deg! - event.yaw_deg!) > 2
        );
    }
}
