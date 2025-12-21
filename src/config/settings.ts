export const SETTINGS = {
    missionApiUrl: 'http://api.dronefleet/',
};

export const RATE_LIMITS = {
    GPS: 1000, // 1s
    ATTITUDE: 200, // 5 Hz
    BATTERY: 5000, // 5s
    STATUS: 0, // only on change
};
