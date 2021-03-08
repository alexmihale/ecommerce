const { default: validator } = require('validator');
const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

const getUsers = async (req, res) => {
  const user = req.user;
  const userShow = await user.getPublicProfile();
  res.send(user);
};

const editPersonalInformations = async (req, res) => {
  const id = req.user._id;
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = [
    'salutation',
    'firstName',
    'lastName',
    'alias',
    'mobilePhoneNumber',
    'homePhoneNumber',
    'dateOfBirth',
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    res.status(400).send('Invalid Updates!');
    throw new HttpError('Invalid updates!', 400);
  }
  const user = await User.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
  res.send({ msg: 'Personal informations have been updated' });
};

const editEmail = async (req, res) => {
  const user = req.user;
  const { email } = req.body;
  email.trim();
  email.toLowerCase();

  if (!validator.isEmail(email)) {
    res.status(400).send({ msg: 'Incorrect email format' });
    throw new HttpError('Incorrect email format', 400);
  }

  if (email === user.email) {
    res.status(400).send({ msg: 'Email must be different!' });
    throw new HttpError('Email must be different!', 400);
  }

  const dbUser = await User.findOne({ email: email });
  if (dbUser) {
    res.status(400).send({ msg: 'Email already exists' });
    throw new HttpError('Email already exists', 400);
  }

  try {
    user.email = email;

    await user.save();

    res.send({ msg: 'Email have been changed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const editPassword = async (req, res) => {
  const user = req.user;
  const { password } = req.body;

  if (!validator.isStrongPassword(password, [{ minSymbols: 1 }])) {
    res.status(400).send({ msg: 'Password is weak' });
    throw new HttpError('Password is weak');
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (isMatch) {
    res.status(400).send({ msg: 'Password must be different!' });
    throw new HttpError('Password must be different!', 400);
  }

  try {
    const hashPassword = bcrypt.hashSync(password, 8);

    user.password = hashPassword;

    await user.save();
    res.send({ msg: 'Password have been changed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const addAddress = async (req, res) => {
  const user = req.user;
  const {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  } = req.body;
  firstName.trim();
  lastName.trim();
  phoneNumber.trim();
  address.trim();

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !district ||
    !city ||
    !address
  ) {
    res.status(400).send({ msg: 'All fields must contain data' });
    throw new HttpError('All fields must contain data', 400);
  }

  const userAddress = {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  };

  try {
    const userDeliveryAddress = user.deliveryAddress;
    userDeliveryAddress.push(userAddress);
    const userInvoiceAddress = user.invoiceAddress;
    userInvoiceAddress.push(userAddress);

    user.deliveryAddress = userDeliveryAddress;
    user.invoiceAddress = userInvoiceAddress;

    await user.save();
    res.send({ msg: 'Addresses have been changed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const addDeliveryAddress = async (req, res) => {
  const user = req.user;
  const {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  } = req.body;
  firstName.trim();
  lastName.trim();
  phoneNumber.trim();
  address.trim();

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !district ||
    !city ||
    !address
  ) {
    res.status(400).send({ msg: 'All fields must contain data' });
    throw new HttpError('All fields must contain data', 400);
  }

  const userAddress = {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  };

  try {
    const userDeliveryAddress = user.deliveryAddress;
    userDeliveryAddress.push(userAddress);

    user.deliveryAddress = userDeliveryAddress;

    await user.save();
    res.send({ msg: 'Addresses have been saved' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const editDeliveryAddress = async (req, res) => {
  const user = req.user;
  const {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
    order,
  } = req.body;

  firstName.trim();
  lastName.trim();
  phoneNumber.trim();
  address.trim();

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !district ||
    !city ||
    !address ||
    !order
  ) {
    res.status(400).send({ msg: 'All fields must contain data' });
    throw new HttpError('All fields must contain data', 400);
  }
  const userAddress = {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  };

  try {
    const userDeliveryAddress = user.deliveryAddress;
    userDeliveryAddress[order] = userAddress;

    user.deliveryAddress = userDeliveryAddress;

    await user.save();

    res.send({ msg: 'Addresses have been changed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const removeDeliveryAddress = async (req, res) => {
  const user = req.user;
  const { order } = req.body;

  if (!order) {
    res.status(400).send({ msg: 'Delete order must be valid' });
    throw new HttpError('Delete order must be valid', 400);
  }

  try {
    const userDeliveryAddress = user.deliveryAddress;
    userDeliveryAddress.splice(order, 1);

    user.deliveryAddress = userDeliveryAddress;

    await user.save();

    res.send({ msg: 'Addresses have been deleted' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const addInvoiceAddress = async (req, res) => {
  const user = req.user;
  const {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  } = req.body;
  firstName.trim();
  lastName.trim();
  phoneNumber.trim();
  address.trim();

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !district ||
    !city ||
    !address
  ) {
    res.status(400).send({ msg: 'All fields must contain data' });
    throw new HttpError('All fields must contain data', 400);
  }

  const userAddress = {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  };

  try {
    const userInvoiceAddress = user.invoiceAddress;
    userInvoiceAddress.push(userAddress);

    user.invoiceAddress = userInvoiceAddress;

    await user.save();
    res.send({ msg: 'Addresses have been saved' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const editInvoiceAddress = async (req, res) => {
  const user = req.user;
  const {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
    order,
  } = req.body;

  firstName.trim();
  lastName.trim();
  phoneNumber.trim();
  address.trim();

  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !district ||
    !city ||
    !address ||
    !order
  ) {
    res.status(400).send({ msg: 'All fields must contain data' });
    throw new HttpError('All fields must contain data', 400);
  }
  const userAddress = {
    firstName,
    lastName,
    phoneNumber,
    district,
    city,
    address,
  };

  try {
    const userInvoiceAddress = user.invoiceAddress;
    userInvoiceAddress[order] = userAddress;

    user.invoiceAddress = userInvoiceAddress;

    await user.save();

    res.send({ msg: 'Addresses have been changed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const removeInvoiceAddress = async (req, res) => {
  const user = req.user;
  const { order } = req.body;

  if (!order) {
    res.status(400).send({ msg: 'Delete order must be valid' });
    throw new HttpError('Delete order must be valid', 400);
  }

  try {
    const userInvoiceAddress = user.invoiceAddress;
    userInvoiceAddress.splice(order, 1);

    user.invoiceAddress = userInvoiceAddress;

    await user.save();

    res.send({ msg: 'Addresses have been deleted' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  getAllUsers,
  getUsers,
  editPersonalInformations,
  editEmail,
  editPassword,
  addAddress,
  addDeliveryAddress,
  editDeliveryAddress,
  removeDeliveryAddress,
  addInvoiceAddress,
  editInvoiceAddress,
  removeInvoiceAddress,
};
