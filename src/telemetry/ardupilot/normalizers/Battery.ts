export class BatteryNormalizer {
    normalize(payload: any) {
        return {
            type: 'battery',
            voltages: payload.voltages.map((v: number) => v / 1000), // volts
            current: payload.currentBattery / 100, // amps (if scaling needed)
            remaining: payload.batteryRemaining,
            chargeState: payload.chargeState,
        };
    }
}
