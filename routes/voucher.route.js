const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isManager = require('../middlewares/isContentManager.middleware');

router.get('/', voucherController.getVoucher);
router.post('/', auth, isManager, voucherController.createVoucher);
router.delete('/', auth, isManager, voucherController.deleteVoucher);

module.exports = router;
