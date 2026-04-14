const express = require('express');
const router = express.Router();
const { getAllNews, getNewsDetail } = require('../controllers/newsController');

// Không block bởi JWT Token vì ai vào web cũng đều được coi tin tức
router.get('/', getAllNews);
router.get('/:slug', getNewsDetail);

module.exports = router;
