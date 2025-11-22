import axios from 'axios';
import { SETTINGS } from '../config/settings';

export const apiClient = axios.create({
    baseURL: SETTINGS.missionApiUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: interceptors for logging or auth
apiClient.interceptors.request.use((config: any) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

apiClient.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        console.error('[API Error]', error.message);
        return Promise.reject(error);
    },
);
