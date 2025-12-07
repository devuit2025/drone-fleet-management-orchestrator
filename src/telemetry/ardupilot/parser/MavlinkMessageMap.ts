// telemetry/ardupilot/parser/MavlinkMessageMap.ts
import { GlobalPositionNormalizer } from "../normalizers/GlobalPosition";
import { AttitudeNormalizer } from "../normalizers/Attitude";
import { BatteryNormalizer } from "../normalizers/Battery";

export const MSG_ID = {
  GLOBAL_POSITION_INT: 33,
  HEARTBEAT: 0,
  ATTITUDE: 30,
  BATTERY_STATUS: 147,
  VFR_HUD: 74,
  // ...add any others you need
};

export const MESSAGE_NORMALIZERS: Record<string, any> = {
  [MSG_ID.GLOBAL_POSITION_INT]: new GlobalPositionNormalizer(),
//   [MSG_ID.ATTITUDE]: new AttitudeNormalizer(),
//   [MSG_ID.GLOBAL_POSITION_INT]: new BatteryNormalizer(),
};
