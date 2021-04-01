const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin.middleware');
const upload = require('../utils/multerObjectAction');

router.get('/get-all-users', userController.getAllUsers);
router.get('/', userController.getUsers);
router.patch('/edit-pi', userController.editPersonalInformations);
router.post('/edit-email', userController.editEmail);
router.post('/edit-password', userController.editPassword);
router.post('/add-address', userController.addAddress);
router.post(
  '/auditor-delivery-address',
  userController.addDeliveryAddress,
);
router.patch(
  '/auditor-delivery-address',
  userController.editDeliveryAddress,
);
router.delete(
  '/auditor-delivery-address',
  userController.removeDeliveryAddress,
);
router.post(
  '/auditor-invoice-address',
  userController.addInvoiceAddress,
);
router.patch(
  '/auditor-invoice-address',
  userController.editInvoiceAddress,
);
router.delete(
  '/auditor-invoice-address',
  userController.removeInvoiceAddress,
);

router.post(
  '/edit-avatar',
  upload.single('avatar'),
  userController.editAvatar,
);

router.post('/add-favourite', userController.addProductToFavourite);

router.delete(
  '/delete-favourite',
  userController.deleteProductFromFavourite,
);

router.post(
  '/edit-admin-level',
  isAdmin,
  userController.editAdminLevel,
);

module.exports = router;
