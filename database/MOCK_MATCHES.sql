-- ==========================================================
-- ⚽ DỮ LIỆU MẪU KÈO ĐẤU (3 ĐỐI THỦ + 3 ĐỒNG ĐỘI)
-- ==========================================================

USE sanbong;

-- 1. Kèo Tìm Đối Thủ (Find Opponent)
INSERT IGNORE INTO open_matches (id, team_id, creator_id, host_team_name, match_type, title, match_date, start_time, end_time, field_id, field_type, skill_level_required, status) VALUES
(101, 1, 1, 'HANOI STRIKERS', 'find_opponent', 'Kèo giao hữu sân 7 - Tối thứ 4', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', '20:30:00', 1, 'Sân 7', 'semi_pro', 'open'),
(102, 2, 1, 'Mãnh Hổ FC', 'find_opponent', 'Thử lửa tân binh - Cần đối cứng', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00:00', '19:30:00', 2, 'Sân 5', 'pro', 'open'),
(103, NULL, 2, 'FC Anh Em', 'find_opponent', 'Giao lưu vui vẻ cuối tuần', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '20:00:00', '21:30:00', 3, 'Sân 7', 'fun', 'open');

-- 2. Kèo Tìm Đồng Đội (Find Teammate)
INSERT IGNORE INTO open_matches (id, team_id, creator_id, host_team_name, match_type, title, match_date, start_time, end_time, field_id, field_type, skill_level_required, positions_needed, status) VALUES
(201, 1, 1, 'HANOI STRIKERS', 'find_teammate', 'Cần 1 Thủ môn (GK) cho trận tối nay', CURDATE(), '20:00:00', '21:30:00', 1, 'Sân 7', 'semi_pro', 'Thủ môn (GK)', 'open'),
(202, 2, 1, 'Mãnh Hổ FC', 'find_teammate', 'Tuyển 2 Hậu vệ (DF) đá giải nội bộ', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:30:00', '19:00:00', 5, 'Sân 5', 'pro', 'Hậu vệ (DF)', 'open'),
(203, NULL, 2, 'FC Văn Phòng', 'find_teammate', 'Tìm 3 Tiền đạo (FW) chạy cánh', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '19:00:00', '20:30:00', 10, 'Sân 7', 'fun', 'Tiền đạo (FW)', 'open');
