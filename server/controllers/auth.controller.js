const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const HttpError = require('../utils/HttpError');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv/config');

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const jwtTimeout = rememberMe ? '24 hours' : '7 days';

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).send({ msg: 'User or password are incorrect' });
    throw new HttpError('User or password are incorrect', 400);
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    res.status(400).send({ msg: 'User or password are incorrect' });
    throw new HttpError('User or password are incorrect', 400);
  }

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: jwtTimeout },
  );

  user.tokens = user.tokens.concat({ token });

  await user.save();
  const userShow = await user.getPublicProfile();
  res.send({ user: userShow, token });
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = new User.findOne({ email: email });

  if (user) {
    res.status(400).send({ msg: 'User already exists' });
    throw new HttpError('User already exists', 400);
  }

  if (!validator.isEmail(email)) {
    res.status(400).send({ msg: 'Incorrect email' });
    throw new HttpError('Incorrect email', 400);
  }
  const hashPassword = bcrypt.hashSync(password, 8);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    { _id: newUser._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: '24 hours',
    },
  );

  newUser.tokens = newUser.tokens.concat({ token });
  await newUser.save();
  const userShow = await newUser.getPublicProfile();
  res.send({ user: userShow, token });
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({ msg: 'Successfully logged out' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const logoutAll = async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();

    res.send({ msg: 'Successfully logged out from all devices' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const checkEmailExist = async (req, res) => {
  const { email } = req.body;
  const user = new User.findOne({ email: email });

  if (user) {
    res.send(true);
  } else {
    res.send(false);
  }
};

module.exports = {
  login,
  register,
  logout,
  logoutAll,
  checkEmailExist,
};
