const express = require('express');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const cartRouter = require('./cart.route');
const reviewRouter = require('./review.router');
const subscribeRouter = require('./subscribe.route');
const orderRouter = require('./order.route');
const auth = require('../middlewares/auth.middleware');
const isManager = require('../middlewares/isContentManager.middleware');
const router = express.Router();

router.use('/user', auth, userRouter);
router.use('/auth', authRouter);
router.use('/product', auth, isManager, productRouter);
router.use('/cart', auth, cartRouter);
router.use('/review', auth, reviewRouter);
router.use('/subscribe', subscribeRouter);
router.use('/order', orderRouter);

module.exports = router;
