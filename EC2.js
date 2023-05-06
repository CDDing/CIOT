const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const Request = require('request');

const aedes = require('aedes')();
const mqtt_server = require('net').createServer(aedes.handle);
const mqtt = require('mqtt')
const mqtt_client = mqtt.connect('mqtt://localhost:1883')

const fs = require('fs');
const cors = require('cors');
const callbackUrl = 'http://127.0.0.1:3000/callback';
const getURL = `https://api.fitbit.com/1.2/user/-/`;

const clientID = '23QZCX'
const clientSecret = 'aa1368dd0f04cb0c738a83d9abf7e805'

const axios = require('axios')

var stress_level = 0 // 0 ~ 4;

var responsed_data = [];

var user_age = 25;

//var today = new Date(2022, 9, 3, 9, 9, 0); //sample
var today = new Date();

var today_full = today.getFullYear() + '-' + ((today.getMonth() < 9) ? '0' + (today.getMonth() + 1) : "" + (today.getMonth() + 1)) + '-' + ((today.getDate() < 10) ? '0' + today.getDate() : "" + today.getDate());
var today_hour = (today.getHours() < 10) ? '0' + today.getHours() : "" + today.getHours();
var today_min = (today.getMinutes() < 10) ? '0' + today.getMinutes() : "" + today.getMinutes();
var today_min_next = (today.getMinutes() + 1 < 10) ? '0' + (today.getMinutes() + 1) : "" + (today.getMinutes() + 1);
var today_time1 = today_hour + ":" + today_min;
var today_time2 = today_hour + ":" + today_min_next;

var detail_level = '1sec' //can use    1sec | 1min | 5min | 15min  string

var heart_rate_now = "/activities/heart/date/" + today_full + '/' + today_full + '/' + detail_level + '/time/' + today_time1 + '/' + today_time2 + ".json"; //https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/
var hrv_now = "/hrv/date/today/today/all.json";
var br_now = "/br/date/today/today/all.json";
var spo2_now = "/spo2/date/today/today/all.json";

var test_heart_rate_now = "/activities/heart/date/2023-05-04/2023-05-04/" + detail_level + '/time/13:40/13:41.json';
//var test_heart_rate_now = "/activities/heart/date/" + today_full + '/' + today_full + '/' + detail_level + '/time/13:40/13:41.json';

//var request_json_list = [heart_rate_now, hrv_now, br_now, spo2_now];

var request_json_list = [test_heart_rate_now];

var active_element = false;
function set_time_now(act) {
    if(act) {
        today = new Date();

        today_full = today.getFullYear() + '-' + ((today.getMonth() < 9) ? '0' + (today.getMonth() + 1) : "" + (today.getMonth() + 1)) + '-' + ((today.getDate() < 10) ? '0' + today.getDate() : "" + today.getDate());
        today_hour = (today.getHours() < 10) ? '0' + today.getHours() : "" + today.getHours();
        today_min = (today.getMinutes() < 10) ? '0' + today.getMinutes() : "" + today.getMinutes();
        today_min_next = (today.getMinutes() + 1 < 10) ? '0' + (today.getMinutes() + 1) : "" + (today.getMinutes() + 1);
        today_time1 = today_hour + ":" + today_min;
        today_time2 = today_hour + ":" + today_min_next;

        detail_level = '1sec' //can use    1sec | 1min | 5min | 15min  string

        heart_rate_now = "/activities/heart/date/" + today_full + '/' + today_full + '/' + detail_level + '/time/' + today_time1 + '/' + today_time2 + ".json"; //https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/
        hrv_now = "/hrv/date/today/today/all.json";
        br_now = "/br/date/today/today/all.json";
        spo2_now = "/spo2/date/today/today/all.json";

        request_json_list = [test_heart_rate_now];
        
        //request_json_list = [heart_rate_now, hrv_now, br_now, spo2_now];

    }
}

var publish_comment = "";
var subscribe_comment = "";
const client = new AuthorizationCode({
    client: {
        id: clientID,
        secret: clientSecret,
    },
    auth: {
        tokenHost: 'https://api.fitbit.com/',
        tokenPath: 'oauth2/token',
        authorizeHost: 'https://api.fitbit.com/',
        authorizePath: 'oauth2/authorize',
        revokePath: 'oauth2/revoke'
    },
});

const authorizationUri = client.authorizeURL({
    scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature weight',
    redirect_uri: callbackUrl,
}).replace('api', 'www');

