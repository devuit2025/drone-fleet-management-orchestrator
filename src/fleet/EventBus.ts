import { EventEmitter } from "events";

export class EventBus extends EventEmitter {
    // Singleton for internal communication
    private static instance: EventBus;
    private constructor() { super(); }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
}
