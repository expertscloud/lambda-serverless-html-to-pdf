const AWS = require('aws-sdk');
var wkhtmltopdf = require('wkhtmltopdf');
const concat = require('concat-stream');
const s3 = new AWS.S3();

async function successResponse(data, message, status){
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: status,
        message: message,
        data: data,
      }),
    };
  }

async function downloadS3Object(source, checkFile=false) {
    const match = source.match(/^\/([^\/]+)\/(.+)$/);
      if (!match) {
        return { status: true, requestedFile: 'Invalid source path format', bucketName: '', key: '' };
      }
  
      const bucketName = match[1];
      const key = match[2];
      const requestedFile = await s3.getObject({ Bucket: bucketName, Key: decodeURIComponent(key).replace('+', ' ') }).promise();
      if(checkFile){
        if(!requestedFile.Body){
          return { status: true, requestedFile: 'Invalid source path format', bucketName: '', key: '' };
        }
      }
      return { status: false, requestedFile: requestedFile.Body, bucketName: bucketName, key: key };
    }

async function newVersionKey(key){
  // uncomment this if want to add new versions
    // const versionRegex = /_v(\d+)/;
    // const keyVersion = key.match(versionRegex);
    // const version = keyVersion ? parseInt(keyVersion[1], 10) + 1 : 1;
    // const currentTimestamp = new Date().getTime();
    // const newVersionKey = key.replace(versionRegex, `_v${version}_${currentTimestamp}`);
    return key;
  }

async function htmlToPDF(htmlBuffer) {
    return new Promise((resolve, reject) => {
      const outputStream = concat((pdfBuffer) => {
        resolve(pdfBuffer);
      });
      wkhtmltopdf(htmlBuffer, { encoding: 'buffer', marginTop: '0.4in', marginBottom: '2.0in',  marginLeft: '0.4in', marginRight: '0.4in' })
        .pipe(outputStream)
        .on('error', (error) => {
          console.error('Error in wkhtmltopdf:', error);
          reject(error);
        })
        .on('finish', () => {
          console.log('wkhtmltopdf process finished successfully');
          resolve();
        });
    });
  }

async function getFileUrl(bucket, key, url_flag=false) {
    let url = "";
    if(url_flag){
      url = 'https://' + bucket + '.s3.amazonaws.com/' + key;
    }else{
      url = '/' + bucket + '/' + key;
    }
  
    return url;  
  }
async function uploadtoS3(destBucketName, newKey, resultedbuffer){
    await s3.putObject({
          Bucket: destBucketName,
          Key: newKey,
          Body: resultedbuffer
    }).promise();
  }

module.exports={
    successResponse, downloadS3Object, newVersionKey, htmlToPDF, getFileUrl, uploadtoS3
}