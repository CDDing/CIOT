const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const fs = require('fs');
const cors = require('cors');

var stress_level = 0 // 0 ~ 4;

var responsed_data = [];

var user_age = 25;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Fitbit API</a>');
});

app.listen(3000, () => {
    console.log('click here to start http://127.0.0.1:3000/auth\n');

    //console.log('test json http://127.0.0.1:3000/getdata?request_json=' + test_heart_rate_now + "\n");
});

function calc_stress() {
    //console.log("heart rate time : " + responsed_data[0]['activities-heart-intraday']['dataset'][0]['time']);
    //console.log("heart rate value : " + responsed_data[0]['activities-heart-intraday']['dataset'][0]['value']);

    //console.log("hrv : " + responsed_data[1]);
    //console.log("br : " + responsed_data[2]);
    //console.log("spo2 : " + responsed_data[3]);

    var heart_rate = responsed_data[0]['activities-heart-intraday']['dataset'][0]['value'];

    var max_hr = 220 - user_age;

    if(heart_rate < (max_hr * 0.4)) {
        stress_level = 0;
    }
    else if(heart_rate < (max_hr * 0.5)) {
        stress_level = 1;
    }
    else if(heart_rate < (max_hr * 0.6)) {
        stress_level = 2;
    }
    else if(heart_rate < (max_hr * 0.7)) {
        stress_level = 3;
    }
    else {
        stress_level = 4;
    }

    console.log(stress_level);

    download_heart_rate();
    modify_array_data(today_full, today_time1, responsed_data[0]['activities-heart-intraday']['dataset'][0]['value'], stress_level);
    upload_heart_rate();
}

//get_json();
setInterval(get_json, 60000);

setInterval(calc_stress, 60000);

function mqtt_publish() {
    mqtt_client.publish('stress_level', stress_level.toString());
}

setInterval(mqtt_publish, 3000);

setTimeout(() => {
    //calc_stress();
}, 3000);
