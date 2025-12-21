import { TelemetryEvent } from '../types/TelemetryEvent';

export class SliceBuilder {
    build(event: TelemetryEvent, state: any, now: number): TelemetryEvent {
        return {
            /** Adjust between state and final output if needed */
            ...event
        };
    }
}
