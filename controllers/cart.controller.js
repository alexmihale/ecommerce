const Product = require('../models/productModel');
const HttpError = require('../utils/HttpError');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');

const getCart = async (req, res) => {
  const cartId = req.user.cart;

  const IdIsValid = mongoose.Types.ObjectId.isValid(cartId);
  if (!IdIsValid) {
    res.status(400).send({ msg: 'Invalid cart ID' });
    throw new HttpError('Invalid cart ID', 400);
  }

  const cart = await Cart.findById(cartId);

  if (!cart) {
    res.status(400).send({ msg: 'No cart found with that ID' });
    throw new HttpError('No cart found with that ID', 400);
  }

  try {
    res.send(cart);
  } catch (e) {
    res.status(500).send(e);
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cartId = req.user.cart;

  const productIdIsValid = mongoose.Types.ObjectId.isValid(productId);
  if (!productIdIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  const productIdExists = await Product.findOne({ _id: productId });

  if (!productIdExists) {
    res.status(400).send({ msg: 'Product does not exist anymore' });
    throw new HttpError('Product does not exist anymore', 400);
  }

  if (!productIdExists.isInStock) {
    res.status(400).send({ msg: 'Product is no longer in stock' });
    throw new HttpError('Product is no longer in stock', 400);
  }

  const cart = await Cart.findById(cartId);

  const foundProductIndex = await cart.product.findIndex(
    (element) => {
      return element.productId == productId;
    },
  );

  if (foundProductIndex >= 0) {
    let productQuantity = cart.product[foundProductIndex].quantity;
    productQuantity = productQuantity + quantity;

    cart.product[foundProductIndex].quantity = productQuantity;
    try {
      await cart.save();
      res.send({ msg: 'Cart updated successfully' });
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    try {
      const cartProducts = cart.product;
      await cartProducts.push({ productId, quantity });

      cart.product = cartProducts;

      await cart.save();
      res.status(200).send({ msg: 'Cart updated successfully' });
    } catch (e) {
      res.status(500).send(e);
    }
  }
};

const removeFromCart = async (req, res) => {
  const { productId, productIndex } = req.body;
  const cartId = req.user.cart;

  const productIdIsValid = mongoose.Types.ObjectId.isValid(productId);
  if (!productIdIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  if (!productIndex || productIndex < 0) {
    res.status(400).send({ msg: 'Invalid product index' });
    throw new HttpError('Invalid product index', 400);
  }

  try {
    const cart = await Cart.findById(cartId);

    let cartProducts = cart.product;

    cartProducts.splice(productIndex, 1);

    cart.product = cartProducts;

    await cart.save();
    res.status(200).send({ msg: 'Product removed' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const editCart = async (req, res) => {
  const { productId, quantity, productIndex } = req.body;
  const cartId = req.user.cart;

  const productIdIsValid = mongoose.Types.ObjectId.isValid(productId);
  if (!productIdIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  if (!productIndex || productIndex < 0) {
    res.status(400).send({ msg: 'Invalid product index' });
    throw new HttpError('Invalid product index', 400);
  }

  try {
    const cart = await Cart.findById(cartId);

    let cartProducts = cart.product;

    cartProducts[productIndex].quantity = quantity;

    cart.product = cartProducts;

    await cart.save();
    res.status(200).send({ msg: 'Product updated' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  editCart,
};
