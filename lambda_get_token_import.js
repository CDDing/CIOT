const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const fs = require('fs');
const cors = require('cors');
const callbackUrl = 'http://127.0.0.1:3000/callback';

const mf = require('./mongodb_function');

const clientID = '23QZCX'
const clientSecret = 'aa1368dd0f04cb0c738a83d9abf7e805'

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
    //console.log(authorizationUri);
    res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
        code,
        redirect_uri: callbackUrl,
    };

    console.log('code = ' + code + '\n\n\n');

    try {
        const accessToken = await client.getToken(options);

        //mf.mongo_session('update', undefined, undefined, accessToken.token);
        
        //console.log(accessToken.token);
    
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

const server = app.listen(3000, () => {
    console.log('click here to start http://127.0.0.1:3000/auth\n');
    console.log('click here to start http://127.0.0.1:3000/callback\n');
});

// 서버 종료
//server.close(() => {
//    console.log('서버가 종료되었습니다.');
//});
