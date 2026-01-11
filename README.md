# Module: Drone Fleet Management Orchestrator (Tự làm)

## Tổng quan

Module **Orchestrator** là service trung gian xử lý MAVLink telemetry từ các drone simulator (SITL - Software In The Loop) và chuyển đổi sang định dạng chuẩn để gửi tới backend. Module này đóng vai trò là **adapter layer** giữa ArduPilot/PX4 simulator và hệ thống quản lý drone fleet.

**Chức năng chính:**
- Thu thập MAVLink telemetry từ SITL qua UDP
- Parse và normalize MAVLink messages
- Reduce và deduplicate telemetry data
- Publish telemetry tới backend qua message broker

## Công nghệ sử dụng

### Ngôn ngữ & Framework

- **TypeScript** (^5.2.2) - Ngôn ngữ lập trình chính
- **Node.js** - Runtime environment
- **ts-node-dev** - Hot reload cho development

### Thư viện chính

#### MAVLink Protocol

- **`node-mavlink`** (^2.3.0) - MAVLink protocol parser
  - `MavLinkPacketSplitter` - Stream splitter cho UDP packets
  - `MavLinkPacketParser` - Parser cho MAVLink messages
  - Support common + ardupilotmega dialects
  - Message registry với 300+ message types

#### Communication

- **`broker-sdk`** (local package) - Message broker SDK
  - `publishTelemetry(droneId, event)` - Publish telemetry events
  - WebSocket hoặc Redis pub/sub backend
  
- **`dgram`** - UDP socket cho nhận MAVLink từ SITL
- **`axios`** (^1.13.2) - HTTP client cho REST API calls

#### Command Line

- **`commander`** (^14.0.2) - CLI framework
  - Command parsing
  - Interactive prompts
  - Help generation

#### Logging

- **`winston`** (^3.18.3) - Production-grade logger
  - Multiple log levels
  - File rotation
  - Console và file transports

#### Utilities

- **`lodash`** (^4.17.21) - Utility functions
  - Deep cloning
  - Object manipulation
  - Debounce/throttle

## Kiến trúc

### Design Patterns

Module được thiết kế theo các patterns:

1. **Facade Pattern** - `DroneFacade`, `MissionFacade` simplify complex subsystems
2. **Command Pattern** - `CommandManager` với các command classes (TakeoffCommand, LandCommand, etc.)
3. **Adapter Pattern** - `MAVLinkAdapter`, `PX4Adapter`, `SITLAdapter` cho các loại drone khác nhau
4. **Strategy Pattern** - `AutoPilotStrategy`, `ManualControlStrategy` cho flight modes
5. **Observer Pattern** - Event-driven telemetry processing
6. **Singleton Pattern** - Các manager và state stores

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   CLI Interface                      │
│              (commander + index.ts)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                Core Facades                          │
│      DroneFacade │ MissionFacade                    │
└──────┬────────────┴──────────────────┬──────────────┘
       │                               │
