-- Mock Data for Matchmaking Feature
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create Teams
INSERT INTO teams (id, name, slogan, logo_url, captain_id, skill_level)
VALUES 
(1, 'HANOI STRIKERS FC', 'Kỷ luật là sức mạnh', 'https://api.dicebear.com/7.x/identicon/svg?seed=hanoistrikers', 1, 'semi_pro'),
(2, 'Mãnh Hổ FC', 'Mãnh hổ ra quân', 'https://api.dicebear.com/7.x/identicon/svg?seed=manhho', 1, 'pro'), -- Assign to user 1 for easy testing
(3, 'Lão Tướng 8x', 'Khỏe để xây dựng Tổ quốc', 'https://api.dicebear.com/7.x/identicon/svg?seed=laotuong', 2, 'amateur');

-- 2. Create Open Matches (Kèo tìm đối thủ & tìm đồng đội)
INSERT INTO open_matches (id, team_id, match_type, title, match_date, start_time, end_time, field_id, skill_level_required, expense_sharing, side_bet, status, notes)
VALUES
(1, 1, 'find_opponent', 'Kèo giao hữu tối Chủ Nhật', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:30:00', '21:00:00', 1, 'semi_pro', 'Chia 2 tiền sân', 'Trà đá giao lưu', 'open', 'Tìm đội đá văn minh, không chơi xấu.'),
(2, 2, 'find_opponent', 'Cần đối cứng chiều Thứ 7', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '18:30:00', 11, 'pro', 'Đội thua trả tiền sân', 'Thùng bia', 'open', 'Ưu tiên các đội bóng phủi có tiếng.'),
(3, 3, 'find_teammate', 'Thiếu 2 người đá sáng CN', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', '08:30:00', 21, 'fun', 'Miễn phí', 'Vui vẻ', 'open', 'Thiếu 2 trung vệ, đá vui là chính.');

-- 3. Create some applications for testing Approval flow
-- Team 3 apply for Match 1
INSERT INTO match_applications (match_id, applicant_team_id, applicant_user_id, message, status)
VALUES (1, 3, 2, 'Đội mình muốn giao lưu với các bạn!', 'pending');

SET FOREIGN_KEY_CHECKS = 1;
