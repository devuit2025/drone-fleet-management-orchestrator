import { SITLAdapter } from './drone/adapters/SITLAdapter';
import { DroneFacade } from './drone/DroneFacade';
import { Log } from './logger/Log';

async function main() {
    const adapter = new SITLAdapter();
    const drone = new DroneFacade(adapter);

    // try {
    //     Log.info('Starting drone simulation', { context: 'Main' });

    //     await drone.connect();
    //     Log.info('Drone connected', { context: 'DroneFacade' });

    //     await drone.takeoff(10);
    //     Log.info('Drone takeoff executed', { context: 'DroneFacade' });

    //     await drone.disconnect();
    //     Log.info('Drone disconnected', { context: 'DroneFacade' });
    // } catch (err: any) {
    //     Log.error('Unexpected error in drone flow', { context: 'Main', error: err });
    // }
}

main();