┌──────▼───────────────┐     ┌─────────▼──────────────┐
│   Telemetry Layer    │     │   Command Layer        │
│  - TelemetryConsumer │     │  - CommandManager      │
│  - StateStore        │     │  - FlightController    │
│  - Reducer           │     │  - NavigationSystem    │
│  - Publisher         │     │  - MissionController   │
└──────┬───────────────┘     └────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────┐
│              Ardupilot/MAVLink Layer                 │
│  - ArdupilotTelemetryClient                          │
│  - ArdupilotTelemetryAdapter                         │
│  - MavlinkParser + Normalizers                       │
└──────┬───────────────────────────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────┐
│              Network/Protocol Layer                   │
│  - UDP Socket (dgram)                                │
│  - MAVLink Protocol (node-mavlink)                   │
│  - Message Broker (broker-sdk)                       │
└──────────────────────────────────────────────────────┘
```

## Cấu trúc thư mục chi tiết

```
src/
├── index.ts                          ← Entry point
├── cli/
│   └── index.ts                      ← CLI commands (commander)
├── core/
│   └── MissionFacade.ts              ← Mission facade
├── drone/
│   ├── DroneFacade.ts                ← Drone facade (main API)
│   ├── CommandManager.ts             ← Command execution manager
│   ├── adapters/                     ← Drone adapter implementations
│   │   ├── MAVLinkAdapter.ts         ← Generic MAVLink
│   │   ├── PX4Adapter.ts             ← PX4-specific
│   │   └── SITLAdapter.ts            ← SITL-specific
│   ├── commands/                     ← Command pattern implementations
│   │   ├── BaseCommand.ts
│   │   ├── TakeoffCommand.ts
│   │   ├── LandCommand.ts
│   │   ├── MoveCommand.ts
│   │   └── ReturnToHomeCommand.ts
│   ├── flight/                       ← Flight control subsystem
│   │   ├── FlightController.ts
│   │   ├── FlightPlan.ts
│   │   ├── NavigationSystem.ts
│   │   ├── AutoPilotStrategy.ts
│   │   └── ManualControlStrategy.ts
│   ├── mission/                      ← Mission subsystem
│   │   ├── MissionController.ts
│   │   ├── MissionPlan.ts
│   │   ├── WaypointMission.ts
│   │   ├── SurveyMission.ts
│   │   └── FormationMission.ts
│   ├── sensors/                      ← Sensor subsystem
│   │   ├── SensorManager.ts
│   │   ├── SensorData.ts
│   │   ├── GPSSensor.ts
│   │   ├── IMUSensor.ts
│   │   ├── BatterySensor.ts
│   │   ├── CameraSensor.ts
│   │   └── LidarSensor.ts
│   ├── telemetry/                    ← Telemetry subsystem
│   │   ├── TelemetryManager.ts
│   │   ├── StatusMonitor.ts
│   │   ├── HealthChecker.ts
│   │   └── LogRecorder.ts
│   ├── data/                         ← Data models
│   │   ├── DroneState.ts
│   │   ├── Position.ts
│   │   ├── Velocity.ts
│   │   └── BatteryStatus.ts
│   ├── interfaces/                   ← TypeScript interfaces
│   │   ├── DroneInterface.ts
│   │   ├── DroneAdapterInterface.ts
│   │   ├── CommandInterface.ts
│   │   ├── FlightInterface.ts
│   │   ├── MissionInterface.ts
│   │   ├── SensorInterface.ts
│   │   ├── TelemetryInterface.ts
│   │   └── SubsystemInterface.ts
│   └── utils/                        ← Utilities
│       ├── coordinate.ts
│       ├── math.ts
│       └── time.ts
├── telemetry/                        ← Telemetry processing pipeline
│   ├── TelemetryConsumer.ts          ← Entry point cho telemetry
│   ├── ardupilot/
│   │   ├── ArdupilotTelemetryClient.ts   ← Main client
│   │   ├── adapters/
│   │   │   └── ArdupilotTelemetryAdapter.ts  ← UDP + MAVLink adapter
│   │   ├── normalizers/              ← Message normalizers
│   │   │   ├── Attitude.ts           ← ATTITUDE (#30)
│   │   │   ├── Battery.ts            ← BATTERY_STATUS (#147)
│   │   │   └── GlobalPosition.ts     ← GLOBAL_POSITION_INT (#33)
│   │   └── parser/
│   │       ├── MavlinkParser.ts      ← MAVLink stream parser
│   │       └── MavlinkMessageMap.ts  ← Message ID mapping
│   ├── reducer/                      ← Telemetry reduction pipeline
│   │   ├── TelemetryReducer.ts       ← Main reducer orchestrator
│   │   ├── DeltaEvaluator.ts         ← Detect significant changes
│   │   ├── RateLimiter.ts            ← Throttle high-frequency data
│   │   ├── SliceBuilder.ts           ← Build telemetry slices
│   │   └── StateMerger.ts            ← Merge với state hiện tại
│   ├── publisher/
│   │   └── TelemetryPublisher.ts     ← Publish qua broker-sdk
│   ├── state/
│   │   └── DroneStateStore.ts        ← In-memory state store
│   └── types/
│       └── TelemetryEvent.ts         ← TypeScript types
├── mission/
│   └── service/
│       └── MissionService.ts         ← Mission API service
├── logger/
│   ├── Log.ts                        ← Logger wrapper
│   └── target/                       ← Log targets
│       ├── BaseLogTarget.ts
│       ├── ConsoleLogTarget.ts
│       └── FileLogTarget.ts
├── api/
│   ├── axios.ts                      ← Axios config
│   └── MissionEndPoint.ts            ← Mission API endpoints
└── config/
    └── settings.ts                   ← Application settings
```

## Luồng xử lý Telemetry (Chi tiết)

### 1. Thu thập MAVLink từ SITL

```typescript
// index.ts
const telemetry = new TelemetryConsumer();
telemetry.registerSimVehicle('drone1', 14555);
```

**Flow:**
```
SITL (ArduPilot)
  → UDP Port 14555
  → ArdupilotTelemetryAdapter
  → dgram.Socket.on('message')
  → MavLinkPacketSplitter
  → MavLinkPacketParser
```

### 2. Parse & Normalize MAVLink Messages

```typescript
// ArdupilotTelemetryAdapter.ts
parser.on('data', (packet) => {
  const cls = REGISTRY[packet.header.msgid];
  const msgObj = packet.protocol.data(packet.payload, cls);
  
  // Normalize based on message type
  const normalized = normalizers[msgObj.name]?.(msgObj);
  callback(normalized);
});
```

**Supported MAVLink Messages:**
- `GLOBAL_POSITION_INT` (#33) → GPS coordinates, altitude
- `ATTITUDE` (#30) → Roll, pitch, yaw
- `BATTERY_STATUS` (#147) → Battery level, voltage, current
- `HEARTBEAT` (#0) → System status, mode
- `VFR_HUD` (#74) → Speed, heading, climb rate

**Normalized Output:**
```typescript
{
  type: 'GPS' | 'ATTITUDE' | 'BATTERY',
  latitude?: number,
  longitude?: number,
  altitude_m?: number,
  heading_deg?: number,
  speed_mps?: number,
  battery_percent?: number,
  roll_deg?: number,
  pitch_deg?: number,
  yaw_deg?: number
}
```

### 3. Reduce & Deduplicate

```typescript
// TelemetryReducer.ts
reduce(event: TelemetryEvent) {
  // 1. Merge với state hiện tại
  const merged = StateMerger.merge(currentState, event);
  
  // 2. Check delta - chỉ publish nếu có thay đổi đáng kể
  const hasSignificantChange = DeltaEvaluator.evaluate(
    currentState,
    merged,
    thresholds
  );
  
  // 3. Rate limiting - tránh flood
  if (!RateLimiter.shouldSend(droneId, now)) {
    return null;
  }
  
  // 4. Build final slice
  return SliceBuilder.build(merged);
}
```

**Thresholds:**
- Position change: > 1 meter
- Heading change: > 5 degrees
- Battery change: > 1%
- Altitude change: > 0.5 meters

### 4. Publish qua Message Broker

```typescript
// TelemetryPublisher.ts
publish(event: TelemetryEvent) {
  publishTelemetry(event.drone_id, event);
}
```

**Final Event Format:**
```typescript
{
  drone_id: 'drone1',
  timestamp: 1704672345678,
  type: 'GPS',
  latitude: 21.0294498,
  longitude: 105.8544441,
  altitude_m: 15.5,
  heading_deg: 45.2,
  speed_mps: 5.3,
  battery_percent: 85,
  extra: {
    satellites: 12,
    fix_type: 3
  }
}
```

## Command Pattern - Drone Control

### Command Interface

```typescript
interface CommandInterface {
  execute(): Promise<void>;
  validate(): boolean;
  cancel(): Promise<void>;
}
```

### Command Classes

**TakeoffCommand:**
```typescript
class TakeoffCommand implements CommandInterface {
  constructor(private adapter: DroneAdapterInterface, private altitude: number) {}
  
  async execute() {
    await this.adapter.arm();
    await this.adapter.takeoff(this.altitude);
  }
}
```

**Usage via DroneFacade:**
```typescript
const drone = new DroneFacade(new SITLAdapter());
await drone.connect();
await drone.takeOff(10); // 10 meters
await drone.move({ lat: 21.03, lon: 105.85, alt: 15 });
await drone.land();
```

## Mission Types

### 1. WaypointMission
- Điểm đến cố định với tọa độ GPS
- Hành động tại mỗi waypoint (hover, take photo, etc.)
- Tốc độ và độ cao tùy chỉnh

### 2. SurveyMission
- Grid pattern scanning
- Overlap percentage
- Camera trigger points

### 3. FormationMission
- Multi-drone coordination
- Relative positioning
- Collision avoidance

## Integration với hệ thống

### 1. SITL (ArduPilot Simulator)

**Khởi động SITL:**
```bash
# Start ArduPilot SITL with MAVLink output on port 14555
sim_vehicle.py --out=udp:127.0.0.1:14555
```

**Orchestrator connects:**
```typescript
telemetry.registerSimVehicle('drone1', 14555);
```

### 2. Message Broker (broker-sdk)

**Publish telemetry:**
```typescript
publishTelemetry(droneId, event);
```

**Backend subscribes:**
```typescript
// In drone-fleet-management-api
subscribeTelemetry('drone1', (event) => {
  gateway.emit('drone:location_updated', event);
});
```

### 3. WebSocket Gateway

**Flow:**
```
Orchestrator → broker-sdk → Backend Gateway → WebSocket → Admin Web
```

## Yêu cầu hệ thống

- **Node.js:** >= 16.x
- **TypeScript:** ^5.2.2
- **ArduPilot SITL:** Latest (for testing)
- **broker-sdk:** Local package (sibling directory)

## Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "start": "node dist/index.js",
  "build": "tsc",
  "lint": "eslint \"{src,apps,libs,test}/**/*.{ts,tsx,js}\" --max-warnings=0",
  "lint:fix": "eslint --fix",
  "format": "prettier --write"
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build broker-sdk (if not built)
cd ../broker-sdk && npm run build && cd ../drone-fleet-management-orchestrator

# Development mode với hot reload
npm run dev
```

### Testing với SITL

```bash
# Terminal 1: Start SITL
cd ~/ardupilot/ArduCopter
sim_vehicle.py --console --map --out=udp:127.0.0.1:14555

# Terminal 2: Run orchestrator
npm run dev

# Terminal 3: Send commands via MAVProxy
arm throttle
takeoff 10
```

## Configuration

### settings.ts

```typescript
export const settings = {
  sitl: {
    host: '127.0.0.1',
    port: 14555
  },
  telemetry: {
    rateLimitMs: 1000,  // Max 1 message/second
    deltaThresholds: {
      position: 1.0,     // meters
      heading: 5.0,      // degrees
      battery: 1.0       // percent
    }
  },
  broker: {
    type: 'websocket',   // or 'redis'
    url: 'ws://localhost:3000/drone'
  }
}
```

## Logging

Winston logger với multiple transports:

```typescript
// Console output
logger.info('Telemetry received', { droneId, type: 'GPS' });

// File output
combined.log   ← All logs
error.log      ← Error only
```

**Log Levels:**
- `error` - Errors cần investigate
- `warn` - Warnings (connection lost, retry, etc.)
- `info` - Important events (connection, mission start/end)
- `debug` - Chi tiết telemetry (có thể tắt trong production)

## Production Deployment

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

**Build & Run:**
```bash
docker build -t drone-orchestrator .
docker run -p 14555:14555/udp drone-orchestrator
```

### Environment Variables

```bash
SITL_HOST=127.0.0.1
SITL_PORT=14555
BROKER_URL=ws://backend:3000/drone
LOG_LEVEL=info
```

## Troubleshooting

### SITL không gửi telemetry

**Check:**
1. SITL đang chạy với `--out=udp:127.0.0.1:14555`
2. Port 14555 không bị firewall block
3. Orchestrator đang listen đúng port

**Debug:**
```bash
# Listen trực tiếp UDP
nc -u -l 14555
# Should see binary MAVLink data
```

### Telemetry không publish

**Check:**
1. broker-sdk installed và working
2. Backend đang chạy và accept connections
3. Check logs: `tail -f combined.log`

### High CPU usage

**Giảm load:**
- Tăng `rateLimitMs` (giảm tần suất publish)
- Tăng delta thresholds (ít changes được detect)
- Disable debug logging

## Kiến trúc tương lai (Roadmap)

### Phase 1: Hiện tại (SITL Support)
- ✅ MAVLink parsing
- ✅ Telemetry reduction
- ✅ Broker integration
- ⚠️ Basic command support (trong development)

### Phase 2: Real Drone Support
- 🔄 DJI adapter (integrate với DJI SDK)
- 🔄 PX4 real hardware adapter
- 🔄 Multiple drone coordination

### Phase 3: Advanced Features
- Mission planning optimization
- Collision avoidance
- Battery optimization routing
- Weather integration

## Tài liệu tham khảo

### MAVLink Protocol
- **MAVLink Guide:** https://mavlink.io/en/
- **Message Definitions:** https://mavlink.io/en/messages/common.html
- **node-mavlink:** https://github.com/padcom/node-mavlink

### ArduPilot
- **SITL Setup:** https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html
- **MAVLink Commands:** https://ardupilot.org/copter/docs/common-mavlink-mission-command-messages-mav_cmd.html

