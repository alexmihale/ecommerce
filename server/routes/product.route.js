const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

router.post('/add', auth, productController.createProduct);
module.exports = router;
