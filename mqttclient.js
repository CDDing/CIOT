const mqtt=require('mqtt')
const client=mqtt.connect('mqtt://localhost:1883')

setInterval(
    ()=>{
        client.publish('test','Hello Dsssadsasdasdasdng');
    },
    2000
);
