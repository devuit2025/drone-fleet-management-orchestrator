import { MSG_ID } from "../../telemetry/ardupilot/parser/MavlinkMessageMap";

/**
 * 1000 equal to 1s
 */
const RATE_LIMIT_MS: Record<string, number> = {
    [MSG_ID.GLOBAL_POSITION_INT]: 2000,
};

export class RateLimiter {
    allow(state: any, msgId: number, now: number): boolean {
        const limit = RATE_LIMIT_MS[msgId];
      
        if (!limit) return true;

        const last = state.lastEmitTs[msgId] ?? 0;
        return now - last >= limit;
    }

    commit(state: any, msgId: number, now: number): void {
        state.lastEmitTs[msgId] = now;
    }
}
