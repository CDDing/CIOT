const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    accessKeyId: 'AKIA56MQOH3C7X25TRU2',
    secretAccessKey: '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',
    region: 'ap-northeast-2',
});

const s3 = new AWS.S3();

var heart_rate_data = [
    [0, 0, 0, 0]
    //[1, 2, 3],
    //[4, 5, 6],
    //[7, 8, 9]
];

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