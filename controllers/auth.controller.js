const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const bcrypt = require('bcrypt');
const HttpError = require('../utils/HttpError');
const jwt = require('jsonwebtoken');
const { default: validator } = require('validator');
const Subscription = require('../models/subscriptionModel');
require('dotenv/config');

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!validator.isEmail(email)) {
    res.status(400).send({ msg: 'Incorrect email format' });
    throw new HttpError('Incorrect email format', 400);
  }

  if (!validator.isStrongPassword(password, [{ minSymbols: 1 }])) {
    res.status(400).send({ msg: 'Password is weak' });
    throw new HttpError('Password is weak');
  }

  const jwtTimeout = rememberMe ? '7 days' : '24 hours';

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).send({
      msg: 'Incorrect email email or password',
    });
    throw new HttpError('Incorrect email email or password', 400);
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    res
      .status(400)
      .send({ msg: 'Incorrect email email or password' });
    throw new HttpError('Incorrect email email or password', 400);
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
  email.trim();
  email.toLowerCase();

  if (validator.isEmpty(firstName) || validator.isEmpty(lastName)) {
    res.status(400).send({ msg: 'Enter a valid name' });
    throw new HttpError('Enter a valid name', 400);
  }

  if (!validator.isEmail(email)) {
    res.status(400).send({ msg: 'Incorrect email format' });
    throw new HttpError('Incorrect email format', 400);
  }

  if (!validator.isStrongPassword(password, [{ minSymbols: 1 }])) {
    res.status(400).send({ msg: 'Password is weak' });
    throw new HttpError('Password is weak');
  }

  const user = await User.findOne({ email: email });

  if (user) {
    res.status(400).send({ msg: 'Email already exists' });
    throw new HttpError('Email already exists', 400);
  }

  const hashPassword = bcrypt.hashSync(password, 8);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  const cart = new Cart({
    user: newUser._id,
  });

  newUser.cart = cart._id;

  const subscribe = new Subscription({
    email,
  });

  const token = jwt.sign(
    { _id: newUser._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: '24 hours',
    },
  );

  newUser.tokens = newUser.tokens.concat({ token });
  await subscribe.save();
  await cart.save();
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
