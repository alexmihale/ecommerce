const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
const upload = require('../utils/multerObjectAction');
const isManager = require('../middlewares/isContentManager.middleware');
const auth = require('../middlewares/auth.middleware');

router.get('/', productController.getProduct);

router.post(
  '/add-product',
  auth,
  isManager,
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.createProduct,
);

router.patch(
  '/edit-product/:id',
  auth,
  isManager,
  upload.fields([{ name: 'image', maxCount: 10 }]),
  productController.editProduct,
);

router.delete(
  '/delete-product/:id',
  auth,
  isManager,
  productController.deleteProduct,
);
module.exports = router;
