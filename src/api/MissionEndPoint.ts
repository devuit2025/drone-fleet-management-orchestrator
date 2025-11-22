import { apiClient } from './axios';

export class MissionEndPoint {
    async fetchAllMissions(): Promise<any[]> {
        const response = await apiClient.get('/api/v1/missions');
        return response.data;
    }

    async fetchMissionById(id: string): Promise<any> {
        const response = await apiClient.get(`/api/v1/missions/${id}`);
        return response.data;
    }
}
