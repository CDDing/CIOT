const mqtt=require('mqtt')
const client=mqtt.connect('mqtt://localhost:1883')

client.subscribe('test')

client.on('message', function(topic, message){
    console.log(`토픽: ${topic.toString()}, 메시지: ${message.toString()}`);
});