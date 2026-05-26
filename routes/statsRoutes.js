const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/overview', statsController.getOverviewStats);
router.get('/revenue', statsController.getRevenueStats);
router.get('/test-db', async (req, res) => {
    try {
        const db = require('../config/db');
        const [rows] = await db.query("SELECT id, booking_date, status, total_price FROM bookings ORDER BY id DESC LIMIT 50");
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
