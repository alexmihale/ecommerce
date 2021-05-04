const express = require('express');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const cartRouter = require('./cart.route');
const reviewRouter = require('./review.router');
const subscribeRouter = require('./subscribe.route');
const orderRouter = require('./order.route');
const voucherRouter = require('./voucher.route');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/cart', auth, cartRouter);
router.use('/review', reviewRouter);
router.use('/subscribe', subscribeRouter);
router.use('/order', orderRouter);
router.use('/voucher', voucherRouter);

module.exports = router;
