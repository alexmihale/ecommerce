const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin.middleware');
const upload = require('../utils/multerObjectAction');
const auth = require('../middlewares/auth.middleware');

router.get('/get-user', userController.getUserById);
router.get('/', auth, userController.getUser);
router.patch(
  '/edit-pi',
  auth,
  userController.editPersonalInformations,
);
router.post('/edit-email', auth, userController.editEmail);
router.post('/edit-password', auth, userController.editPassword);
router.post('/add-address', auth, userController.addAddress);
router.post(
  '/auditor-delivery-address',
  auth,
  userController.addDeliveryAddress,
);
router.patch(
  '/auditor-delivery-address',
  auth,
  userController.editDeliveryAddress,
);
router.delete(
  '/auditor-delivery-address',
  auth,
  userController.removeDeliveryAddress,
);
router.post(
  '/auditor-invoice-address',
  auth,
  userController.addInvoiceAddress,
);
router.patch(
  '/auditor-invoice-address',
  auth,
  userController.editInvoiceAddress,
);
router.delete(
  '/auditor-invoice-address',
  auth,
  userController.removeInvoiceAddress,
);

router.post(
  '/edit-avatar',
  auth,
  upload.single('avatar'),
  userController.editAvatar,
);

router.post(
  '/add-favourite',
  auth,
  userController.addProductToFavourite,
);

router.delete(
  '/delete-favourite',
  auth,
  userController.deleteProductFromFavourite,
);

router.post(
  '/edit-admin-level',
  auth,
  isAdmin,
  userController.editAdminLevel,
);

module.exports = router;
