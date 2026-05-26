const db = require('../config/db');

// --- 1. LẤY DANH SÁCH ĐỘI BÓNG CỦA TÔI (Dành cho Captain) ---
const getMyTeams = async (req, res) => {
    try {
        const userId = req.user.id;
        const [teams] = await db.execute(
            'SELECT * FROM teams WHERE captain_id = ?',
            [userId]
        );
        res.json({ message: 'Thành công', data: teams });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. TẠO ĐỘI BÓNG MỚI ---
const createTeam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, slogan, logo_url, skill_level } = req.body;

        const [result] = await db.execute(
            `INSERT INTO teams (name, slogan, logo_url, captain_id, skill_level) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, slogan || '', logo_url || '', userId, skill_level || 'amateur']
        );

        // Tự động thêm Captain vào bảng team_members
        await db.execute(
            'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, "captain")',
            [result.insertId, userId]
        );

        res.status(201).json({ 
            message: 'Tạo đội bóng thành công!', 
            teamId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getMyTeams, createTeam };
