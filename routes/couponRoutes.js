const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, couponController.getAllCoupons);
router.post('/', verifyToken, isAdmin, couponController.createCoupon);
router.patch('/:id/status', verifyToken, isAdmin, couponController.updateCouponStatus);
router.delete('/:id', verifyToken, isAdmin, couponController.deleteCoupon);

module.exports = router;
