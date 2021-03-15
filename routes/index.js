const express = require('express');
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.use('/user', auth, userRouter);
router.use('/auth', authRouter);
router.use('/product', auth, productRouter);

module.exports = router;
