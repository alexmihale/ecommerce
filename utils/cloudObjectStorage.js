const IBM = require('ibm-cos-sdk');
const HttpError = require('./HttpError');
const fs = require('fs');
require('dotenv/config');

const config = {
  endpoint: process.env.IBM_OBJECT_STORAGE_ENDPOINT,
  apiKeyId: process.env.IBM_OBJECT_STORAGE_API_KEY,
  serviceInstanceId:
    process.env.IBM_OBJECT_STORAGE_SERVICE_INSTANCE_ID,
};

const cos = new IBM.S3(config);

function createTextFile(itemName, fileText) {
  return cos
    .putObject({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
      Key: itemName,
      Body: fileText,
    })
    .promise()
    .then(() => {
      return itemName;
    })
    .catch((e) => {
      throw new HttpError(`Error: ${e.message}\n`, e.code);
    });
}
function getTextFile(itemName) {
  return cos
    .getObject({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
      Key: itemName,
    })
    .promise()
    .then((data) => {
      if (data != null) {
        dataText = Buffer.from(data.Body).toString();
        return dataText;
      }
    })
    .catch((e) => {
      throw new HttpError(`Error: ${e.message}\n`, e.code);
    });
}
function getBucketContent() {
  return cos
    .listObjectsV2({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
    })
    .promise()
    .then((data) => {
      let objectData = [];
      if (data != null && data.Contents != null) {
        for (var i = 0; i < data.Contents.length; i++) {
          var itemKey = data.Contents[i].Key;
          var itemSize = data.Contents[i].Size;
          objectData.push({ name: itemKey, size: itemSize });
        }
      }
      return objectData;
    })
    .catch((e) => {
      throw new HttpError(`Error: ${e.message}\n`, e.code);
    });
}

function uploadFile(fileName, filePath, fileType) {
  return cos
    .upload({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(filePath),
      ContentType: fileType,
    })
    .promise()
    .then(() => {
      return `${fileName} file have been saved`;
    })
    .catch((e) => {
      throw new HttpError(`ERROR: ${e.message}\n`, e.code);
    });
}

function deleteItem(itemName) {
  return cos
    .deleteObject({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
      Key: itemName,
    })
    .promise()
    .then(() => {
      return `${itemName} file have been deleted`;
    })
    .catch((e) => {
      throw new HttpError(`ERROR: ${e.message}\n`, e.code);
    });
}

function deleteMultipleItems(deleteRequest) {
  return cos
    .deleteObjects({
      Bucket: process.env.IBM_OBJECT_STORAGE_BUCKET_NAME,
      Delete: deleteRequest,
    })
    .promise()
    .then(() => {
      return `Files have been deleted`;
    })
    .catch((e) => {
      throw new HttpError(`ERROR: ${e.message}\n`, e.code);
    });
}
module.exports = {
  createTextFile,
  getTextFile,
  getBucketContent,
  uploadFile,
  deleteItem,
  deleteMultipleItems,
};
