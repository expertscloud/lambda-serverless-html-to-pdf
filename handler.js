const { successResponse, downloadS3Object, newVersionKey, uploadtoS3, getFileUrl, htmlToPDF } = require("./utils");
const { htmlToPDFValidator } = require("./validators");
var JSONParse = require('json-parse-safe');

module.exports.htmlToPDF= async (event) => {
    try {
      const body = JSONParse(event.body);
      
      const { error, value } =  htmlToPDFValidator.validate(body.value);   
      if (error) {
        const errorMessage=error.details[0].message
        return successResponse({}, errorMessage, false);
      }
      const { htmlSourceKey, htmlBase64, destinationKey } = value;
  
      let destBucketName = "";
      let destKey = "";
      let htmlBuffer = "";
  
      if(htmlSourceKey) {
        const response = await downloadS3Object(htmlSourceKey, true);
        if (response.status) {
          return await successResponse({}, response.requestedFile, false);
        }
        destBucketName = response.bucketName;
        destKey = response.key;
        htmlBuffer = response.requestedFile;
      }else if(destinationKey){
        const match = destinationKey.match(/^\/([^\/]+)\/(.+)$/);
        if (!match) {
          return await successResponse({}, 'Invalid source path format', false);
        }
        destBucketName = match[1];
        destKey = match[2];
      }else{
        return await successResponse({}, 'htmlSourceKey or destinationKey is required', false);
      }
  
      if(!htmlBuffer){
        if(!htmlBase64){
          return await successResponse({}, 'htmlBase64 is required', false);
        }
        htmlBuffer = Buffer.from(htmlBase64, 'base64').toString('utf-8');
      }
      
      let newKey = await newVersionKey(destKey);
      newKey = newKey.replace(/\.html$/, '.pdf');
      const pdfBytes = await htmlToPDF(htmlBuffer);
       await uploadtoS3(destBucketName, newKey, pdfBytes)
  
      const data = { 
        newSourcePath: '', 
        newDestinationPath: await getFileUrl(destBucketName, newKey), 
        newFileUrl: await getFileUrl(destBucketName, newKey, true)
      };
      return await successResponse(data, `File saved to ${destBucketName}`, true);
    } catch (error) {
      console.error("Error writing data to file:", error);
      return await successResponse({}, "Error writing data to file", false);
    }
  };