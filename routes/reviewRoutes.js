const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/latest', reviewController.getLatestReviews);
router.post('/', verifyToken, reviewController.createReview);

module.exports = router;
