const express = require('express');
const router = express.Router();
const payosController = require('../controllers/payosController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route tạo link thanh toán (Cần đăng nhập)
router.post('/create-payment-link', verifyToken, payosController.createPaymentLink);

// Route Webhook (Không cần protect vì PayOS gọi trực tiếp, dùng verify trong controller)
router.post('/webhook', payosController.handleWebhook);

module.exports = router;
