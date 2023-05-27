const mqtt=require('mqtt');
const client=mqtt.connect('mqtt://localhost:1883');
const client_ec2=mqtt.connect('mqtt://13.236.207.60:1883');

client.subscribe('stress_level')

client.on('message', function(topic, message){
    //console.log(`토픽: ${topic.toString()}, 메시지: ${message.toString()}`);

    var str_lv = message.toString();

    switch (str_lv) {
        case '0':
            console.log('stress level : 0');
            break;
        case '1':
            console.log('stress level : 1');
            break;
        case '2':
            console.log('stress level : 2');
            break;
        case '3':
            console.log('stress level : 3');
            break;
        case '4':
            console.log('stress level : 4');
            break;
        default:
            console.log('unknown error occured');
            break;
    }    
});