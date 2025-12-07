export class GlobalPositionNormalizer {
  normalize(payload: any) {
    return {
      type: "global_position",
      lat: payload.lat / 1e7,
      lng: payload.lon / 1e7,
      alt: payload.alt / 1000, // meters
      relativeAlt: payload.relativeAlt / 1000,
      vx: payload.vx,
      vy: payload.vy,
      vz: payload.vz,
      heading: payload.hdg,
    };
  }
}