const express = require("express");
const web_app = express();

const mqtt=require('mqtt')
const aedes = require('aedes')();
const mqtt_server = require('net').createServer(aedes.handle);

const port_web = 3000;
const port_mqtt = 1883;

const mqtt_client=mqtt.connect('mqtt://localhost:' + port_mqtt)

const url_main = 'http://127.0.0.1:' + port_web
const url_authorize = url_main + '/authorize'
const url_callback = url_main + '/callback'

// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const fitbit_client = new FitbitApiClient({
    clientId: "23QZCX",
    clientSecret: "f8938cd6e8acd15e6fbc4fc34fbdbcd0",
    apiVersion: '1.2' // 1.2 is the default
});

var mqtt_topic = 'test'
var interval_time = 2000

var date_start = '2023-04-29'; //can use    yyyy-MM-dd or today.
var date_end = '2023-04-30';
var period_spec = '1d' //can use            1d | 7d | 30d | 1w | 1m
var detail_level = '1sec' //can use         1sec | 1min | 5min | 15min

var get_heart_rate_time_series_by_date = "/activities/heart/date/" + date_start + '/' + period_spec + ".json"
var get_heart_rate_time_series_by_date_range = "/activities/heart/date/" + date_start + '/' + date_end + ".json"
var get_hrv_summary_by_interval = "/hrv/date/" + date_start + '/' + date_end + ".json"

var get_heart_rate_intraday_by_interval = "/activities/heart/date/" + date_start + '/' + date_end + '/' + detail_level + ".json" //https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/
var get_hrv_intraday_by_interval = "/hrv/date/" + date_start + '/' + date_end + "/all.json" //https://dev.fitbit.com/build/reference/web-api/intraday/get-hrv-intraday-by-interval
var get_breathing_rate_intraday_by_interval = "/br/date/" + date_start + '/' + date_end + "/all.json" //https://dev.fitbit.com/build/reference/web-api/intraday/get-br-intraday-by-interval/
var get_spo2_intraday_by_interval = "/spo2/date/" + date_start + '/' + date_end + "/all.json" //https://dev.fitbit.com/build/reference/web-api/intraday/get-spo2-intraday-by-interval/

var target_json = get_breathing_rate_intraday_by_interval; //select and change json to get it.

function mqtt_publishing() {
    mqtt_client.publish(mqtt_topic,'Hello Dsssadsasdasdasdng');
}

// redirect the user to the Fitbit authorization page
// 127.0.0.1:3001/authorize
web_app.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(fitbit_client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', url_callback));
});

// handle the callback from the Fitbit authorization flow
web_app.get("/callback", (req, res) => {
    // exchange the authorization code we just received for an access token
    fitbit_client.getAccessToken(req.query.code, url_callback).then(result => {
        // use the access token to fetch the user's profile information
        fitbit_client.get(target_json, result.access_token).then(results => {
            res.send(results[0]);

            //console.log(results[0][gender][....]);
            //edit here to do something.

        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

// launch the server
web_app.listen(port_web, () => {
    //console.log('server running at ' + url_authorize);
    console.log('click ' + url_authorize + ' to authorize');
    //console.log('callback url : ' + url_callback);
});


//////////////////////////////
//          mqtt            //
//////////////////////////////


mqtt_server.listen(port_mqtt, function () {
    console.log(`MQTT broker started and listening on port ${port_mqtt}`);
});
  
aedes.on('subscribe', function (subscriptions, target_client) {
    console.log(`Client ${target_client} subscribed to topics: ${JSON.stringify(subscriptions)}`);
});
  
aedes.on('publish', function (packet, target_client) {
    //console.log(`Received message from client ${target_client}: ${packet.payload.toString()}`);
});

setInterval(mqtt_publishing, interval_time);