app.use(cors());
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
        code,
        redirect_uri: callbackUrl,
    };
    try {
        const accessToken = await client.getToken(options);
        fs.writeFile('AccessToken.json', JSON.stringify(accessToken.token), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Get AccessToken');
        })
        console.log('The resulting token: ', accessToken);
        return res.status(200).json(accessToken.token);
    } catch (error) {
        console.error('Acess Token Error', error.message);
        return res.status(500).json('Authentication failed');
    }
});

app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Fitbit API</a>');
});
app.get('/getdata', (req, res) => {
    fs.readFile('AccessToken.json', 'utf-8', function (err, data) {
        const accessToken = JSON.parse(data);
        console.log(req.query.request_json);
        var getdata = new Promise((resolve, reject) => {
            Request({
                url: getURL + req.query.request_json,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + accessToken.access_token
                },
                json: true
            }, (error, response, body) => {
                if (error) {
                    console.log(req.query.request_json + 'Request Error');
                    reject(error);
                } else {
                    console.log(req.query.request_json + 'Request Success');
                    resolve([
                        body,
                        response
                    ]);
                }
            });
        }).then(results => {
            res.send(results[0]);
            console.log(req.query.request_json + 'Request Sent');
        });

    });
})
app.get('/refresh', (req, res) => {
    fs.readFile('AccessToken.json', 'utf-8', function (err, data) {
        const Token = JSON.parse(data);
        var refresh_token = Token.refresh_token;
        var Option = {
            url: 'https://api.fitbit.com/oauth2/token',
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }
        };
        Request(Option, function (error, response, body) {
            if (error) throw new Error(error);
            fs.writeFile('AccessToken.json', JSON.stringify(body), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Get AccessToken');
            })
            res.send(body);
        });

    });
})
app.listen(3000, () => {
    console.log('click here to start http://127.0.0.1:3000/auth');
    console.log('test json http://127.0.0.1:3000/getdata?request_json=activities/heart/date/2023-05-01/2023-05-01/1sec/time/10:10/10:12.json');
    console.log('test json http://127.0.0.1:3000/getdata?request_json=hrv/date/2023-05-01/all.json');
    console.log('test json http://127.0.0.1:3000/getdata?request_json=sleep/date/2023-05-01.json');
});
app.get('/getpublish', (req, res) => {
    res.send(publish_comment);
});
app.get('/getrealtime', (req, res) => {
    var requestURL = 'https://api.fitbit.com/1.2/user/-/';

    set_time_now(active_element);

    var promises = [];
    //var responsed_data = [];
    fs.readFile('AccessToken.json', 'utf-8', function (err, data) {
        const accessToken = JSON.parse(data);
        for (var i of request_json_list) {
            //console.log(requestURL + i);
            var getdata = new Promise((resolve, reject) => {
                Request({
                    url: requestURL + i,
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + accessToken.access_token
                    },
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve([
                            body,
                            response
                        ]);
                    }
                });
            }).then(results => {
                responsed_data.push(results[0]);
            });
            promises.push(getdata);
        }

        Promise.all(promises).then((results) => {
            res.send(responsed_data);
        }).catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
    });
});

const port_mqtt = 1883;

mqtt_server.listen(port_mqtt, function () {
    console.log(`MQTT broker started and listening on port ${port_mqtt}`);
});

aedes.on('subscribe', function (subscriptions, client) {
    console.log(`Client ${client} subscribed to topics: ${JSON.stringify(subscriptions)}`);
    subscribe_comment = subscribe_comment + JSON.stringify(subscriptions) + "\n";
});

aedes.on('publish', function (packet, client) {
    console.log(`Received message from client ${client}: ${packet.payload.toString()}`);
    publish_comment = publish_comment + packet.payload.toString() + "\n";
});

function get_json() {
    axios.get("http://127.0.0.1:3000/getrealtime");
}

function calc_stress() {
    console.log("heart rate time : " + responsed_data[0]['activities-heart-intraday']['dataset'][0]['time']);
    console.log("heart rate value : " + responsed_data[0]['activities-heart-intraday']['dataset'][0]['value']);

    console.log("hrv : " + responsed_data[1]);
    console.log("br : " + responsed_data[2]);
    console.log("spo2 : " + responsed_data[3]);

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
}

get_json();
setInterval(get_json, 60000);

setInterval(calc_stress, 6000);

function mqtt_publish() {
    mqtt_client.publish('stress_level', stress_level.toString());
}

setInterval(mqtt_publish, 3000);