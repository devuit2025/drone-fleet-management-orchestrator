import dgram from "dgram";

const MAVLINK_HOST = process.env.MAVLINK_HOST || "ardupilot";
const MAVLINK_PORT = parseInt(process.env.MAVLINK_PORT || "14550");

// Create UDP client to receive telemetry
const client = dgram.createSocket("udp4");

client.on("message", (msg) => {
    try {
        // For simplicity, assume telemetry is JSON (from SITL or a simulated sender)
        const telemetry = JSON.parse(msg.toString());
        console.log(`[Telemetry] Drone: ${telemetry.droneId || "sim"} | Data:`, telemetry);
    } catch (e) {
        console.warn("[Telemetry] Could not parse message:", msg.toString());
    }
});

client.on("listening", () => {
    const address = client.address();
    console.log(`[UDP] Listening for telemetry on ${address.address}:${address.port}`);
});

client.on("error", (err) => {
    console.error("[UDP] Error:", err);
    client.close();
});

// Bind client to a local port (any available port)
client.bind({
  address: '0.0.0.0',
  port: MAVLINK_PORT
});

// Keep Node.js process alive
process.stdin.resume();


// import { SETTINGS } from "./config/settings";
// import { SITLAdapter } from "./drones/adapters/SITLAdapter";
// import { FleetManager } from "./fleet/FleetManager";
// import { MissionPlanner } from "./fleet/MissionPlanner";
// import { SafetyMonitor } from "./fleet/SafetyMonitor";

// // Initialize Fleet
// const fleetManager = new FleetManager();
// const safetyMonitor = new SafetyMonitor();
// const missionPlanner = new MissionPlanner(fleetManager);

// // Register drones
// SETTINGS.drones.forEach(d => {
//     const drone = new SITLAdapter(d.id, d.name);
//     fleetManager.registerDrone(drone);
// });

// // Connect and simulate
// (async () => {
//     await fleetManager.connectAll();

//     // Schedule a simple mission for first drone
//     const mission = {
//         id: "mission-1",
//         waypoints: [
//             { lat: 10.0, lng: 10.0, alt: 5 },
//             { lat: 10.1, lng: 10.1, alt: 10 }
//         ]
//     };

//     missionPlanner.scheduleMission("drone-1", mission);

//     // Broadcast a command to all drones
//     fleetManager.broadcastCommand("Takeoff");
// })();
