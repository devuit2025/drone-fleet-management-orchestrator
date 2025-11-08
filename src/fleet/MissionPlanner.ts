import { Mission } from "../types";
import { FleetManager } from "./FleetManager";

export class MissionPlanner {
    constructor(private fleet: FleetManager) {}

    scheduleMission(droneId: string, mission: Mission) {
        console.log(`[MissionPlanner] Scheduling mission ${mission.id} for ${droneId}`);
        this.fleet.assignMission(droneId, mission);
    }
}
