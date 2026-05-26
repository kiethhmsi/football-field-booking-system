const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', verifyToken, isAdmin, maintenanceController.getAllMaintenance);
router.post('/', verifyToken, isAdmin, maintenanceController.createMaintenance);
router.patch('/:id/status', verifyToken, isAdmin, maintenanceController.updateMaintenanceStatus);
router.delete('/:id', verifyToken, isAdmin, maintenanceController.deleteMaintenance);

module.exports = router;
