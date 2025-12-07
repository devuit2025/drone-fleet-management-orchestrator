export class AttitudeNormalizer {
  normalize(payload: any) {
    return {
      type: "attitude",
      roll: payload.roll,
      pitch: payload.pitch,
      yaw: payload.yaw,
      rollspeed: payload.rollspeed,
      pitchspeed: payload.pitchspeed,
      yawspeed: payload.yawspeed,
    };
  }
}
