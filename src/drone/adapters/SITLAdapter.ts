import { Log } from '../../logger/Log';
import { DroneAdapterInterface } from '../interfaces/DroneAdapterInterface';
import dgram from 'dgram';

export class SITLAdapter implements DroneAdapterInterface {
    private client: dgram.Socket;
    private host = '127.0.0.1';
    private port = 14550;
    private timeout = 5000; // ms to wait for first message

    constructor() {
        this.client = dgram.createSocket('udp4');
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            Log.info('Connecting to ArduPilot SITL...', { context: 'SITLAdapter' });

            let resolved = false;

            // Bind to receive UDP messages
            this.client.bind(() => {
                Log.info('UDP client bound, waiting for first telemetry...', {
                    context: 'SITLAdapter',
                });
            });

            // Wait for the first message (heartbeat/telemetry)
            const onMessage = (msg: Buffer) => {
                if (!resolved) {
                    resolved = true;
                    this.client.removeListener('message', onMessage);
                    Log.info('Received first telemetry, connection established', {
                        context: 'SITLAdapter',
                    });
                    resolve();
                }
            };

            this.client.on('message', onMessage);

            // Timeout if no message received
            setTimeout(() => {
                if (!resolved) {
                    this.client.removeListener('message', onMessage);
                    Log.error('Connection to SITL failed: no telemetry received', {
                        context: 'SITLAdapter',
                    });
                    reject(new Error('SITL connection failed: no telemetry received'));
                }
            }, this.timeout);
        });
    }

    async disconnect(): Promise<void> {
        this.client.close();
        console.log('Disconnected from SITL.');
    }

    async sendCommand(command: string, params?: any): Promise<void> {
        console.log(`Sending command: ${command}`, params || '');
        // For now, just log. Later, map to MAVLink messages.
    }

    async readTelemetry(): Promise<any> {
        return new Promise(resolve => {
            this.client.once('message', msg => {
                resolve(msg.toString());
            });
        });
    }
}
