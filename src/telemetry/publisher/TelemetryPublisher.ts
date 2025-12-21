import { MSG_ID } from 'telemetry/ardupilot/parser/MavlinkMessageMap';
import { TelemetryEvent } from '../types/TelemetryEvent';
import { publishTelemetry } from 'broker-sdk';

export class TelemetryPublisher {
    publish(event: TelemetryEvent) {
        publishTelemetry(event.drone_id, event);
    }
}
