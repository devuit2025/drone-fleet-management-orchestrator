const dgram = require("dgram");
const socket = dgram.createSocket("udp4");

socket.bind(14555, () => {
  console.log("Listening on Windows...");
});

socket.on("message", msg => {
  console.log("MAVLink:", msg);
});