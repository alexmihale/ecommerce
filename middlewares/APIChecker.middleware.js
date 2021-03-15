const HttpError = require('../utils/HttpError');

require('dotenv/config');

const APIChecker = () => {
  return (req, res, next) => {
    if (
      req.headers['x-api-key'] !== process.env.ECOMMERCE_BACKEND_API
    ) {
      res.status(401).send({ msg: 'Access Denied' });
      throw new HttpError('Access Denied', 401);
    } else {
      next();
    }
  };
};

module.exports = APIChecker;
