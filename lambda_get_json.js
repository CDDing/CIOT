const { AuthorizationCode } = require('simple-oauth2');
const app = require('express')();
const Request = require('request');
const fs = require('fs');
const cors = require('cors');

var heart_rate_data = [
    [0, 0, 0, 0]
];

var responsed_data = [];

//var today = new Date(2023, 9, 3, 9, 9, 0); //sample
var today = new Date();

var today_full = today.getFullYear() + '-' + ((today.getMonth() < 9) ? '0' + (today.getMonth() + 1) : "" + (today.getMonth() + 1)) + '-' + ((today.getDate() < 10) ? '0' + today.getDate() : "" + today.getDate());
var today_hour = (today.getHours() < 10) ? '0' + today.getHours() : "" + today.getHours();

var correct_min = today.getMinutes() - 10;

var today_min = (correct_min < 10) ? '0' + correct_min : "" + correct_min;
var today_min_next = (correct_min + 1 < 10) ? '0' + (correct_min + 1) : "" + (correct_min + 1) ;
var today_time1 = today_hour + ":" + today_min;
var today_time2 = today_hour + ":" + today_min_next;

var detail_level = '1sec' //can use    1sec | 1min | 5min | 15min  string

var heart_rate_now = "/activities/heart/date/" + today_full + '/' + today_full + '/' + detail_level + '/time/' + today_time1 + '/' + today_time2 + ".json"; //https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/
var test_heart_rate_now = "/activities/heart/date/2023-05-04/2023-05-04/" + detail_level + '/time/13:40/13:41.json';

var request_json_list = [heart_rate_now];

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
        
        request_json_list = [test_heart_rate_now];
    }
}


function modify_array_data(today, timeline, HR, SRLV) {
    const newRow = [today, timeline, HR, SRLV];
  
    heart_rate_data.push(newRow);
}

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Fitbit API</a>');
});

app.get('/getrealtime', (req, res) => {
    var requestURL = 'https://api.fitbit.com/1/user/-/';

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

const server = app.listen(3000, () => {
    console.log('http://127.0.0.1:3000/getrealtime\n');
    console.log(today_full + '    ' + today_min + '    ' + today_min_next);
});

// 서버 종료
//server.close(() => {
//    console.log('서버가 종료되었습니다.');
//});