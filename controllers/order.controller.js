const Order = require('../models/orderModel');
const Voucher = require('../models/voucherModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { default: validator } = require('validator');
const HttpError = require('../utils/HttpError');
const Product = require('../models/productModel');

const guestOrder = async (req, res) => {
  const {
    email,
    deliveryAddress,
    invoiceAddress,
    products,
    voucher,
    price,
    priceWithVoucher,
  } = req.body;
  email.trim();
  email.toLowerCase();
  let finalPrice = 0;

  if (!validator.isEmail(email)) {
    res.status(400).send({ msg: 'Incorrect email format' });
    throw new HttpError('Incorrect email format', 400);
  }

  const user = await User.findOne({ email: email });

  if (user) {
    res.status(400).send({ msg: 'Email exists. Please log in' });
    throw new HttpError('Email exists. Please log in', 400);
  }

  if (!email) {
    res.status(400).send({ msg: 'Email must be valid' });
    throw new HttpError('No product selected', 400);
  }

  if (!deliveryAddress) {
    res
      .status(400)
      .send({ msg: 'Delivery address must not be empty' });
    throw new HttpError('Delivery address must not be empty', 400);
  }

  for (const data of Object.values(deliveryAddress)) {
    if (validator.isEmpty(data)) {
      res.status(400).send({
        msg: 'All fields from delivery addres must be filled',
      });
      throw new HttpError(
        'All fields from delivery addres must be filled',
        400,
      );
    }
  }

  if (!validator.isMobilePhone(deliveryAddress.phoneNumber)) {
    res
      .status(400)
      .send({ msg: 'Please enter a valid delivery phone number' });
    throw new HttpError(
      'Please enter a valid delivery phone number',
      400,
    );
  }

  for (const data of Object.values(invoiceAddress)) {
    if (validator.isEmpty(data)) {
      res.status(400).send({
        msg: 'All fields from invoice addres must be filled',
      });
      throw new HttpError(
        'All fields from invoice addres must be filled',
        400,
      );
    }
  }

  if (!validator.isMobilePhone(invoiceAddress.phoneNumber)) {
    res
      .status(400)
      .send({ msg: 'Please enter a valid invoice phone number' });
    throw new HttpError(
      'Please enter a valid invoice phone number',
      400,
    );
  }

  if (!products) {
    res.status(400).send({ msg: 'No product selected' });
    throw new HttpError('No product selected', 400);
  }

  for (const product of products) {
    const productIdIsValid = mongoose.Types.ObjectId.isValid(product);
    if (!productIdIsValid) {
      res.status(400).send({ msg: 'Invalid product ID' });
      throw new HttpError('Invalid Product ID', 400);
    }
  }

  finalPrice = price;

  if (voucher) {
    const voucherFound = await Voucher.findById(voucher);

    if (!voucherFound) {
      res.status(400).send({ msg: 'Incorrect voucher' });
      throw new HttpError('Incorrect voucher', 400);
    }

    if (!priceWithVoucher) {
      res
        .status(500)
        .send({ msg: 'Internal Error on voucher price' });
      throw new HttpError('Internal error on voucher price', 500);
    }

    finalPrice = priceWithVoucher;
  }
  const order = new Order({
    product: products,
    email,
    deliveryAddress: {
      firstName: deliveryAddress.firstName,
      lastName: deliveryAddress.lastName,
      phoneNumber: deliveryAddress.phoneNumber,
      district: deliveryAddress.district,
      city: deliveryAddress.city,
      address: deliveryAddress.address,
    },
    invoiceAddress: {
      firstName: invoiceAddress.firstName,
      lastName: invoiceAddress.lastName,
      phoneNumber: invoiceAddress.phoneNumber,
      district: invoiceAddress.district,
      city: invoiceAddress.city,
      address: invoiceAddress.address,
    },
    voucher,
    price: finalPrice,
  });
  let prod = [];
  for (const product of products) {
    const p = await Product.findById(product);

    if (!p) {
      res
        .status(400)
        .send({ msg: 'One of the products could not be found' });
      throw new HttpError(
        'One of the products could not be found',
        400,
      );
    }

    if (p.stock < 1) {
      res
        .status(400)
        .send({ msg: 'One of products is out of stock' });
      throw new HttpError('One of products is out of stock', 400);
    }

    let stock = p.stock;
    stock = stock - 1;
    p.stock = stock;
    prod.push(p);
  }
  try {
    for (const product of prod) {
      await product.save();
    }
    await order.save();
    res.status(200).send({ msg: 'Order placed successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const userOrder = async (req, res) => {
  const {
    products,
    voucher,
    price,
    priceWithVoucher,
    deliveryAddressIndex,
    invoiceAddressIndex,
  } = req.body;
  // NOTE: PRICE COME FROM FE WITH VOUCHER DISCOUT ALREADY APPLIED;
  const user = req.user;
  let finalPrice = 0;

  if (!products) {
    res.status(400).send({ msg: 'No product selected' });
    throw new HttpError('No product selected', 400);
  }

  for (const product of products) {
    const productIdIsValid = mongoose.Types.ObjectId.isValid(product);
    if (!productIdIsValid) {
      res.status(400).send({ msg: 'Invalid product ID' });
      throw new HttpError('Invalid Product ID', 400);
    }
  }

  finalPrice = price;

  if (voucher) {
    const voucherFound = await Voucher.findById(voucher);

    if (!voucherFound) {
      res.status(400).send({ msg: 'Incorrect voucher' });
      throw new HttpError('Incorrect voucher', 400);
    }

    if (!priceWithVoucher) {
      res
        .status(500)
        .send({ msg: 'Internal Error on voucher price' });
      throw new HttpError('Internal error on voucher price', 500);
    }

    finalPrice = priceWithVoucher;
  }

  const order = new Order({
    product: products,
    user: user._id,
    email: user.email,
    deliveryAddress: {
      firstName: user.deliveryAddress[deliveryAddressIndex].firstName,
      lastName: user.deliveryAddress[deliveryAddressIndex].lastName,
      phoneNumber:
        user.deliveryAddress[deliveryAddressIndex].phoneNumber,
      district: user.deliveryAddress[deliveryAddressIndex].district,
      city: user.deliveryAddress[deliveryAddressIndex].city,
      address: user.deliveryAddress[deliveryAddressIndex].address,
    },
    invoiceAddress: {
      firstName: user.invoiceAddress[invoiceAddressIndex].firstName,
      lastName: user.invoiceAddress[invoiceAddressIndex].lastName,
      phoneNumber:
        user.invoiceAddress[invoiceAddressIndex].phoneNumber,
      district: user.invoiceAddress[invoiceAddressIndex].district,
      city: user.invoiceAddress[invoiceAddressIndex].city,
      address: user.invoiceAddress[invoiceAddressIndex].address,
    },
    voucher,
    price: finalPrice,
  });
  let prod = [];
  for (const product of products) {
    const p = await Product.findById(product);

    if (!p) {
      res
        .status(400)
        .send({ msg: 'One of the products could not be found' });
      throw new HttpError(
        'One of the products could not be found',
        400,
      );
    }

    if (p.stock < 1) {
      res
        .status(400)
        .send({ msg: 'One of products is out of stock' });
      throw new HttpError('One of products is out of stock', 400);
    }

    let stock = p.stock;
    stock = stock - 1;
    p.stock = stock;
    prod.push(p);
  }

  user.order.push(order._id);
  try {
    for (const product of prod) {
      await product.save();
    }
    await user.save();
    await order.save();
    res.status(200).send({ msg: 'Order placed successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  guestOrder,
  userOrder,
};
