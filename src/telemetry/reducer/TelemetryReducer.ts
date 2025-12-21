import { TelemetryEvent } from '../types/TelemetryEvent';
import { DroneStateStore } from '../state/DroneStateStore';
import { StateMerger } from './StateMerger';
import { DeltaEvaluator } from './DeltaEvaluator';
import { RateLimiter } from './RateLimiter';
import { SliceBuilder } from './SliceBuilder';


export class TelemetryReducer {
    constructor(
        private readonly stateStore: DroneStateStore,
        private readonly merger = new StateMerger(),
        private readonly rateLimiter = new RateLimiter(),
        private readonly deltaEvaluator = new DeltaEvaluator(),
        private readonly sliceBuilder = new SliceBuilder(),
    ) {}

    reduce(event: TelemetryEvent): TelemetryEvent | null {
        const state = this.stateStore.get(event.drone_id);
       
        this.merger.merge(state, event);
 
        if (!this.rateLimiter.allow(state, event.msg_id, event.timestamp)) {
            return null;
        }
        
        /**
         * Temporary disable this
         */
        // if (!this.deltaEvaluator.changed(state, event)) {
        //     return null;
        // }

        this.rateLimiter.commit(state, event.msg_id, event.timestamp);
       
        return this.sliceBuilder.build(event, state, event.timestamp);
    }
}
