import dgram from 'dgram';
import { MavLinkPacketSplitter, MavLinkPacketParser, common, ardupilotmega } from 'node-mavlink';

// Combine registries from common and ArduPilotMega dialect
const REGISTRY = {
  ...common.REGISTRY,
  ...ardupilotmega.REGISTRY
};

// UDP socket to listen for SITL telemetry
const socket = dgram.createSocket('udp4');

// MAVLink stream parser
const splitter = new MavLinkPacketSplitter();
const parser = new MavLinkPacketParser();

// Pipe the splitter into the parser
splitter.pipe(parser);

function safeJson(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

// Handle parsed MAVLink packets
parser.on('data', (packet) => {
  const cls = REGISTRY[packet.header.msgid];
  if (!cls) return; // unknown message

  const msgObj = packet.protocol.data(packet.payload, cls);
  
  // Convert to JSON and print
  console.log(safeJson({
    name: cls.name,
    ...msgObj
  }, null, 2));
});

// Feed UDP messages into the splitter
socket.on('message', (msg) => splitter.write(msg));

socket.bind(14550, '127.0.0.1', () => {
  console.log('Listening for MAVLink telemetry from SITL on udp://127.0.0.1:14550');
});
