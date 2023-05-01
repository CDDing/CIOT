// initialize the express application
const express = require("express");
const app = express();

// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
	clientId: "23QZ3X",
	clientSecret: "8035a0caabfa6674b589a0e1ffb1b577",
	apiVersion: '1.2' // 1.2 is the default
});

// redirect the user to the Fitbit authorization page
app.get("/authorize", (req, res) => {
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://127.0.0.1:3000'));
});

// handle the callback from the Fitbit authorization flow
app.get("/", (req, res) => {
    //console.log(req);
	// exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, 'http://127.0.0.1:3000').then(result => {
		// use the access token to fetch the user's profile information
		client.get("/sleep/date/2023-04-30.json", result.access_token).then(results => {
            console.log(results);
			res.send(results[0]);
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});
// launch the server
app.listen(3000);