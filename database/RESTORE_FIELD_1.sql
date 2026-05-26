-- ==========================================================
-- 🛠️ KHÔI PHỤC SÂN CHÍNH KASPORT
-- ==========================================================

USE sanbong;

SET FOREIGN_KEY_CHECKS = 0;

-- Đảm bảo sân số 1 tồn tại và đang Active
INSERT INTO fields (id, name, address, hotline, status, avatar_url, description)
VALUES (1, 'KaSport Complex', 'Quận 7, TP.HCM', '0901000100', 'active', 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2000', 'Sân bóng đá chất lượng cao hàng đầu khu vực.')
ON DUPLICATE KEY UPDATE status = 'active', name = 'KaSport Complex';

-- Đảm bảo có ít nhất vài sân con (Pitches) cho sân số 1
INSERT INTO pitches (id, field_id, name, type, status) VALUES 
(1, 1, 'Sân 5 - 01', '5_nguoi', 'active'),
(2, 1, 'Sân 5 - 02', '5_nguoi', 'active'),
(3, 1, 'Sân 7 - 01', '7_nguoi', 'active'),
(4, 1, 'Sân 11 - 01', '11_nguoi', 'active')
ON DUPLICATE KEY UPDATE status = 'active';

SET FOREIGN_KEY_CHECKS = 1;
