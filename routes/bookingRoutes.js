const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingDetails } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ở Phân hệ Đặt sân, toàn bộ thao tác ĐỀU BẮT BUỘC ĐĂNG NHẬP
router.use(verifyToken); 

router.post('/', createBooking); // API: POST /api/bookings
router.get('/history', getMyBookings); // API: GET /api/bookings/history
router.get('/:id', getBookingDetails); // API: GET /api/bookings/15

module.exports = router;
