const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const HttpError = require('../utils/HttpError');
const deleteDataFromTmp = require('../utils/deleteDataFromTmp');
const cloudObjectStorage = require('../utils/cloudObjectStorage');
const mongoose = require('mongoose');

const createProduct = async (req, res) => {
  let {
    title,
    description,
    sku,
    category,
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

  const user = req.user;
  const image = req.files['image'];

  if (!title || title.length < 10) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Title must have at least 10 characters' });
    throw new HttpError(
      'Title must have at least 10 characters',
      400,
    );
  }

  if (title.length > 256) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Title must have a maximum of 256 characters' });
    throw new HttpError(
      'Title must have a maximum of 256 characters',
      400,
    );
  }

  if (!description || description.length < 50) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Description must have at least 50 characters' });
    throw new HttpError(
      'Description must have at least 50 characters',
      400,
    );
  }

  if (description.length > 5000) {
    deleteDataFromTmp(image);
    res.status(400).send({
      msg: 'Description must not have more than 5000 characters',
    });
    throw new HttpError(
      'Description must not have more than 5000 characters',
      400,
    );
  }

  if (!image || image.length < 1) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'There should be at least one image' });
    throw new HttpError('There should be at least one image', 400);
  }

  if (image.length > 10) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'There should not be more than 10 images' });
    throw new HttpError(
      'There should not be more than 10 images',
      400,
    );
  }

  if (!sku) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Product sku must be valid' });
    throw new HttpError('Product sku must be valid', 400);
  }

  if (sku) {
    const newProduct = await Product.findOne({ sku: sku });
    if (newProduct) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Product sku already exists' });
      throw new HttpError('Product sku already exists', 400);
    }
  }

  if (!price) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Product price must not be empty' });
    throw new HttpError('Product price must not be empty', 400);
  }
  if (typeof price !== 'number') {
    if (isNaN(price)) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Product price must be a number' });
      throw new HttpError('Product price must be a number', 400);
    }
    price = parseFloat(price);
  }

  if (
    !manufacturerDetails ||
    !manufacturerDetails.modelNumber ||
    !manufacturerDetails.releaseDate
  ) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Manufacturer details must be valid' });
    throw new HttpError('Manufacturer details must be valid', 400);
  }

  if (
    !shippingDetails ||
    !shippingDetails.weight ||
    !shippingDetails.width ||
    !shippingDetails.height ||
    !shippingDetails.depth
  ) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Shipping details must be valid' });
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
      deleteDataFromTmp(image);
      res
        .status(400)
        .send({ msg: 'Shipping details must be a number' });
      throw new HttpError('Shipping details must be a number', 400);
    }
    shippingDetails.weight = parseFloat(shippingDetails.weight);
    shippingDetails.width = parseFloat(shippingDetails.width);
    shippingDetails.height = parseFloat(shippingDetails.height);
    shippingDetails.depth = parseFloat(shippingDetails.depth);
  }

  if (typeof stock !== 'number') {
    if (isNaN(stock)) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Stock must be a number' });
      throw new HttpError('Stock must be a number', 400);
    }
    stock = parseFloat(stock);
  }
  if (!stock || stock < 1) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Stock must be valid and be at least 1' });
    throw new HttpError('Stock must be valid and be at least 1', 400);
  }

  if (!specs || typeof specs !== 'object') {
    deleteDataFromTmp(image);
    res.status(400).send({
      msg: 'Product specification must be valid and not empty',
    });
    throw new HttpError(
      'Product specification must be valid and not empty',
      400,
    );
  }

  const product = new Product({
    title,
    description,
    sku,
    manufacturerDetails,
    shippingDetails,
    price,
    stock,
    specs,
    createdBy: user._id,
  });

  const categoryIdIsValid = mongoose.Types.ObjectId.isValid(category);
  if (!categoryIdIsValid) {
    res.status(400).send({ msg: 'Invalid category ID' });
    throw new HttpError('Invalid category ID', 400);
  }

  const categoryFound = await Category.findOne({ _id: category.id });

  if (!categoryFound || categoryFound.length < 1) {
    const newCategory = new Category({
      title: category.title,
      parent: category.parent,
      product: product._id,
    });
    await newCategory.save();
    Object.assign(product, { category: newCategory._id });
  } else {
    categoryFound.product = [...categoryFound.product, product._id];

    await categoryFound.save();
    Object.assign(product, { category: categoryFound._id });
  }

  if (image) {
    const allImages = [];

    image.map((element) => {
      cloudObjectStorage.uploadFile(
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
      deleteDataFromTmp(image);
      res.status(400).send({
        msg: 'New price or discount must be valid and not empty',
      });
      throw new HttpError(
        'New price discount must be valid and not empty',
        400,
      );
    }

    Object.assign(product, { isOnSale });

    Object.assign(product, { newPrice });

    Object.assign(product, { discount });
  }

  if (variant) {
    if (Array.isArray(variant)) {
      for (const v of variant) {
        const variantIdIsValid = mongoose.Types.ObjectId.isValid(v);

        if (!variantIdIsValid) {
          deleteDataFromTmp(image);
          res.status(400).send({ msg: 'Invalid variant ID' });
          throw new HttpError('Invalid variant ID', 400);
        }

        const productVariant = await Product.findOne({
          _id: v,
        });

        if (!productVariant) {
          deleteDataFromTmp(image);
          res
            .status(400)
            .send({ msg: 'No product found with that ID' });
          throw new HttpError('No product found with that ID', 400);
        }
      }
    } else {
      const variantIdIsValid = mongoose.Types.ObjectId.isValid(
        variant,
      );
      if (!variantIdIsValid) {
        deleteDataFromTmp(image);
        res.status(400).send({ msg: 'Invalid variant ID' });
        throw new HttpError('Invalid variant ID', 400);
      }
      const productVariant = await Product.findOne({ _id: variant });
      if (!productVariant) {
        deleteDataFromTmp(image);
        res.status(400).send({ msg: 'Product variant not found' });
        throw new HttpError('Product variant not found', 400);
      }
    }

    Object.assign(product, { variant });
  }
  try {
    await product.save();
    user.productsCreated.push(product._id);
    await user.save();
    deleteDataFromTmp(image);

    res.status(201).send(product);
  } catch (e) {
    res.status(500).send(e);
  }
};

const editProduct = async (req, res) => {
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
    isInStock,
    stock,
    specs,
    variant,
  } = req.body;
  const image = req.files['image'];
  const id = req.params.id;

  const idIsValid = mongoose.Types.ObjectId.isValid(id);
  if (!idIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  const product = await Product.findOne({ _id: id });

  if (!title || title.length < 10) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Title must have at least 10 characters' });
    throw new HttpError(
      'Title must have at least 10 characters',
      400,
    );
  }

  if (title.length > 256) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Title must have a maximum of 256 characters' });
    throw new HttpError(
      'Title must have a maximum of 256 characters',
      400,
    );
  }

  if (!description || description.length < 50) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Description must have at least 50 characters' });
    throw new HttpError(
      'Description must have at least 50 characters',
      400,
    );
  }

  if (description.length > 5000) {
    deleteDataFromTmp(image);
    res.status(400).send({
      msg: 'Description must not have more than 5000 characters',
    });
    throw new HttpError(
      'Description must not have more than 5000 characters',
      400,
    );
  }

  if (!image || image.length < 1) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'There should be at least one image' });
    throw new HttpError('There should be at least one image', 400);
  }

  if (image.length > 10) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'There should not be more than 10 images' });
    throw new HttpError(
      'There should not be more than 10 images',
      400,
    );
  }

  if (!sku) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Product sku must be valid' });
    throw new HttpError('Product sku must be valid', 400);
  }

  if (sku) {
    const newProduct = await Product.findOne({ sku: sku });
    if (newProduct && !newProduct._id.equals(product._id)) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Product sku already exists' });
      throw new HttpError('Product sku already exists', 400);
    }
  }

  if (!price) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Product price must not be empty' });
    throw new HttpError('Product price must not be empty', 400);
  }

  if (typeof price !== 'number') {
    if (isNaN(price)) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Product price must be a number' });
      throw new HttpError('Product price must be a number', 400);
    }
    price = parseFloat(price);
  }

  if (
    !manufacturerDetails ||
    !manufacturerDetails.modelNumber ||
    !manufacturerDetails.releaseDate
  ) {
    deleteDataFromTmp(image);
    res
      .status(400)
      .send({ msg: 'Manufacturer details must be valid' });
    throw new HttpError('Manufacturer details must be valid', 400);
  }

  if (
    !shippingDetails ||
    !shippingDetails.weight ||
    !shippingDetails.width ||
    !shippingDetails.height ||
    !shippingDetails.depth
  ) {
    deleteDataFromTmp(image);
    res.status(400).send({ msg: 'Shipping details must be valid' });
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
      deleteDataFromTmp(image);
      res
        .status(400)
        .send({ msg: 'Shipping details must be a number' });
      throw new HttpError('Shipping details must be a number', 400);
    }
    shippingDetails.weight = parseFloat(shippingDetails.weight);
    shippingDetails.width = parseFloat(shippingDetails.width);
    shippingDetails.height = parseFloat(shippingDetails.height);
    shippingDetails.depth = parseFloat(shippingDetails.depth);
  }

  if (typeof stock !== 'number') {
    if (isNaN(stock)) {
      deleteDataFromTmp(image);
      res.status(400).send({ msg: 'Stock must be a number' });
      throw new HttpError('Stock must be a number', 400);
    }
    stock = parseInt(stock);
  }
  if (stock < 1 || isInStock === 'false') {
    stock = 0;
    isInStock = false;
  }
  if (stock >= 1 && isInStock === 'true') {
    isInStock = true;
  }

  if (!specs || typeof specs !== 'object') {
    deleteDataFromTmp(image);
    res.status(400).send({
      msg: 'Product specification must be valid and not empty',
    });
    throw new HttpError(
      'Product specification must be valid and not empty',
      400,
    );
  }

  if (image) {
    const allImages = [];

    product.image.map((element) => {
      cloudObjectStorage.deleteItem(element);
    });

    image.map((element) => {
      cloudObjectStorage.uploadFile(
        element.filename,
        element.path,
        element.mimetype,
      );
      allImages.push(element.filename);
    });
    product.image = allImages;
  }

  if (isOnSale && isOnSale === 'true') {
    if (newPrice && !discount) {
      discount = ((price - newPrice) / price) * 100;
    }

    if (!newPrice && discount) {
      newPrice = price - (discount / 100) * price;
    }

    if ((isOnSale && !newPrice) || (isOnSale && !discount)) {
      deleteDataFromTmp(image);
      res.status(400).send({
        msg: 'New price or discount must be valid and not empty',
      });
      throw new HttpError(
        'New price discount must be valid and not empty',
        400,
      );
    }

    product.isOnSale = true;
    product.newPrice = newPrice;
    product.discount = discount;
  }

  if (isOnSale && isOnSale === 'false') {
    product.isOnSale = false;
    product.newPrice = null;
    product.discount = null;
  }

  if (variant) {
    if (Array.isArray(variant)) {
      for (const v of variant) {
        const variantIdIsValid = mongoose.Types.ObjectId.isValid(v);

        if (!variantIdIsValid) {
          deleteDataFromTmp(image);
          res.status(400).send({ msg: 'Invalid variant ID' });
          throw new HttpError('Invalid variant ID', 400);
        }

        const productVariant = await Product.findOne({
          _id: v,
        });

        if (!productVariant) {
          deleteDataFromTmp(image);
          res
            .status(400)
            .send({ msg: 'No product found with that ID' });
          throw new HttpError('No product found with that ID', 400);
        }
      }
    } else {
      const variantIdIsValid = mongoose.Types.ObjectId.isValid(
        variant,
      );
      if (!variantIdIsValid) {
        deleteDataFromTmp(image);
        res.status(400).send({ msg: 'Invalid variant ID' });
        throw new HttpError('Invalid variant ID', 400);
      }
      const productVariant = await Product.findOne({ _id: variant });
      if (!productVariant) {
        deleteDataFromTmp(image);
        res.status(400).send({ msg: 'Product variant not found' });
        throw new HttpError('Product variant not found', 400);
      }
    }

    product.variant = variant;
  }

  try {
    product.title = title;
    product.description = description;
    product.sku = sku;
    product.manufacturerDetails = manufacturerDetails;
    product.shippingDetails = shippingDetails;
    product.price = price;
    product.isInStock = isInStock;
    product.stock = stock;
    product.specs = specs;

    await product.save();

    deleteDataFromTmp(image);
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  const idIsValid = mongoose.Types.ObjectId.isValid(id);
  if (!idIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(400).send({ msg: 'Product id not found!' });
    throw new HttpError('Product id not found', 400);
  }
  try {
    const deleteRequest = { Objects: [] };
    product.image.map((element) => {
      deleteRequest.Objects.push({ Key: element });
    });

    cloudObjectStorage.deleteMultipleItems(deleteRequest);

    res.status(200).send({ msg: 'Product deleted successfully!' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
};
