const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, userController.getUsers);
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
module.exports = router;
