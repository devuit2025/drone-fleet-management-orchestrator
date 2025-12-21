// index.ts
import { TelemetryConsumer } from './telemetry/TelemetryConsumer';

const telemetry = new TelemetryConsumer();

// This matches sim_vehicle.py command:
telemetry.registerSimVehicle('drone1', 14555);
