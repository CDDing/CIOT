const aedes = require('aedes')();
const mqtt_server = require('net').createServer(aedes.handle);
const port_mqtt = 1883;

mqtt_server.listen(port_mqtt, function () {
  console.log(`MQTT broker started and listening on port ${port_mqtt}`);
});

aedes.on('subscribe', function (subscriptions, client) {
  console.log(`Client ${client} subscribed to topics: ${JSON.stringify(subscriptions)}`);
});

aedes.on('publish', function (packet, client) {
  console.log(`Received message from client ${client}: ${packet.payload.toString()}`);
});