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

const uploadParams = {
    Bucket: 'fitbit-json',
    Key: 'user1.json',
    Body: '',
};

const jsonData = JSON.stringify(heart_rate_data);

uploadParams.Body = jsonData;

s3.upload(uploadParams, function(err, data) {
    if (err) {
        console.log('Error uploading file:', err);
    } else {
        console.log('File uploaded successfully:', data.Location);
    }
});