const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { handleTournamentAutomation } = require('../utils/tournamentAutomation');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Cấu hình multer để lưu file tạm thời
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /xlsx|xls|csv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls, .csv)'));
    }
});

// ---------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------

// Lấy danh sách giải đấu (Tự động đếm số đội thực tế)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT t.*, 
            (SELECT COUNT(*) FROM tournament_teams tt WHERE tt.tournament_id = t.id AND tt.status = 'confirmed') as current_teams
            FROM tournaments t 
            ORDER BY t.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Download file mẫu Excel
router.get('/download-sample', (req, res) => {
    try {
        const data = [
            { 'STT': 1, 'Họ tên': 'Nguyễn Văn A', 'Số áo': 10, 'Vị trí': 'Tiền đạo', 'Số điện thoại': '0901234567' },
            { 'STT': 2, 'Họ tên': 'Trần Văn B', 'Số áo': 1, 'Vị trí': 'Thủ môn', 'Số điện thoại': '0908887776' }
        ];

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Cấu hình độ rộng cột
        worksheet['!cols'] = [
            { wch: 5 },  // STT
            { wch: 20 }, // Họ tên
            { wch: 10 }, // Số áo
            { wch: 15 }, // Vị trí
            { wch: 15 }  // SĐT
        ];

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Danh sách cầu thủ');

        // Gửi file về client
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Disposition', 'attachment; filename=Mau_Dang_Ky_Cau_Thu.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi tạo file mẫu' });
    }
});

