const express = require('express');
const cartController = require('../controllers/cart.controller');
const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.post('/edit', cartController.editCart);

module.exports = router;
