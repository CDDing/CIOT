// initialize the express application
const express = require("express");
const app = express();

const port = 3000;

var prs;

// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
    clientId: "23QZCX",
    clientSecret: "2c268bf83ea0806a41f37d5e8f55bd92",
    apiVersion: '1.2' // 1.2 is the default
});

// redirect the user to the Fitbit authorization page
// 127.0.0.1:3001/authorize
app.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://127.0.0.1:' + port + '/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://127.0.0.1:' + port + '/callback').then(result => {
        // use the access token to fetch the user's profile information
        client.get("/profile.json", result.access_token).then(results => {
            res.send(results[0]);

            console.log(results[0][gender][....]);



        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

// launch the server
app.listen(port, () => {
    console.log('server running at http://127.0.0.1:' + port + '/');
    console.log('click http://127.0.0.1:' + port + '/authorize' + '  to authorize');
    console.log('callback http://127.0.0.1:' + port + '/');
});