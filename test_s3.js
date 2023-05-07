const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    accessKeyId: 'AKIA56MQOH3C7X25TRU2',
    secretAccessKey: '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',
    region: 'ap-northeast-2',
});
const s3 = new AWS.S3();

const uploadParams = {
    Bucket: 'fitbit-json',
    Key: 'AccessToken.json',
    Body: '',
};

const jsonFile = 'AccessToken.json';
const file_read = fs.createReadStream(jsonFile);
file_read.on('error', function(err) {
    console.log('Error reading file:', err);
});

uploadParams.Body = file_read;

s3.upload(uploadParams, function(err, data) {
    if (err) {
        console.log('Error uploading file:', err);
    } else {
        console.log('File uploaded successfully:', data.Location);
    }
});

const downloadParams = {
  Bucket: 'fitbit-json',
  Key: 'AccessToken.json',
};

const download_path = 'sample_token.json';

const file_write = fs.createWriteStream(download_path);

s3.getObject(downloadParams)
  .createReadStream()
  .pipe(file_write)
  .on('error', function(err) {
    console.log('Error downloading file:', err);
  })
  .on('close', function() {
    console.log('File downloaded successfully');
});