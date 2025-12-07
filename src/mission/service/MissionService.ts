import { MissionEndPoint } from '../../api/MissionEndPoint';

export class MissionService {
    private endpoint: MissionEndPoint;

    constructor() {
        this.endpoint = new MissionEndPoint();
    }

    // Fetch and convert raw API data to orchestrator format
    async getAllMissions(): Promise<any | void[]> {
        return await this.endpoint.fetchAllMissions();
    }
}
