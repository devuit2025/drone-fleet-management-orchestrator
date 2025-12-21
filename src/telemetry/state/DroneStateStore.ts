import { TelemetryEvent } from '../types/TelemetryEvent';

// state/DroneState.ts
export type DroneState = {
    /** Latest merged values */
    location?: {
        lat: number;
        lng: number;
    };

    altitude_m?: number;
    speed_mps?: number;
    heading_deg?: number;

    roll_deg?: number;
    pitch_deg?: number;
    yaw_deg?: number;

    battery_pct?: number;
    battery_voltage?: number;

    status?: string;
    extra?: Record<string, any>;

    /** Emission bookkeeping */
    lastEmitTs: Record<string, number>;
};

export class DroneStateStore {
    private store = new Map<string, DroneState>();

    get(droneId: string): DroneState {
        let state = this.store.get(droneId);

        if (!state) {
            state = this.createInitialState();
            this.store.set(droneId, state);
        }

        return state;
    }

    clear(droneId: string): void {
        this.store.delete(droneId);
    }

    private createInitialState(): DroneState {
        return {
            lastEmitTs: {},
        };
    }
}
