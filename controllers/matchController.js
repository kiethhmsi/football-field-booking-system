const db = require('../config/db');

// --- 1. TẠO KÈO GIAO LƯU (OPEN MATCH) ---
const createMatch = async (req, res) => {
    try {
        const { team_id, match_type, title, match_date, start_time, end_time, field_id, skill_level_required, positions_needed, expense_sharing, side_bet, notes } = req.body;

        // positions_needed (Cho kiểu kèo "Tìm Đồng Đội") được gửi lên dạng mảng ['ST', 'GK'], chuyển về JSON String lưu DB
        const positionsNeededJson = positions_needed ? JSON.stringify(positions_needed) : null;

        const [result] = await db.execute(
            `INSERT INTO open_matches 
            (team_id, match_type, title, match_date, start_time, end_time, field_id, skill_level_required, positions_needed, expense_sharing, side_bet, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
            [team_id, match_type, title, match_date, start_time, end_time, field_id || null, skill_level_required, positionsNeededJson, expense_sharing, side_bet, notes]
        );

        res.status(201).json({ 
            message: 'Tạo Kèo đấu thành công. Mọi người đã thấy kèo của bạn trên trang chù!', 
            matchId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. LẤY DS KÈO ĐANG MỞ (TÌM ĐỐI THỦ / TÌM NGƯỜI) ---
const getOpenMatches = async (req, res) => {
    try {
        const { match_type, skill_level } = req.query; // Loại kèo: 'find_opponent' hoặc 'find_teammate'
        
        let query = `
            SELECT m.*, t.name as team_name, t.logo_url as team_logo, f.name as field_name 
            FROM open_matches m
            LEFT JOIN teams t ON m.team_id = t.id
            LEFT JOIN fields f ON m.field_id = f.id
            WHERE m.status = 'open'
        `;
        const params = [];

        if (match_type) {
            query += ' AND m.match_type = ?';
            params.push(match_type);
        }
        if (skill_level) {
            query += ' AND m.skill_level_required = ?';
            params.push(skill_level);
        }

        query += ' ORDER BY m.match_date ASC, m.start_time ASC'; // Ưu tiên trận nào sắp đá cho lên đầu

        const [matches] = await db.execute(query, params);

        res.json({ message: 'Lấy danh sách các kèo thành công', data: matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 3. GỬI ĐƠN ỨNG TUYỂN KÈO (Tới Đội trưởng) ---
const applyForMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const { matchId } = req.params;
        const { applicant_team_id, message } = req.body; 

        // Nếu team 1 tìm team khác thách đấu -> Truyền id đội mình đi ứng tuyển
        // Nếu cá nhân tìm đồng đội để xin vào đá chung -> Không cần truyền applicant_team_id

        const [result] = await db.execute(
            `INSERT INTO match_applications 
            (match_id, applicant_team_id, applicant_user_id, message, status) 
            VALUES (?, ?, ?, ?, 'pending')`,
            [matchId, applicant_team_id || null, userId, message]
        );

        res.status(201).json({ message: 'Gửi yêu cầu nhận Kèo thành công! Đang chờ đối phương duyệt.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { createMatch, getOpenMatches, applyForMatch };
