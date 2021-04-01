const fs = require('fs');
const HttpError = require('./HttpError');

const deleteDataFromTmp = async (image) => {
  if (Array.isArray(image)) {
    image.map(async (element) => {
      await fs.unlink(element.path, (e) => {
        if (e) {
          throw new HttpError(e, 500);
        }
      });
    });
  }

  if (!Array.isArray(image)) {
    await fs.unlink(image.path, (e) => {
      if (e) {
        throw new HttpError(e, 500);
      }
    });
  }
};

module.exports = deleteDataFromTmp;
