export type TelemetryType = 'GPS' | 'ATTITUDE' | 'BATTERY' | 'STATUS';

export interface TelemetryEvent {
    drone_id: string;
    mission_id?: string;
    msg_id?: number; // MAVLink message ID
    msg_name?: string; // MAVLink message name
    timestamp?: number;

    lat?: number;
    lng?: number;
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
}
