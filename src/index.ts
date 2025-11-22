import { MissionFacade } from './core/MissionFacade';
import { Log } from './logger/Log';

async function main() {
    // Initialize the mission subsystem
    const missionFacade = new MissionFacade();
    console.log(process.env.NODE_ENV)

    Log.info('Orchestrator starting...');

    try {
        // Fetch missions from the API
        await missionFacade.refreshMissions();
        
    } catch (error) {
        console.log(error)
    }

    // Access all missions in memory
    const missions = missionFacade.getAllMissions();
    console.log('Fetched Missions:', missions);
}

main().catch(err => {
    Log.error('Orchestrator failed to start', { error: err });
    process.exit(1);
});
