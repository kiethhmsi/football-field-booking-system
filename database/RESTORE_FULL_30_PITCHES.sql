-- ==========================================================
-- 🚀 KHÔI PHỤC ĐẦY ĐỦ 30 SÂN CON CHO KASPORT COMPLEX (10 - 10 - 10)
-- ==========================================================

USE sanbong;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Đảm bảo sân chính ID 1 tồn tại
INSERT INTO fields (id, name, address, hotline, status, avatar_url, description)
VALUES (1, 'KaSport Complex', 'Quận 7, TP.HCM', '0901000100', 'active', 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2000', 'Sân bóng đá chất lượng cao hàng đầu khu vực.')
ON DUPLICATE KEY UPDATE status = 'active', name = 'KaSport Complex';

-- 2. Xóa các sân cũ để nạp lại cho sạch
DELETE FROM pitches WHERE field_id = 1;

-- 3. Nạp lại 30 sân con (10 sân 5, 10 sân 7, 10 sân 11)
INSERT INTO pitches (id, field_id, name, type, status) VALUES
-- 10 Sân 5 người
(1, 1, 'Sân 5 - 01', '5_nguoi', 'active'),
(2, 1, 'Sân 5 - 02', '5_nguoi', 'active'),
(3, 1, 'Sân 5 - 03', '5_nguoi', 'active'),
(4, 1, 'Sân 5 - 04', '5_nguoi', 'active'),
(5, 1, 'Sân 5 - 05', '5_nguoi', 'active'),
(6, 1, 'Sân 5 - 06', '5_nguoi', 'active'),
(7, 1, 'Sân 5 - 07', '5_nguoi', 'active'),
(8, 1, 'Sân 5 - 08', '5_nguoi', 'active'),
(9, 1, 'Sân 5 - 09', '5_nguoi', 'active'),
(10, 1, 'Sân 5 - 10', '5_nguoi', 'active'),
-- 10 Sân 7 người
(11, 1, 'Sân 7 - 01', '7_nguoi', 'active'),
(12, 1, 'Sân 7 - 02', '7_nguoi', 'active'),
(13, 1, 'Sân 7 - 03', '7_nguoi', 'active'),
(14, 1, 'Sân 7 - 04', '7_nguoi', 'active'),
(15, 1, 'Sân 7 - 05', '7_nguoi', 'active'),
(16, 1, 'Sân 7 - 06', '7_nguoi', 'active'),
(17, 1, 'Sân 7 - 07', '7_nguoi', 'active'),
(18, 1, 'Sân 7 - 08', '7_nguoi', 'active'),
(19, 1, 'Sân 7 - 09', '7_nguoi', 'active'),
(20, 1, 'Sân 7 - 10', '7_nguoi', 'active'),
-- 10 Sân 11 người
(21, 1, 'Sân 11 - 01', '11_nguoi', 'active'),
(22, 1, 'Sân 11 - 02', '11_nguoi', 'active'),
(23, 1, 'Sân 11 - 03', '11_nguoi', 'active'),
(24, 1, 'Sân 11 - 04', '11_nguoi', 'active'),
(25, 1, 'Sân 11 - 05', '11_nguoi', 'active'),
(26, 1, 'Sân 11 - 06', '11_nguoi', 'active'),
(27, 1, 'Sân 11 - 07', '11_nguoi', 'active'),
(28, 1, 'Sân 11 - 08', '11_nguoi', 'active'),
(29, 1, 'Sân 11 - 09', '11_nguoi', 'active'),
(30, 1, 'Sân 11 - 10', '11_nguoi', 'active');

SET FOREIGN_KEY_CHECKS = 1;
