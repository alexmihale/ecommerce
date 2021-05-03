const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/guest-order', orderController.guestOrder);
router.post('/user-order', auth, orderController.userOrder);

module.exports = router;
