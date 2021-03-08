const express = require('express');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/product', productRouter);

module.exports = router;