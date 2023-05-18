const text = document.getElementById("text");

const button = document.getElementById("button");
const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const h3 = document.getElementById("h3");
const h4 = document.getElementById("h4");
const h5 = document.getElementById("h5");
const h6 = document.getElementById("h6");
//const request_fitbit_url = "http://127.0.0.1:3000/getrealtime";
//const request_publish_url = "http://127.0.0.1:3000/getpublish";
const request_fitbit_url = "http://13.236.207.60/getrealtime";
const request_publish_url = "http://13.236.207.60/getpublish";

AWS.config.update({
    accessKeyId: 'AKIA56MQOH3C7X25TRU2',
    secretAccessKey: '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',
    region: 'ap-northeast-2',
});
const s3 = new AWS.S3();

var heart_rate_data = [
    [0, 0, 0, 0]
    ,["2023-05-08", "13:40", 112, 3]
    ,["2023-05-08", "13:41", 116, 3]
    ,["2023-05-08", "13:42", 122, 3]
    ,["2023-05-08", "13:43", 123, 3]
    ,["2023-05-08", "13:44", 127, 3]
    ,["2023-05-08", "13:45", 130, 3]
    ,["2023-05-08", "13:46", 133, 4]
    ,["2023-05-08", "13:47", 136, 4]
    ,["2023-05-08", "13:48", 129, 3]
    ,["2023-05-08", "13:49", 121, 3]
    ,["2023-05-08", "13:50", 117, 3]
];

function download_heart_rate() {
    const downloadParams = {
        Bucket: 'fitbit-json', //대상 버킷
        Key: 'user1.json', //대상 파일
    };
    
    s3.getObject(downloadParams, function(err, data) {
        if (err) {
            console.log('Error downloading file:', err);
        } else {
            const jsonData = data.Body.toString();
            const heart_rate_data = JSON.parse(jsonData);
            console.log('File downloaded successfully');
            console.log('Array data:', heart_rate_data);
        }
    });  
}
//나중에 참고할 수도 있으니 지우지마
// console.log("heart rate time : " + response.data[0]['activities-heart-intraday']['dataset'][0]['time']);
// console.log("heart rate value : " + response.data[0]['activities-heart-intraday']['dataset'][0]['value']);
// console.log("hrv : " + response.data[1]);
// console.log("br : " + response.data[2]);
// console.log("spo2 : " + response.data[3]);

function display_heart_rate() {
    download_heart_rate();

    var hrdl = heart_rate_data.length - 1;

    h1.textContent='날짜         : '+heart_rate_data[hrdl][0];
    h2.textContent='시간         : '+heart_rate_data[hrdl][1];
    h3.textContent='심박 수      : '+heart_rate_data[hrdl][2];
    h4.textContent='스트레스 레벨 : '+heart_rate_data[hrdl][3];
    //h1.textContent = '['+heart_rate_data[hrdl][0]+', '+heart_rate_data[hrdl][1]+', '+heart_rate_data[hrdl][2]+', '+heart_rate_data[hrdl][3] + ']';
}

var sams = 0;

function display_heart_rate_sample() {
    sams++;

    h1.textContent='날짜         : '+heart_rate_data[sams][0];
    h2.textContent='시간         : '+heart_rate_data[sams][1];
    h3.textContent='심박 수      : '+heart_rate_data[sams][2];
    h4.textContent='스트레스 레벨 : '+heart_rate_data[sams][3];
    //h1.textContent = '['+heart_rate_data[hrdl][0]+', '+heart_rate_data[hrdl][1]+', '+heart_rate_data[hrdl][2]+', '+heart_rate_data[hrdl][3] + ']';
}

function display_mqtt() {
    axios.get(request_publish_url)
    .then(response => {
        h5.textContent = response.data;
        //받아온 것에 변화가 있을 때 해당 부분 수정
    })
    .catch(error => {
        console.log(error);
    });
}

display_heart_rate_sample();
setInterval(display_heart_rate_sample, 3000);

//display_mqtt();
//setInterval(display_mqtt, 3000);