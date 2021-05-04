const express = require('express');
const reviewController = require('../controllers/review.controller');
const isManager = require('../middlewares/isContentManager.middleware');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', reviewController.getReview);
router.post('/add', auth, reviewController.addReview);
router.delete(
  '/remove/:id',
  auth,
  isManager,
  reviewController.deleteReview,
);

module.exports = router;
