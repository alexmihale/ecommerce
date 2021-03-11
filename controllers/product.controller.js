const { listenerCount } = require('../models/productModel');
const Product = require('../models/productModel');
const HttpError = require('../utils/HttpError');
const fs = require('fs');
const cloudObjectStorage = require('../utils/cloudObjectStorage');

const createProduct = async (req, res) => {
  cloudObjectStorage.createTextFile('test', 'test');
  let {
    title,
    description,
    sku,
    manufacturerDetails,
    shippingDetails,
    price,
    isOnSale,
    newPrice,
    discount,
    stock,
    specs,
    variant,
  } = req.body;

  const image = req.files;

  if (!title || title.length < 10) {
    res.status(400).send('Title must have at least 10 characters');
    throw new HttpError(
      'Title must have at least 10 characters',
      400,
    );
  }

  if (title.length > 256) {
    res
      .status(400)
      .send('Title must have a maximum of 256 characters');
    throw new HttpError(
      'Title must have a maximum of 256 characters',
      400,
    );
  }

  if (!description || description.length < 50) {
    res
      .status(400)
      .send('Description must have at least 50 characters');
    throw new HttpError(
      'Description must have at least 50 characters',
      400,
    );
  }

  if (description.length > 5000) {
    res
      .status(400)
      .send('Description must not have more than 5000 characters');
    throw new HttpError(
      'Description must not have more than 5000 characters',
      400,
    );
  }

  if (!image || image.length < 1) {
    res.status(400).send('There should be at least one image');
    throw new HttpError('There should be at least one image', 400);
  }

  if (image.length > 10) {
    res.status(400).send('There should not be more than 10 images');
    throw new HttpError(
      'There should not be more than 10 images',
      400,
    );
  }

  if (!sku) {
    res.status(400).send('Product sku must be valid');
    throw new HttpError('Product sku must be valid', 400);
  }

  if (!price) {
    res.status(400).send('Product price must not be empty');
    throw new HttpError('Product price must not be empty', 400);
  }
  if (typeof price !== 'number') {
    if (isNaN(price)) {
      res.status(400).send('Product price must be a number');
      throw new HttpError('Product price must be a number', 400);
    }
    price = parseFloat(price);
  }
  if (!(typeof price === 'number')) {
    res.status(400).send('Product price must be a number');
    throw new HttpError('Product price must be a number', 400);
  }

  if (
    !manufacturerDetails ||
    !manufacturerDetails.modelNumber ||
    !manufacturerDetails.releaseDate
  ) {
    res.status(400).send('Manufacturer details must be valid');
    throw new HttpError('Manufacturer details must be valid', 400);
  }

  if (
    !shippingDetails ||
    !shippingDetails.weight ||
    !shippingDetails.width ||
    !shippingDetails.height ||
    !shippingDetails.depth
  ) {
    res.status(400).send('Shipping details must be valid');
    throw new HttpError('Shipping details must be valid', 400);
  }

  if (
    typeof shippingDetails.weight !== 'number' ||
    typeof shippingDetails.width !== 'number' ||
    typeof shippingDetails.height !== 'number' ||
    typeof shippingDetails.depth !== 'number'
  ) {
    if (
      isNaN(shippingDetails.weight) ||
      isNaN(shippingDetails.width) ||
      isNaN(shippingDetails.height) ||
      isNaN(shippingDetails.depth)
    ) {
      res.status(400).send('Shipping details must be a number');
      throw new HttpError('Shipping details must be a number', 400);
    }
    shippingDetails.weight = parseFloat(shippingDetails.weight);
    shippingDetails.width = parseFloat(shippingDetails.width);
    shippingDetails.height = parseFloat(shippingDetails.height);
    shippingDetails.depth = parseFloat(shippingDetails.depth);
  }

  if (typeof stock !== 'number') {
    if (isNaN(stock)) {
      res.status(400).send('Stock must be a number');
      throw new HttpError('Stock must be a number', 400);
    }
    stock = parseFloat(stock);
  }
  if (!stock || stock < 1) {
    res.status(400).send('Stock must be valid and be at least 1');
    throw new HttpError('Stock must be valid and be at least 1', 400);
  }

  if (!specs) {
    res
      .status(400)
      .send('Product specification must be valid and not empty');
    throw new HttpError(
      'Product specification must be valid and not empty',
      400,
    );
  }

  const product = new Product({
    title,
    description,
    image,
    sku,
    manufacturerDetails,
    shippingDetails,
    price,
    stock,
    specs,
  });

  if (image) {
    const allImages = [];

    image.image.map(async (element) => {
      await cloudObjectStorage.uploadFile(
        element.filename,
        element.path,
        element.mimetype,
      );
      allImages.push(element.filename);
    });

    Object.assign(product, { image: allImages });
  }

  if (isOnSale && isOnSale === 'true') {
    if (newPrice && !discount) {
      discount = ((price - newPrice) / price) * 100;
    }

    if (!newPrice && discount) {
      newPrice = price - (discount / 100) * price;
    }

    if ((isOnSale && !newPrice) || (isOnSale && !discount)) {
      res
        .status(400)
        .send('New price or discount must be valid and not empty');
      throw new HttpError(
        'New price discount must be valid and not empty',
        400,
      );
    }

    Object.assign(product, { isOnSale });

    Object.assign(product, { newPrice });

    Object.assign(product, { discount });
  } else {
    res.status(400).send('Product on sale field must be true');
    throw new HttpError('Product on sale field must be true', 400);
  }

  if (variant) {
    variant.forEach(async (element) => {
      const productVariant = await Product.findOne({ _id: element });
      if (!productVariant) {
        res.status(400).send('Product variant not found');
        throw new HttpError('Product variant not found', 400);
      }
    });

    Object.assign(product, { variant });
  }
  try {
    await product.save();

    image.image.map(async (element) => {
      await fs.unlink(element.path, (e) => {
        if (e) {
          res.status(500).send(e);
        }
      });
    });
    res.send(product);
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  createProduct,
};
