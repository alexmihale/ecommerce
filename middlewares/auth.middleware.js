const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
require('dotenv/config');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      res.status(404).send({ msg: 'No user found!' });
      throw new HttpError('No user found!', 404);
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ msg: 'Please authenticate' });
  }
};

module.exports = auth;
