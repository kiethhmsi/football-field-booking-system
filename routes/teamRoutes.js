const express = require('express');
const router = express.Router();
const { getMyTeams, createTeam } = require('../controllers/teamController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.get('/my-teams', getMyTeams);
router.post('/', createTeam);

module.exports = router;
