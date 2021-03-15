const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
require('dotenv/config');

const isAdmin = async (req, res, next) => {
  const user = req.user;

  if (user.isAdmin !== 'admin') {
    res.status(401).send({ error: 'Access Denied!' });
    throw new HttpError('Access Denied', 401);
  }
  try {
    next();
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = isAdmin;
