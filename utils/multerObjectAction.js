const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads');
  },
  filename: function (req, file, cb) {
    const fileFormat = file.originalname.split('.');
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        '.' +
        fileFormat[fileFormat.length - 1],
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
