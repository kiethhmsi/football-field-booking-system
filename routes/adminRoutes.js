const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

// Tuyến đường lấy thống kê tổng quan (Chỉ Admin mới được vào)
router.get('/stats/overview', verifyToken, isAdmin, adminController.getOverviewStats);
router.get('/bookings', verifyToken, isAdmin, adminController.getAllBookings);
router.patch('/bookings/:id/status', verifyToken, isAdmin, adminController.updateBookingStatus);
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, adminController.getUserDetails);
router.post('/users', verifyToken, isAdmin, adminController.createUser);
router.patch('/users/:id/status', verifyToken, isAdmin, adminController.updateUserStatus);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);
router.patch('/bookings/:id/check-in', verifyToken, isAdmin, adminController.updateCheckInStatus);
router.put('/bookings/:id', verifyToken, isAdmin, adminController.updateBooking);
router.get('/staff', verifyToken, isAdmin, adminController.getAllStaff);

module.exports = router;
