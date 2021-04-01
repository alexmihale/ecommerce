const express = require('express');
const { route } = require('./review.router');
const router = express.Router();
const subscribeController = require('../controllers/subscribe.controller');

router.post('/', subscribeController.subscribe);
router.delete('/', subscribeController.unsubscribe);

module.exports = router;
