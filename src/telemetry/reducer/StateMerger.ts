import { TelemetryEvent } from '../types/TelemetryEvent';
import { mergeWith } from 'lodash';

export class StateMerger {
    merge(state: any, event: TelemetryEvent): void {
        mergeWith(state, event, (obj, src) => {
            if (src == null) return obj;
        });

        // if (event.lat != null && event.lng != null) {
        //     state.location = { lat: event.lat, lng: event.lng };
        // }

        // if (event.altitude_m != null) state.altitude_m = event.altitude_m;
        // if (event.speed_mps != null) state.speed_mps = event.speed_mps;
        // if (event.heading_deg != null) state.heading_deg = event.heading_deg;

        // if (event.roll_deg != null) state.roll_deg = event.roll_deg;
        // if (event.pitch_deg != null) state.pitch_deg = event.pitch_deg;
        // if (event.yaw_deg != null) state.yaw_deg = event.yaw_deg;

        // if (event.battery_pct != null) state.battery_pct = event.battery_pct;
        // if (event.battery_voltage != null) state.battery_voltage = event.battery_voltage;

        // if (event.status != null) state.status = event.status;

        // if (event.extra != null) {
        //     state.extra = { ...(state.extra ?? {}), ...event.extra };
        // }
    }
}
