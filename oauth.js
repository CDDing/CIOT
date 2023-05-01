const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const callbackUrl = 'http://127.0.0.1:3000/callback';
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
    redirect_uri: callbackUrl,
    scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature weight',
}).replace('api','www');

app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
        code,
    };
    try {
        const accessToken = await client.getToken(options);
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
app.listen(3000, () => {
    console.log("ㅎㅇ");
});
