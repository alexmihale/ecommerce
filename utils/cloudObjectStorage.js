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

function multiPartUpload(itemName, filePath) {
  var uploadID = null;
  const bucketName = 'epsd';

  if (!fs.existsSync(filePath)) {
    log.error(
      new Error(
        `The file \'${filePath}\' does not exist or is not accessible.`,
      ),
    );
    return;
  }

  console.log(
    `Starting multi-part upload for ${itemName} to bucket: ${bucketName}`,
  );
  return cos
    .createMultipartUpload({
      Bucket: bucketName,
      Key: itemName,
    })
    .promise()
    .then((data) => {
      uploadID = data.UploadId;

      //begin the file upload
      fs.readFile(filePath, (e, fileData) => {
        //min 5MB part
        console.log(filePath);
        var partSize = 1024 * 1024 * 5;
        var partCount = Math.ceil(fileData.length / partSize);

        async.timesSeries(
          partCount,
          (partNum, next) => {
            var start = partNum * partSize;
            var end = Math.min(start + partSize, fileData.length);

            partNum++;

            console.log(
              `Uploading to ${itemName} (part ${partNum} of ${partCount})`,
            );

            cos
              .uploadPart({
                Body: fileData.slice(start, end),
                Bucket: bucketName,
                Key: itemName,
                PartNumber: partNum,
                UploadId: uploadID,
              })
              .promise()
              .then((data) => {
                next(e, { ETag: data.ETag, PartNumber: partNum });
              })
              .catch((e) => {
                cancelMultiPartUpload(itemName, uploadID);
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
              });
          },
          (e, dataPacks) => {
            cos
              .completeMultipartUpload({
                Bucket: bucketName,
                Key: itemName,
                MultipartUpload: {
                  Parts: dataPacks,
                },
                UploadId: uploadID,
              })
              .promise()
              .then(
                console.log(
                  `Upload of all ${partCount} parts of ${itemName} successful.`,
                ),
              )
              .catch((e) => {
                cancelMultiPartUpload(itemName, uploadID);
                console.error(`ERROR: ${e.code} - ${e.message}\n`);
              });
          },
        );
      });
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

function cancelMultiPartUpload(itemName, uploadID) {
  const bucketName = 'epsd';
  return cos
    .abortMultipartUpload({
      Bucket: bucketName,
      Key: itemName,
      UploadId: uploadID,
    })
    .promise()
    .then(() => {
      console.log(`Multi-part upload aborted for ${itemName}`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

module.exports = {
  createTextFile,
  getTextFile,
  getBucketContent,
  uploadFile,
  deleteItem,
  deleteMultipleItems,
  multiPartUpload,
};