// Chi tiết giải đấu + danh sách đội + lịch thi đấu
router.get('/:id', async (req, res) => {
    try {
        const [tournaments] = await db.execute('SELECT * FROM tournaments WHERE id = ?', [req.params.id]);
        if (tournaments.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy giải' });

        const [teams] = await db.execute(`
            SELECT tt.*, t.name, t.logo_url 
            FROM tournament_teams tt
            LEFT JOIN teams t ON tt.team_id = t.id
            WHERE tt.tournament_id = ?
        `, [req.params.id]);

        const [matches] = await db.execute(`
            SELECT tm.*, 
                   ta.name as team_a_name, ta.logo_url as team_a_logo,
                   tb.name as team_b_name, tb.logo_url as team_b_logo
            FROM tournament_matches tm
            LEFT JOIN teams ta ON tm.team_a_id = ta.id
            LEFT JOIN teams tb ON tm.team_b_id = tb.id
            WHERE tm.tournament_id = ?
            ORDER BY tm.id ASC
        `, [req.params.id]);

        res.json({ 
            success: true, 
            data: { 
                ...tournaments[0], 
                teams, 
                matches 
            } 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ---------------------------------------------------------
// USER ROUTES (Captain)
// ---------------------------------------------------------

// Đăng ký tham gia giải đấu
router.post('/:id/register', verifyToken, async (req, res) => {
    const { team_id } = req.body;
    try {
        // Kiểm tra xem đã đăng ký chưa
        const [existing] = await db.execute('SELECT * FROM tournament_teams WHERE tournament_id = ? AND team_id = ?', [req.params.id, team_id]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Đội đã đăng ký giải này rồi' });

        const [result] = await db.execute('INSERT INTO tournament_teams (tournament_id, team_id, status) VALUES (?, ?, "pending")', [req.params.id, team_id]);
        res.json({ success: true, message: 'Đăng ký thành công', registrationId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Import danh sách cầu thủ từ Excel
router.post('/import-players', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Vui lòng upload file' });

        // Đọc dữ liệu từ buffer
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sang JSON
        const rawData = xlsx.utils.sheet_to_json(worksheet);

        // Map và Validate dữ liệu
        const players = rawData.map((row, index) => {
            // Chuẩn hóa key (loại bỏ khoảng trắng, lowercase)
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toString().trim().toLowerCase()] = row[key];
            });

            // Tìm giá trị dựa trên các biến thể của tên cột
            const name = normalizedRow['họ tên'] || normalizedRow['ho ten'] || normalizedRow['name'] || normalizedRow['fullname'] || normalizedRow['tên cầu thủ'];
            const number = normalizedRow['số áo'] || normalizedRow['so ao'] || normalizedRow['number'] || normalizedRow['shirt number'];
            const position = normalizedRow['vị trí'] || normalizedRow['vi tri'] || normalizedRow['position'];
            const phone = normalizedRow['số điện thoại'] || normalizedRow['so dien thoai'] || normalizedRow['phone'] || normalizedRow['sdt'];

            if (!name || !number) {
                throw new Error(`Dòng ${index + 2}: Thiếu Họ tên hoặc Số áo bắt buộc.`);
            }

            return {
                name: name,
                number: number,
                position: position || 'N/A',
                phone: phone || 'N/A'
            };
        });

        res.json({ 
            success: true, 
            data: players,
            message: `Đã đọc thành công ${players.length} cầu thủ.`
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


// ---------------------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------------------

// Tạo giải đấu mới
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { title, banner_url, location, start_date, max_teams, prize_pool, entry_fee, rules } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO tournaments (title, banner_url, location, start_date, max_teams, prize_pool, entry_fee, rules, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'registration')
        `, [title, banner_url, location, start_date, max_teams, prize_pool, entry_fee, rules]);
        res.json({ success: true, data: { id: result.insertId } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Duyệt đội tham gia
router.patch('/registrations/:id', verifyToken, isAdmin, async (req, res) => {
    const { status } = req.body; // 'confirmed' hoặc 'rejected'
    try {
        const [reg] = await db.execute('SELECT * FROM tournament_teams WHERE id = ?', [req.params.id]);
        if (reg.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đăng ký' });

        await db.execute('UPDATE tournament_teams SET status = ? WHERE id = ?', [status, req.params.id]);
        
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Lấy toàn bộ đơn đăng ký (bao gồm cả chờ thanh toán - Dành cho Admin)
router.get('/:id/all-registrations', verifyToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT * FROM tournament_registrations 
            WHERE tournament_id = ?
            ORDER BY created_at DESC
        `, [req.params.id]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Xác nhận thủ công đơn đăng ký (Dành cho Admin khi chuyển khoản tay hoặc lỗi PayOS)
router.post('/registrations/:id/manual-confirm', verifyToken, isAdmin, async (req, res) => {
    try {
        const [regs] = await db.execute('SELECT * FROM tournament_registrations WHERE id = ?', [req.params.id]);
        if (regs.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đăng ký' });
        const reg = regs[0];

        // 1. Cập nhật trạng thái
        await db.execute('UPDATE tournament_registrations SET payment_status = "paid", registration_status = "registered" WHERE id = ?', [reg.id]);

        // 2. Tạo đội
        const [teamRes] = await db.execute('INSERT INTO teams (name, logo_url, captain_id, skill_level) VALUES (?, ?, ?, "amateur")', 
            [reg.team_name, reg.team_logo_url, reg.user_id]);
        
        // 3. Thêm vào giải
        await db.execute('INSERT INTO tournament_teams (tournament_id, team_id, status, payment_status) VALUES (?, ?, "confirmed", "paid")',
            [reg.tournament_id, teamRes.insertId]);

        // 4. CHẠY AUTOMATION: Thông báo khách, Đóng giải, Xếp lịch
        const io = req.app.get('io');
        await handleTournamentAutomation(reg.tournament_id, reg.user_id, reg.team_name, io);

        res.json({ success: true, message: 'Xác nhận thủ công thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Xóa đơn đăng ký (Hủy đơn)
router.delete('/registrations/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM tournament_registrations WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Đã xóa đơn đăng ký' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Xóa giải đấu (Dành cho Admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const tournamentId = req.params.id;
        
        // 1. Xóa các trận đấu của giải
        await db.execute('DELETE FROM tournament_matches WHERE tournament_id = ?', [tournamentId]);
        
        // 2. Xóa các đội tham gia trong giải
        await db.execute('DELETE FROM tournament_teams WHERE tournament_id = ?', [tournamentId]);
        
        // 3. Xóa các đơn đăng ký giải đấu
        await db.execute('DELETE FROM tournament_registrations WHERE tournament_id = ?', [tournamentId]);
        
        // 4. Xóa chính giải đấu
        const [result] = await db.execute('DELETE FROM tournaments WHERE id = ?', [tournamentId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy giải đấu' });
        }
        
        res.json({ success: true, message: 'Đã xóa giải đấu thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Thanh toán lệ phí
router.patch('/registrations/:id/pay', async (req, res) => {
    try {
        await db.execute('UPDATE tournament_teams SET payment_status = ? WHERE id = ?', ['paid', req.params.id]);
        res.json({ success: true, message: 'Thanh toán thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Tự động tạo lịch thi đấu (Bracket) - Knockout 8 đội
router.post('/:id/generate-bracket', verifyToken, isAdmin, async (req, res) => {
    try {
        const [teams] = await db.execute('SELECT team_id FROM tournament_teams WHERE tournament_id = ? AND status = "confirmed"', [req.params.id]);
        if (teams.length < 2) return res.status(400).json({ success: false, message: 'Cần ít nhất 2 đội để tạo lịch' });

        // Xóa lịch cũ nếu có
        await db.execute('DELETE FROM tournament_matches WHERE tournament_id = ?', [req.params.id]);

        // Trộn đội ngẫu nhiên
        const shuffled = teams.sort(() => 0.5 - Math.random());
        
        // Logic đơn giản cho 8 đội (Tứ kết -> Bán kết -> Chung kết)
        // Round: Quarter-final (4 trận), Semi-final (2 trận), Final (1 trận)
        // Chúng ta sẽ tạo các "slot" trống cho các vòng sau
        
        // Bước 1: Tạo các trận Chung kết và Bán kết trước để lấy ID làm next_match_id
        const [final] = await db.execute('INSERT INTO tournament_matches (tournament_id, round) VALUES (?, "Final")', [req.params.id]);
        const finalId = final.insertId;

        const [sf1] = await db.execute('INSERT INTO tournament_matches (tournament_id, round, next_match_id) VALUES (?, "Semi-final", ?)', [req.params.id, finalId]);
        const [sf2] = await db.execute('INSERT INTO tournament_matches (tournament_id, round, next_match_id) VALUES (?, "Semi-final", ?)', [req.params.id, finalId]);
        
        const sfIds = [sf1.insertId, sf2.insertId];

        // Bước 2: Tạo vòng đầu tiên (Tứ kết hoặc Bán kết tùy số lượng đội)
        if (shuffled.length <= 4) {
            // Chỉ có Bán kết
            for (let i = 0; i < shuffled.length; i += 2) {
                const teamA = shuffled[i].team_id;
                const teamB = shuffled[i+1] ? shuffled[i+1].team_id : null;
                const sfId = sfIds[Math.floor(i/2)];
                await db.execute('UPDATE tournament_matches SET team_a_id = ?, team_b_id = ? WHERE id = ?', [teamA, teamB, sfId]);
            }
        } else {
            // Có Tứ kết
            for (let i = 0; i < 8; i += 2) {
                const teamA = shuffled[i] ? shuffled[i].team_id : null;
                const teamB = shuffled[i+1] ? shuffled[i+1].team_id : null;
                const nextSfId = sfIds[Math.floor(i/4)];
                await db.execute('INSERT INTO tournament_matches (tournament_id, round, team_a_id, team_b_id, next_match_id) VALUES (?, "Quarter-final", ?, ?, ?)', 
                    [req.params.id, teamA, teamB, nextSfId]);
            }
        }

        await db.execute('UPDATE tournaments SET status = "ongoing" WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Đã tạo lịch thi đấu thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Cập nhật tỉ số và tiến trình Bracket
router.patch('/matches/:id', verifyToken, isAdmin, async (req, res) => {
    const { score_a, score_b, status } = req.body;
    try {
        const [matchRows] = await db.execute('SELECT * FROM tournament_matches WHERE id = ?', [req.params.id]);
        if (matchRows.length === 0) return res.status(404).json({ success: false, message: 'Trận đấu không tồn tại' });
        const match = matchRows[0];

        let winnerId = null;
        if (status === 'finished') {
            winnerId = score_a > score_b ? match.team_a_id : match.team_b_id;
        }

        await db.execute(`
            UPDATE tournament_matches 
            SET score_a = ?, score_b = ?, winner_id = ?, status = ?
            WHERE id = ?
        `, [score_a, score_b, winnerId, status, req.params.id]);

        // Nếu trận đấu kết thúc, đưa đội thắng vào trận tiếp theo
        if (status === 'finished' && match.next_match_id && winnerId) {
            const [nextMatch] = await db.execute('SELECT * FROM tournament_matches WHERE id = ?', [match.next_match_id]);
            if (nextMatch.length > 0) {
                // Kiểm tra xem điền vào team_a hay team_b của trận sau
                // Ở đây ta dùng logic đơn giản: nếu team_a rỗng thì điền A, không thì điền B
                if (!nextMatch[0].team_a_id) {
                    await db.execute('UPDATE tournament_matches SET team_a_id = ? WHERE id = ?', [winnerId, match.next_match_id]);
                } else {
                    await db.execute('UPDATE tournament_matches SET team_b_id = ? WHERE id = ?', [winnerId, match.next_match_id]);
                }
            }
        }

        // Nếu là trận chung kết, kết thúc giải đấu
        if (status === 'finished' && match.round === 'Final') {
            await db.execute('UPDATE tournaments SET status = "completed" WHERE id = ?', [match.tournament_id]);
        }

        res.json({ success: true, message: 'Cập nhật tỉ số thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
