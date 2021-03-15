const fs = require('fs');

const deleteDataFromTmp = async (image) => {
  if (Array.isArray(image)) {
    image.map(async (element) => {
      await fs.unlink(element.path, (e) => {
        if (e) {
          res.status(500).send(e);
        }
      });
    });
  }

  if (!Array.isArray(image)) {
    await fs.unlink(image.path, (e) => {
      if (e) {
        res.status(500).send(e);
      }
    });
  }
};

module.exports = deleteDataFromTmp;
