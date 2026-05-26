const db = require('../config/db');
const { createNotification } = require('../controllers/notificationController');

/**
 * Kiểm tra và thực hiện các tác vụ tự động khi một đội được xác nhận tham gia giải đấu
 * 1. Đóng đăng ký nếu đủ đội
 * 2. Tự động xếp lịch thi đấu (Bracket)
 * 3. Gửi thông báo cho người dùng
 */
const handleTournamentAutomation = async (tournamentId, userId, teamName, io) => {
    try {
        // 1. Lấy thông tin giải đấu
        const [tournaments] = await db.execute('SELECT * FROM tournaments WHERE id = ?', [tournamentId]);
        if (tournaments.length === 0) return;
        const tournament = tournaments[0];

        // 2. Gửi thông báo cho người dùng vừa đăng ký thành công
        await createNotification(
            userId, 
            '🏆 Đăng ký giải đấu thành công', 
            `Đội ${teamName} đã chính thức tham gia giải ${tournament.title}. Hãy chuẩn bị thi đấu!`, 
            'tournament',
            io
        );

        // 3. Đếm số đội đã xác nhận
        const [confirmedTeams] = await db.execute(
            'SELECT * FROM tournament_teams WHERE tournament_id = ? AND status = "confirmed"',
            [tournamentId]
        );

        console.log(`[Tournament Automation] Giải ${tournament.title}: ${confirmedTeams.length}/${tournament.max_teams} đội.`);

        // 4. Nếu đủ đội -> Đóng đăng ký & Tự động xếp lịch
        if (confirmedTeams.length >= tournament.max_teams) {
            console.log(`🚀 [Tournament Automation] Giải đấu đã ĐỦ ĐỘI. Bắt đầu tự động xếp lịch...`);

            // Cập nhật trạng thái giải đấu
            await db.execute('UPDATE tournaments SET status = "ongoing" WHERE id = ?', [tournamentId]);

            // THUẬT TOÁN TỰ ĐỘNG XẾP LỊCH (BRACKET GENERATION)
            const teams = confirmedTeams;
            const shuffled = teams.sort(() => 0.5 - Math.random());
            
            // Tạo Trận Chung kết trước
            const [finalRes] = await db.execute(
                'INSERT INTO tournament_matches (tournament_id, round, status) VALUES (?, "Final", "pending")',
                [tournamentId]
            );
            const finalId = finalRes.insertId;

            // Tạo 2 trận Bán kết
            const sfIds = [];
            for (let i = 0; i < 2; i++) {
                const [sfRes] = await db.execute(
                    'INSERT INTO tournament_matches (tournament_id, round, status, next_match_id) VALUES (?, "Semi-final", "pending", ?)',
                    [tournamentId, finalId]
                );
                sfIds.push(sfRes.insertId);
            }

            if (tournament.max_teams <= 4) {
                // Xếp ngay vào Bán kết
                for (let i = 0; i < shuffled.length; i += 2) {
                    const teamA = shuffled[i].team_id;
                    const teamB = shuffled[i+1] ? shuffled[i+1].team_id : null;
                    const sfId = sfIds[Math.floor(i/2)];
                    await db.execute(
                        'UPDATE tournament_matches SET team_a_id = ?, team_b_id = ?, status = "scheduled" WHERE id = ?',
                        [teamA, teamB, sfId]
                    );
                }
            } else {
                // Tạo 4 trận Tứ kết (Cho giải 8 đội)
                for (let i = 0; i < 8; i += 2) {
                    const teamA = shuffled[i] ? shuffled[i].team_id : null;
                    const teamB = shuffled[i+1] ? shuffled[i+1].team_id : null;
                    const nextSfId = sfIds[Math.floor(i/4)];
                    await db.execute(
                        'INSERT INTO tournament_matches (tournament_id, round, team_a_id, team_b_id, status, next_match_id) VALUES (?, "Quarter-final", ?, ?, "scheduled", ?)', 
                        [tournamentId, teamA, teamB, nextSfId]
                    );
                }
            }

            // Thông báo toàn hệ thống giải đấu đã bắt đầu
            if (io) {
                io.emit('new_notification', {
                    title: '🔥 Giải đấu bắt đầu!',
                    message: `Giải ${tournament.title} đã đủ đội và bắt đầu xếp lịch thi đấu.`,
                    type: 'system'
                });
            }
        }

    } catch (err) {
        console.error('[Tournament Automation Error]:', err);
    }
};

module.exports = { handleTournamentAutomation };
