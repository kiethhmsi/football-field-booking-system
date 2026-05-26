const express = require('express');
const router = express.Router();
const { handleChat, testKey } = require('../controllers/aiController');

router.post('/chat', handleChat);
router.get('/test-key', testKey);

module.exports = router;
