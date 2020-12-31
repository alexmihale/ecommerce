const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, userController.getUsers);
router.post('/', userController.postUser);

module.exports = router;
