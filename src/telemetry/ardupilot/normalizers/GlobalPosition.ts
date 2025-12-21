export class GlobalPositionNormalizer {
    normalize(payload: any) {
        const speed_mps = Math.sqrt(
            Math.pow(payload.vx ?? 0, 2) +
            Math.pow(payload.vy ?? 0, 2) +
            Math.pow(payload.vz ?? 0, 2)
        );

        return {
            lat: payload.lat / 1e7,
            lng: payload.lon / 1e7,
            altitude_m: payload.alt / 1000,
            speed_mps,
            heading_deg: payload.hdg / 100,

            extra: {
                relative_altitude_m: payload.relativeAlt / 1000,
                vx: payload.vx,
                vy: payload.vy,
                vz: payload.vz,
            },
        };
    }

}
