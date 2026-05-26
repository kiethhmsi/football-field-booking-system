const db = require('../config/db');

// --- 1. TẠO KÈO GIAO LƯU (OPEN MATCH) ---
const createMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Tạo kèo bởi User ID:', userId);

        const { team_id, host_team_name, match_type, title, match_date, start_time, end_time, field_id, field_type, contact_phone, skill_level_required, positions_needed, expense_sharing, side_bet, notes, current_players, max_players, booking_id } = req.body;

        const positionsNeededJson = positions_needed ? JSON.stringify(positions_needed) : null;

        // Nếu có booking_id, chúng ta sẽ ưu tiên lấy thông tin từ booking để đảm bảo tính xác thực
        let finalFieldId = field_id;
        let finalMatchDate = match_date;
        let finalStartTime = start_time;
        let finalEndTime = end_time;

        if (booking_id) {
            const [bookingInfo] = await db.execute('SELECT pitch_id, booking_date, start_time, end_time FROM bookings WHERE id = ? AND user_id = ?', [booking_id, userId]);
            if (bookingInfo.length > 0) {
                const b = bookingInfo[0];
                finalMatchDate = b.booking_date;
                finalStartTime = b.start_time;
                finalEndTime = b.end_time;
                // Lấy field_id từ pitch_id
                const [pitchInfo] = await db.execute('SELECT field_id FROM pitches WHERE id = ?', [b.pitch_id]);
                if (pitchInfo.length > 0) finalFieldId = pitchInfo[0].field_id;
            }
        }

        const [result] = await db.execute(
            `INSERT INTO open_matches 
            (team_id, creator_id, host_team_name, match_type, title, match_date, start_time, end_time, field_id, field_type, contact_phone, skill_level_required, positions_needed, expense_sharing, side_bet, notes, current_players, max_players, status, booking_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)`,
            [
                team_id || null,
                userId,
                host_team_name || null,
                match_type || 'find_opponent',
                title || 'Kèo giao hữu',
                finalMatchDate,
                finalStartTime || null,
                finalEndTime || null,
                finalFieldId || null,
                field_type || 'Sân 5',
                contact_phone || null,
                skill_level_required || 'fun',
                positionsNeededJson || null,
                expense_sharing || null,
                side_bet || null,
                notes || null,
                current_players || 0,
                max_players || 1,
                booking_id || null
            ]
        );
        res.status(201).json({ 
            message: 'Tạo Kèo đấu thành công!', 
            matchId: result.insertId 
        });
    } catch (err) {
        console.error('LỖI TẠO KÈO:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 0. TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI (HẾT GIỜ / ĐỦ NGƯỜI) ---
const checkExpiredMatches = async () => {
    try {
        // 1. Lấy danh sách các kèo sắp bị hủy để gửi thông báo
        const [expiredMatches] = await db.execute(`
            SELECT id, creator_id, title 
            FROM open_matches 
            WHERE status = 'open' 
            AND (
                match_date < CURDATE() 
                OR (match_date = CURDATE() AND start_time < CURTIME())
            )
        `);

        if (expiredMatches.length > 0) {
            const { createNotification } = require('./notificationController');
            for (const match of expiredMatches) {
                await createNotification(
                    match.creator_id,
                    'Kèo đấu đã hết hạn',
                    `Kèo "${match.title}" của bạn đã tự động bị hủy do quá thời gian bắt đầu.`,
                    'system'
                );
            }

            // 2. Cập nhật trạng thái trong DB
            await db.execute(`
                UPDATE open_matches 
                SET status = 'cancelled' 
                WHERE status = 'open' 
                AND (
                    match_date < CURDATE() 
                    OR (match_date = CURDATE() AND start_time < CURTIME())
                )
            `);
        }
    } catch (err) {
        console.error('Lỗi checkExpiredMatches:', err);
    }
};

// --- 2. LẤY DS KÈO ĐANG MỞ (TÌM ĐỐI THỦ / TÌM NGƯỜI) ---
const getOpenMatches = async (req, res) => {
    try {
        await checkExpiredMatches(); // Chạy kiểm tra hết hạn trước khi lấy danh sách
        const { match_type, skill_level, field_type } = req.query;

        // --- PHÂN QUYỀN VIP (PHƯƠNG ÁN 1: NHẬN KÈO SỚM 30 PHÚT) ---
        let isUserVip = false;
        try {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
                const [userInfo] = await db.execute('SELECT is_vip FROM users WHERE id = ?', [decoded.id]);
                if (userInfo.length > 0 && userInfo[0].is_vip === 1) {
                    isUserVip = true;
                }
            }
        } catch (err) {
            // Cho phép xem các kèo thường nếu không có token hoặc token không hợp lệ
        }
        
        let query = `
            SELECT m.*, 
                   COALESCE(t.name, m.host_team_name) as team_name, 
                   t.logo_url as team_logo, 
                   f.name as field_name,
                   p.name as pitch_name,
                   u.is_vip as creator_is_vip,
                   (SELECT COUNT(*) FROM match_applications WHERE match_id = m.id AND status = 'accepted') as accepted_count
            FROM open_matches m
            LEFT JOIN teams t ON m.team_id = t.id
            LEFT JOIN fields f ON m.field_id = f.id
            LEFT JOIN bookings b ON m.booking_id = b.id
            LEFT JOIN pitches p ON b.pitch_id = p.id
            LEFT JOIN users u ON m.creator_id = u.id
            WHERE m.status = 'open'
        `;
        const params = [];

        // Nếu KHÔNG phải VIP, ẩn các kèo được tạo dưới 30 phút (Nhận kèo sớm 30p của VIP)
        if (!isUserVip) {
            query += ' AND m.created_at <= DATE_SUB(NOW(), INTERVAL 30 MINUTE)';
        }

        if (match_type) {
            query += ' AND m.match_type = ?';
            params.push(match_type);
        }
        if (skill_level) {
            query += ' AND m.skill_level_required = ?';
            params.push(skill_level);
        }
        if (field_type) {
            query += ' AND m.field_type = ?';
            params.push(field_type);
        }

        // Ưu tiên hiển thị VIP lên đầu tiên, sau đó mới đến ngày và giờ
        query += ' ORDER BY u.is_vip DESC, m.match_date ASC, m.start_time ASC';

        const [matches] = await db.execute(query, params);

        res.json({ message: 'Lấy danh sách các kèo thành công', data: matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 3. GỬI ĐƠN ỨNG TUYỂN KÈO ---
const applyForMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const { matchId } = req.params;
        const { applicant_team_id, applicant_team_name, applicant_skill_level, message, contact_phone } = req.body; 

        // 1. Insert đơn ứng tuyển
        await db.execute(
            `INSERT INTO match_applications 
            (match_id, applicant_team_id, applicant_team_name, applicant_skill_level, applicant_user_id, message, contact_phone, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [matchId, applicant_team_id || null, applicant_team_name || null, applicant_skill_level || null, userId, message, contact_phone || null]
        );

        // 2. Lấy thông tin chủ kèo và tên người ứng tuyển để gửi thông báo
        const [matchInfo] = await db.execute(`
            SELECT m.creator_id, m.title, u.full_name as applicant_name 
            FROM open_matches m
            JOIN users u ON u.id = ?
            WHERE m.id = ?
        `, [userId, matchId]);

        if (matchInfo.length > 0) {
            const { creator_id, title, applicant_name } = matchInfo[0];
            const { createNotification } = require('./notificationController');
            
            const io = req.app.get('io');
            await createNotification(
                creator_id,
                'Yêu cầu giao lưu mới',
                `${applicant_name} vừa gửi lời mời thách đấu cho trận "${title}". Hãy kiểm tra ngay!`,
                'new_application',
                io
            );
        }

        res.status(201).json({ message: 'Gửi yêu cầu nhận Kèo thành công! Đang chờ đối phương duyệt.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 4. LẤY DS KÈO CỦA TÔI ---
const getMyMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const [matches] = await db.execute(`
            SELECT 
                m.*, 
                COALESCE(t.name, m.host_team_name) as team_name, 
                t.logo_url as team_logo,
                (SELECT COUNT(*) FROM match_applications WHERE match_id = m.id) as app_count,
                (SELECT COUNT(*) FROM match_applications WHERE match_id = m.id AND status = 'accepted') as accepted_count
            FROM open_matches m
            LEFT JOIN teams t ON m.team_id = t.id
            WHERE m.creator_id = ? OR t.captain_id = ?
            ORDER BY m.created_at DESC
        `, [userId, userId]);

        res.json({ message: 'Thành công', data: matches });
    } catch (err) {
        console.error('LỖI LẤY KÈO CỦA TÔI:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 5. LẤY DANH SÁCH ĐƠN ỨNG TUYỂN ---
const getMatchApplications = async (req, res) => {
    try {
        const { matchId } = req.params;
        const [apps] = await db.execute(`
            SELECT a.*, 
                   COALESCE(t.name, a.applicant_team_name) as display_team_name, 
                   t.logo_url as applicant_team_logo, 
                   u.full_name as applicant_user_name
            FROM match_applications a
            LEFT JOIN teams t ON a.applicant_team_id = t.id
            LEFT JOIN users u ON a.applicant_user_id = u.id
            WHERE a.match_id = ?
        `, [matchId]);

        res.json({ message: 'Thành công', data: apps });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 6. DUYỆT / TỪ CHỐI ĐƠN ỨNG TUYỂN ---
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const [appDetails] = await db.execute(`
            SELECT a.applicant_user_id, a.match_id, m.title, m.host_team_name, t.name as team_name, m.match_type
            FROM match_applications a
            JOIN open_matches m ON a.match_id = m.id
            LEFT JOIN teams t ON m.team_id = t.id
            WHERE a.id = ?
        `, [applicationId]);

        if (appDetails.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển' });
        }

        const { applicant_user_id, match_id, title, host_team_name, team_name, match_type } = appDetails[0];
        const displayHostName = team_name || host_team_name || 'Một đội bóng';

        await db.execute(
            'UPDATE match_applications SET status = ? WHERE id = ?',
            [status, applicationId]
        );

        const { createNotification } = require('./notificationController');
        if (status === 'accepted') {
            const subject = match_type === 'find_teammate' ? 'Chúc mừng! Bạn đã được chấp nhận vào đội' : 'Chúc mừng! Lời mời thách đấu đã được chấp nhận';
            const message = match_type === 'find_teammate' 
                ? `Đội ${displayHostName} đã chấp nhận đơn ứng tuyển của bạn cho trận đấu "${title}". Hãy liên hệ chủ kèo để chốt vị trí nhé!`
                : `Đội ${displayHostName} đã chấp nhận lời mời giao lưu của bạn cho trận đấu "${title}". Hãy liên hệ để chốt thời gian nhé!`;

            const io = req.app.get('io');
            await createNotification(
                applicant_user_id,
                subject,
                message,
                'match_accepted',
                io
            );

            // LOGIC: Tự động matched
            if (match_type === 'find_opponent') {
                await db.execute('UPDATE open_matches SET status = "matched" WHERE id = ?', [match_id]);
            } else {
                const [matchInfo] = await db.execute('SELECT current_players, max_players FROM open_matches WHERE id = ?', [match_id]);
                const { current_players, max_players } = matchInfo[0];

                const [acceptedApps] = await db.execute(
                    'SELECT COUNT(*) as count FROM match_applications WHERE match_id = ? AND status = "accepted"',
                    [match_id]
                );

                if ((current_players + acceptedApps[0].count) >= max_players) {
                    await db.execute('UPDATE open_matches SET status = "matched" WHERE id = ?', [match_id]);
                }
            }
        } else {
            const subject = match_type === 'find_teammate' ? 'Rất tiếc! Đơn gia nhập đội bị từ chối' : 'Rất tiếc! Lời mời thách đấu bị từ chối';
            const message = match_type === 'find_teammate'
                ? `Đội ${displayHostName} đã từ chối đơn ứng tuyển gia nhập của bạn cho trận đấu "${title}". Đừng buồn, hãy tìm đội khác nhé!`
                : `Đội ${displayHostName} đã từ chối lời mời giao lưu của bạn cho trận đấu "${title}". Đừng buồn, hãy tìm đối thủ khác nhé!`;

            const io = req.app.get('io');
            await createNotification(
                applicant_user_id,
                subject,
                message,
                'match_rejected',
                io
            );
        }

        res.json({ message: `Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} đơn ứng tuyển` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 7. LẤY CHI TIẾT 1 KÈO ---
const getMatchById = async (req, res) => {
    try {
        const { matchId } = req.params;
        const [matches] = await db.execute(`
            SELECT m.*, 
                   COALESCE(t.name, m.host_team_name) as team_name, 
                   t.logo_url as team_logo, 
                   f.name as field_name, 
                   f.address as field_address,
                   u.is_vip as creator_is_vip
            FROM open_matches m
            LEFT JOIN teams t ON m.team_id = t.id
            LEFT JOIN fields f ON m.field_id = f.id
            LEFT JOIN users u ON m.creator_id = u.id
            WHERE m.id = ?
        `, [matchId]);

        if (matches.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy kèo đấu' });
        }

        res.json({ message: 'Thành công', data: matches[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 8. XÓA KÈO ĐẤU ---
const deleteMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [matches] = await db.execute('SELECT creator_id FROM open_matches WHERE id = ?', [matchId]);
        
        if (matches.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy kèo đấu' });
        }

        const match = matches[0];

        if (match.creator_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa kèo này' });
        }

        await db.execute('DELETE FROM match_applications WHERE match_id = ?', [matchId]);
        await db.execute('DELETE FROM open_matches WHERE id = ?', [matchId]);

        res.json({ message: 'Đã xóa kèo thành công' });
    } catch (err) {
        console.error('LỖI XÓA KÈO:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { 
    createMatch, 
    getOpenMatches, 
    applyForMatch,
    getMyMatches, 
    getMatchApplications, 
    updateApplicationStatus,
    getMatchById,
    deleteMatch
};
