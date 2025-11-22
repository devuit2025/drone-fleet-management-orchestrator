import { MissionService } from '../mission/service/MissionService';
import { Log } from '../logger/Log';

export class MissionFacade {
    private service: MissionService;
    private missions: any[] = [];

    constructor() {
        this.service = new MissionService();
    }

    async refreshMissions() {
        try {
            this.missions = await this.service.getAllMissions();
            Log.info(`Fetched ${this.missions.length} missions from API`);
        } catch (err: any) {
            Log.error('Failed to refresh missions', { error: err });
        }
    }

    getAllMissions() {
        return this.missions;
    }
}
