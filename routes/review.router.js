const express = require('express');
const reviewController = require('../controllers/review.controller');
const isManager = require('../middlewares/isContentManager.middleware');
const router = express.Router();

router.post('/add', reviewController.addReview);
router.delete(
  '/remove/:id',
  isManager,
  reviewController.deleteReview,
);

module.exports = router;
