const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
const upload = require('../utils/multerObjectAction');

router.post(
  '/add-product',
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.createProduct,
);

router.patch(
  '/edit-product/:id',
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.editProduct,
);

router.delete('/delete-product/:id', productController.deleteProduct);
module.exports = router;
