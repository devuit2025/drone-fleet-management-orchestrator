// index.ts
import { TelemetryConsumer } from "./telemetry/TelemetryConsumer";
import { publishTelemetryGlobalPosition } from 'broker-sdk';


const telemetry = new TelemetryConsumer();

// This matches your sim_vehicle.py command:
telemetry.registerSimVehicle("drone1", 14555); 


// testing
// const telemetry = {
//     droneId: '1',
//     timestamp: Date.now(),
//     position: { lat: 10.123, lon: 106.123, alt: 50 },
//     battery: 87,
// };
// publishTelemetryGlobalPosition('drone1', telemetry)