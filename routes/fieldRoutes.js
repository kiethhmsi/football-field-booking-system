const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { 
    getAllFields, 
    getFieldById, 
    adminGetAllPitches,
    createPitch,
    updatePitch,
    deletePitch,
    togglePitchStatus,
    adminGetAllFields,
    getTopBookedPitches
} = require('../controllers/fieldController');

const {
    getTimeSlotsByField,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlotStatus,
    getAvailableSlots
} = require('../controllers/timeSlotController');

// Khách vãng lai xem danh sách 30 sân con
router.get('/', getAllFields);
router.get('/top-booked', getTopBookedPitches);
router.get('/admin/availability', getAvailableSlots);

// Admin lấy danh sách 30 sân con để quản trị
router.get('/admin/pitches', adminGetAllPitches);
router.post('/admin/pitches', createPitch);
router.put('/admin/pitches/:id', updatePitch);
router.delete('/admin/pitches/:id', deletePitch);
router.patch('/admin/pitches/:id/status', togglePitchStatus);

// Admin quản lý khung giờ
router.get('/admin/fields', adminGetAllFields);
router.get('/admin/time-slots/:fieldId', getTimeSlotsByField);
router.post('/admin/time-slots', createTimeSlot);
router.put('/admin/time-slots/:id', updateTimeSlot);
router.delete('/admin/time-slots/:id', deleteTimeSlot);
router.patch('/admin/time-slots/:id/status', verifyToken, isAdmin, toggleTimeSlotStatus);

router.get('/:id', getFieldById);

module.exports = router;
