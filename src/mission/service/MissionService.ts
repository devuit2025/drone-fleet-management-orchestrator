import { MissionEndPoint } from '../../api/MissionEndPoint';

export class MissionService {
    private endpoint: MissionEndPoint;

    constructor() {
        this.endpoint = new MissionEndPoint();
    }

    // Fetch and convert raw API data to orchestrator format
    async getAllMissions(): Promise<any | void[]> {
        const rawMissions = await this.endpoint.fetchAllMissions();
        console.log(rawMissions);
        // // Convert raw response to internal MissionPlan format
        // return rawMissions.map((m) => ({
        //   id: m.id,
        //   name: m.name,
        //   waypoints: m.waypoints.map((wp) => ({
        //     lat: wp.lat,
        //     lon: wp.lon,
        //     alt: wp.alt,
        //   })),
        //   type: m.type,
        // }));
    }

    //   async getMissionById(id: string): Promise<MissionPlan> {
    //     const m = await this.endpoint.fetchMissionById(id);
    //     return {
    //       id: m.id,
    //       name: m.name,
    //       waypoints: m.waypoints.map((wp) => ({
    //         lat: wp.lat,
    //         lon: wp.lon,
    //         alt: wp.alt,
    //       })),
    //       type: m.type,
    //     };
    //   }
}
