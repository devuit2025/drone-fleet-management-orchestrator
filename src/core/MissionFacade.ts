import { MissionService } from '../mission/service/MissionService';
import { Log } from '../logger/Log';

export class MissionFacade {
    private service: MissionService;
    private missions: any[] = [];

    constructor() {
        this.service = new MissionService();
    }

    getAllMissions() {
        return this.service.getAllMissions();
    }
}
