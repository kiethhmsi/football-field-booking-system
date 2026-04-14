const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public route: Khách vãng lai gọi
router.post('/register', register);
router.post('/login', login);

// Protected route: Bắt buộc truyền Token trên header Authorization
router.get('/me', verifyToken, getMe);

module.exports = router;
