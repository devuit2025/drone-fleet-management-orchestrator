// telemetry/ardupilot/parser/MavlinkParser.ts
import dgram from 'dgram';
import {
    MavLinkPacketSplitter,
    MavLinkPacketParser,
    minimal,
    common,
    standard,
    ardupilotmega,
    MavLinkPacketRegistry,
} from 'node-mavlink';

export type DecodedMavlink = {
    msgName: string;
    msgId: number;
    payload: any;
};

export class MavlinkParser {
    private registry: MavLinkPacketRegistry = {
        ...minimal.REGISTRY,
        ...common.REGISTRY,
        ...ardupilotmega.REGISTRY,
    };

    private splitter = new MavLinkPacketSplitter();
    private parser = new MavLinkPacketParser();

    constructor(private udpPort: number) {}

    start(onDecoded: (msg: DecodedMavlink) => void) {
        const socket = dgram.createSocket('udp4');

        // Pipe the splitter into the parser
        this.splitter.pipe(this.parser);

        socket.bind(this.udpPort);

        console.log(`[MavlinkParser] Listening on UDP ${this.udpPort}`);

        socket.on('message', msg => {
            // Feed UDP messages into the splitter
            // console.log('socket on:', msg)
            this.splitter.write(msg);
        });

        // Handle parsed MAVLink packets
        this.parser.on('data', packet => {
            const msgClass = this.registry[packet.header.msgid];
            if (!msgClass) {
                console.log('Parser: unknow message registry', packet.header.msgid);
                return;
            }

            const payload = packet.protocol.data(packet.payload, msgClass);

            // console.log('Received packet:', data)

            // Convert to JSON and print
            onDecoded({
                msgName: msgClass.name,
                msgId: packet.header.msgid,
                payload,
            });
        });
    }
}
