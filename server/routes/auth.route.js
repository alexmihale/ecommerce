const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/checkemailexist', authController.checkEmailExist);
router.post('/logout', auth, authController.logout);
router.post('/logoutall', auth, authController.logoutAll);

module.exports = router;
