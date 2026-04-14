const express = require('express');
const router = express.Router();
const { getAllFields, getFieldById } = require('../controllers/fieldController');

// Khách vãng lai cũng có thể bấm vô App xem danh sách sân
router.get('/', getAllFields);
router.get('/:id', getFieldById);

module.exports = router;
