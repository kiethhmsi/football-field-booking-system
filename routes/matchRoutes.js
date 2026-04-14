const express = require('express');
const router = express.Router();
const { createMatch, getOpenMatches, applyForMatch } = require('../controllers/matchController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Khách truy cập web có thể xem DS Kèo đang tìm người (Không bảo mật JWT)
router.get('/', getOpenMatches);

// Để Tạo kèo Hoặc Ứng tuyển: Bắt buộc Check JWT đăng nhập 
router.use(verifyToken);
router.post('/', createMatch);
router.post('/:matchId/apply', applyForMatch);

module.exports = router;
