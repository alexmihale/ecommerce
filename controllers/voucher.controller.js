const Voucher = require('../models/voucherModel');
const User = require('../models/userModel');
const HttpError = require('../utils/HttpError');
const mongoose = require('mongoose');

const getVoucher = async (req, res) => {
  const voucherId = req.headers['voucherid'];

  const IdIsValid = mongoose.Types.ObjectId.isValid(voucherId);

  if (!IdIsValid) {
    res.status(400).send({ msg: 'Invalid voucher ID' });
    throw new HttpError('Invalid voucher ID', 400);
  }

  const voucher = await Voucher.findById(voucherId);

  if (!voucher) {
    res.status(400).send({ msg: 'No voucher found with that ID' });
    throw new HttpError('No voucher found with that ID', 400);
  }
  try {
    res.send(voucher);
  } catch (e) {
    res.status(500).send(e);
  }
};

const createVoucher = async (req, res) => {
  const {
    title,
    body,
    discountType,
    discount,
    isPrivate,
    user,
  } = req.body;

  if (!title) {
    res.status(400).send({ msg: 'Voucher must contain a title' });
    throw new HttpError('Voucher must contain a title', 400);
  }
  if (!body) {
    res.status(400).send({ msg: 'Voucher must contain a body' });
    throw new HttpError('Voucher must contain a body', 400);
  }
  if (!discountType) {
    res
      .status(400)
      .send({ msg: 'Voucher must contain a discount type' });
    throw new HttpError('Voucher must contain a discount type', 400);
  }
  if (!discount) {
    res.status(400).send({ msg: 'Voucher must contain a discount' });
    throw new HttpError('Voucher must contain a discount', 400);
  }

  const voucher = new Voucher({
    title,
    body,
    discountType,
    discount,
  });

  if (isPrivate === true) {
    const IdIsValid = mongoose.Types.ObjectId.isValid(user);

    if (!IdIsValid) {
      res.status(400).send({ msg: 'Invalid user ID' });
      throw new HttpError('Invalid user ID', 400);
    }

    const userFound = await User.findById(user);

    if (!userFound) {
      res.status(400).send('No user found with that ID');
      throw new HttpError('No user found with that ID', 400);
    }

    Object.assign(voucher, { isPrivate, user });
  }

  try {
    await voucher.save();
    res.send('Voucher created successfully');
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteVoucher = async (req, res) => {
  const voucherId = req.headers['voucherid'];

  const idIsValid = mongoose.Types.ObjectId.isValid(voucherId);
  if (!idIsValid) {
    res.status(400).send({ msg: 'Invalid voucher ID' });
    throw new HttpError('Invalid voucher ID', 400);
  }

  const voucher = await Voucher.findByIdAndDelete(voucherId);

  if (!voucher) {
    res.status(400).send({ msg: 'Voucher id not found' });
    throw new HttpError('Voucher id not found', 400);
  }

  try {
    res.send({ msg: 'Voucher deleted successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  getVoucher,
  createVoucher,
  deleteVoucher,
};
