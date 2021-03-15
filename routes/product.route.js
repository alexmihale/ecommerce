const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../utils/multerObjectAction');
const isManager = require('../middlewares/isContentManager.middleware');

router.post(
  '/add-product',
  isManager,
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.createProduct,
);

router.patch(
  '/edit-product/:id',
  isManager,
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.editProduct,
);

router.delete(
  '/delete-product/:id',
  isManager,
  productController.deleteProduct,
);
module.exports = router;
