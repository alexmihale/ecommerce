const User = require('../models/userModel');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const HttpError = require('../utils/HttpError');
const mongoose = require('mongoose');

const addReview = async (req, res) => {
  const { title, body, rating, productId } = req.body;
  const user = req.user;

  if (title.length > 50) {
    res.status(400).send({ msg: 'Title is too long' });
    throw new HttpError('Title is too long', 400);
  }

  if (body.length > 3000) {
    res.status(400).send({ msg: 'Body is too long' });
    throw new HttpError('Body is too long', 400);
  }

  if (isNaN(rating) || rating < 0 || rating > 5) {
    res.status(400).send({ msg: 'Rating is not a valid number' });
    throw new HttpError('Rating is not a valid number', 400);
  }

  const productIdIsValid = mongoose.Types.ObjectId.isValid(productId);

  if (!productIdIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }

  const review = new Review({
    title,
    body,
    rating,
    product: productId,
    user: user._id,
  });

  await review.save();

  const product = await Product.findById(productId);

  if (!product) {
    res.status(400).send('Product id not found');
    throw new HttpError('Product id not found', 400);
  }
  let productReview = product.review || [];
  if (productReview) {
    productReview.push(review._id);
    product.review = productReview;
    let reviewSum = 0;
    for (const review of productReview) {
      const productR = await Review.findById(review);
      reviewSum = reviewSum + productR.rating;
    }

    const productRating = reviewSum / productReview.length;
    product.rating = productRating;
  } else {
    productReview.push(review._id);

    product.review = productReview;
    product.review = rating;
  }

  await product.save();

  try {
    let userReview = user.review;

    userReview.push(review._id);
    user.review = userReview;
    await user.save();
    res.status(200).send({ msg: 'Review added successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const reviewIdIsValid = mongoose.Types.ObjectId.isValid(reviewId);
  let productFound = false;
  let userFound = false;

  if (!reviewIdIsValid) {
    res.status(400).send({ msg: 'Invalid product ID' });
    throw new HttpError('Invalid Product ID', 400);
  }
  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(400).send({ msg: 'Review id not found' });
    throw new HttpError('Review id not found', 400);
  }
  const product = await Product.findById(review.product);
  const user = await User.findById(review.user);

  for (const [index, productReview] of product.review.entries()) {
    if (productReview.equals(reviewId)) {
      const reviews = product.review;
      reviews.splice(index, 1);
      product.review = reviews;

      let reviewSum = 0;
      for (const review of reviews) {
        const productR = await Review.findById(review);
        reviewSum = reviewSum + productR.rating;
      }

      const productRating = reviewSum / product.review.length;
      product.rating = productRating;

      productFound = true;
    }
  }

  if (!productFound) {
    res.status(400).send({ msg: 'Review not found' });
    throw new HttpError('Review not found', 400);
  }

  for (const [index, userReview] of user.review.entries()) {
    if (userReview.equals(reviewId)) {
      const reviews = user.review;
      reviews.splice(index, 1);
      user.review = reviews;
      userFound = true;
    }
  }

  if (!userFound) {
    res.status(400).send({ msg: 'Review not found' });
    throw new HttpError('Review not found', 400);
  }

  try {
    await product.save();
    await user.save();
    await review.remove();

    res.status(200).send({ msg: 'Review deleted successfully' });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  addReview,
  deleteReview,
};
