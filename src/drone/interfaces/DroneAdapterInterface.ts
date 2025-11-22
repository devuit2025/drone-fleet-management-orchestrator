export interface DroneAdapterInterface {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendCommand(command: string, params?: any): Promise<void>;
    readTelemetry(): Promise<any>;
}
