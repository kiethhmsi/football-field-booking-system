-- Inject Mock Data for Opponent/Teammate Finding
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create some teams first
INSERT INTO teams (name, slogan, logo_url, captain_id, skill_level)
VALUES 
('HANOI STRIKERS FC', 'Kỷ luật là sức mạnh', 'https://api.dicebear.com/7.x/identicon/svg?seed=hanoistrikers', 1, 'semi_pro'),
('Mãnh Hổ FC', 'Mãnh hổ ra quân', 'https://api.dicebear.com/7.x/identicon/svg?seed=manhho', 6, 'pro'),
('Lão Tướng 8x', 'Khỏe để xây dựng Tổ quốc', 'https://api.dicebear.com/7.x/identicon/svg?seed=laotuong', 10, 'amateur');

-- 2. Create some open matches
INSERT INTO open_matches (team_id, match_type, title, match_date, start_time, end_time, field_id, skill_level_required, expense_sharing, side_bet, status)
VALUES
(1, 'find_opponent', 'Kèo giao hữu tối Chủ Nhật', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:30:00', '21:00:00', 1, 'semi_pro', 'Chia 2 tiền sân', 'Trà đá giao lưu', 'open'),
(2, 'find_opponent', 'Cần đối cứng chiều Thứ 7', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '18:30:00', 11, 'pro', 'Đội thua trả tiền sân', 'Thùng bia', 'open'),
(3, 'find_teammate', 'Thiếu 2 người đá sáng CN', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', '08:30:00', 21, 'fun', 'Miễn phí', 'Vui vẻ', 'open');

SET FOREIGN_KEY_CHECKS = 1;
