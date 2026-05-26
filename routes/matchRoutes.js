const express = require('express');
const router = express.Router();
const { 
    createMatch, 
    getOpenMatches, 
    applyForMatch, 
    getMyMatches, 
    getMatchApplications, 
    updateApplicationStatus,
    getMatchById 
} = require('../controllers/matchController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Khách truy cập web có thể xem DS Kèo đang tìm người
router.get('/', getOpenMatches);

// Các route tĩnh cần đặt TRƯỚC các route có tham số (như :matchId)
router.get('/my-matches', verifyToken, getMyMatches);

router.get('/:matchId', getMatchById);

// Để Tạo kèo Hoặc Ứng tuyển: Bắt buộc Check JWT đăng nhập 
router.post('/', verifyToken, createMatch);
router.get('/:matchId/applications', verifyToken, getMatchApplications);
router.patch('/applications/:applicationId', verifyToken, updateApplicationStatus);
router.post('/:matchId/apply', verifyToken, applyForMatch);
router.delete('/:matchId', verifyToken, require('../controllers/matchController').deleteMatch);

module.exports = router;
