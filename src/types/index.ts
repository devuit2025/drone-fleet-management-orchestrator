export interface Telemetry {
    lat: number;
    lng: number;
    alt: number;
    battery: number;
    speed: number;
}

export interface Mission {
    id: string;
    waypoints: Array<{ lat: number; lng: number; alt: number }>;
}
