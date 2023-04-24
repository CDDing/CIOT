const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1883;

server.listen(port, function () {
  console.log(`MQTT broker started and listening on port ${port}`);
});

aedes.on('subscribe', function (subscriptions, client) {
  console.log(`Client ${client} subscribed to topics: ${JSON.stringify(subscriptions)}`);
});

aedes.on('publish', function (packet, client) {
  console.log(`Received message from client ${client}: ${packet.payload.toString()}`);
});