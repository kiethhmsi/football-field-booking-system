-- ==========================================================
-- 🏟️ KASPORT MEGA COMPLEX SETUP (1 Cụm - 30 Sân Con)
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. LÀM SẠCH ĐỂ CẤU TRÚC LẠI
DELETE FROM time_slots WHERE field_id = 1;
DELETE FROM pitches WHERE field_id = 1;
DELETE FROM fields WHERE id IN (2, 3, 4, 5); -- Xoá các sân thừa, chỉ giữ lại Sân 1

-- 2. TẠO 10 SÂN 5 NGƯỜI (Sân 01 -> Sân 10)
INSERT INTO pitches (field_id, name, type) VALUES 
(1, 'Sân 5 - Số 01', '5_nguoi'), (1, 'Sân 5 - Số 02', '5_nguoi'), (1, 'Sân 5 - Số 03', '5_nguoi'), (1, 'Sân 5 - Số 04', '5_nguoi'), (1, 'Sân 5 - Số 05', '5_nguoi'),
(1, 'Sân 5 - Số 06', '5_nguoi'), (1, 'Sân 5 - Số 07', '5_nguoi'), (1, 'Sân 5 - Số 08', '5_nguoi'), (1, 'Sân 5 - Số 09', '5_nguoi'), (1, 'Sân 5 - Số 10', '5_nguoi');

-- 3. TẠO 10 SÂN 7 NGƯỜI (Sân 01 -> Sân 10)
INSERT INTO pitches (field_id, name, type) VALUES 
(1, 'Sân 7 - Số 01', '7_nguoi'), (1, 'Sân 7 - Số 02', '7_nguoi'), (1, 'Sân 7 - Số 03', '7_nguoi'), (1, 'Sân 7 - Số 04', '7_nguoi'), (1, 'Sân 7 - Số 05', '7_nguoi'),
(1, 'Sân 7 - Số 06', '7_nguoi'), (1, 'Sân 7 - Số 07', '7_nguoi'), (1, 'Sân 7 - Số 08', '7_nguoi'), (1, 'Sân 7 - Số 09', '7_nguoi'), (1, 'Sân 7 - Số 10', '7_nguoi');

-- 4. TẠO 10 SÂN 11 NGƯỜI (Sân 01 -> Sân 10)
INSERT INTO pitches (field_id, name, type) VALUES 
(1, 'Sân 11 - Số 01', '11_nguoi'), (1, 'Sân 11 - Số 02', '11_nguoi'), (1, 'Sân 11 - Số 03', '11_nguoi'), (1, 'Sân 11 - Số 04', '11_nguoi'), (1, 'Sân 11 - Số 05', '11_nguoi'),
(1, 'Sân 11 - Số 06', '11_nguoi'), (1, 'Sân 11 - Số 07', '11_nguoi'), (1, 'Sân 11 - Số 08', '11_nguoi'), (1, 'Sân 11 - Số 09', '11_nguoi'), (1, 'Sân 11 - Số 10', '11_nguoi');

-- 5. PHỦ KÍN KHUNG GIỜ & GIÁ CHO CẢ 3 LOẠI SÂN
-- Giá Sân 5
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '17:00:00', 'off_peak', 200000),
(1, '5_nguoi', 'weekday', '17:00:00', '23:00:00', 'peak', 400000);

-- Giá Sân 7
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '7_nguoi', 'weekday', '05:00:00', '17:00:00', 'off_peak', 500000),
(1, '7_nguoi', 'weekday', '17:00:00', '23:00:00', 'peak', 800000);

-- Giá Sân 11
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '11_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 1500000),
(1, '11_nguoi', 'weekday', '16:00:00', '23:00:00', 'peak', 2500000);

SET FOREIGN_KEY_CHECKS = 1;
