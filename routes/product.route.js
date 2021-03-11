const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../utils/multerObjectAction');

router.post(
  '/add',
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.createProduct,
);
module.exports = router;
