// initialize the express application
const express = require("express");
const web_app = express();

const port_web = 3000;

var prs;

const aedes = require('aedes')();
const mqtt_server = require('net').createServer(aedes.handle);
const port_mqtt = 1883;

// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const fitbit_client = new FitbitApiClient({
    clientId: "23QZCX",
    clientSecret: "2c268bf83ea0806a41f37d5e8f55bd92",
    apiVersion: '1.2' // 1.2 is the default
});

// redirect the user to the Fitbit authorization page
// 127.0.0.1:3001/authorize
web_app.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(fitbit_client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://127.0.0.1:' + port_web + '/callback'));
});

// handle the callback from the Fitbit authorization flow
web_app.get("/callback", (req, res) => {
    // exchange the authorization code we just received for an access token
    fitbit_client.getAccessToken(req.query.code, 'http://127.0.0.1:' + port_web + '/callback').then(result => {
        // use the access token to fetch the user's profile information
        fitbit_client.get("/profile.json", result.access_token).then(results => {
            res.send(results[0]);

            //console.log(results[0][gender][....]);



        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

// launch the server
web_app.listen(port_web, () => {
    console.log('server running at http://127.0.0.1:' + port_web + '/');
    console.log('click http://127.0.0.1:' + port_web + '/authorize' + '  to authorize');
    console.log('callback http://127.0.0.1:' + port_web + '/');
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
    console.log(`Received message from client ${target_client}: ${packet.payload.toString()}`);
});