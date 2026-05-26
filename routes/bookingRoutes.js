const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingDetails, getAllBookings, updateBookingStatus, cancelBooking, confirmPayment, createMatchmakingBooking } = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Ở Phân hệ Đặt sân, toàn bộ thao tác ĐỀU BẮT BUỘC ĐĂNG NHẬP
router.use(verifyToken); 

router.post('/', createBooking); // API: POST /api/bookings
router.post('/create-matchmaking', createMatchmakingBooking); // API: POST /api/bookings/create-matchmaking
router.get('/history', getMyBookings); // API: GET /api/bookings/history
router.put('/cancel/:id', cancelBooking); // API: PUT /api/bookings/cancel/15
router.put('/payment-confirm/:id', confirmPayment); // API: PUT /api/bookings/payment-confirm/15

// Tuyến đường cho Quản trị viên (Admin)
router.get('/admin/all', isAdmin, getAllBookings); // API: GET /api/bookings/admin/all
router.patch('/admin/status/:id', isAdmin, updateBookingStatus); // API: PATCH /api/bookings/admin/status/15
router.get('/:id', getBookingDetails); // API: GET /api/bookings/15

module.exports = router;
