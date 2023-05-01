const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const Request = require('request');
const fs = require('fs');
const callbackUrl = 'http://127.0.0.1:3000/callback';
const getURL = `https://api.fitbit.com/1.2/user/-/`;
const client = new AuthorizationCode({
    client: {
        id: '23QSN4',
        secret: '6f8b5e4aae2c9f90238bf7bc721ebc9a',
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
                    reject(error);
                } else {
                    resolve([
                        body,
                        response
                    ]);
                }
            });
        }).then(results=>{
            res.send(results[0]);
        });

    });
})
app.listen(3000, () => {
    console.log("ㅎㅇ");
});