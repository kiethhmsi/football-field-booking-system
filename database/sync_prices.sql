-- ==========================================================
-- 💰 KASPORT PRICE SYNC (Based on frontend constants)
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Xoá bảng giá cũ của KaSport Premium Complex (ID 1)
DELETE FROM time_slots WHERE field_id = 1;

-- 2. Nạp giá Sân 5 (Dựa trên PITCH_PRICING)
-- Ngày thường
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 180000),
(1, '5_nguoi', 'weekday', '16:00:00', '23:59:59', 'peak', 250000);
-- Cuối tuần
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekend', '05:00:00', '16:00:00', 'off_peak', 200000),
(1, '5_nguoi', 'weekend', '16:00:00', '23:59:59', 'peak', 350000);

-- 3. Nạp giá Sân 7
-- Ngày thường
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '7_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 350000),
(1, '7_nguoi', 'weekday', '16:00:00', '23:59:59', 'peak', 500000);
-- Cuối tuần
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '7_nguoi', 'weekend', '05:00:00', '16:00:00', 'off_peak', 450000),
(1, '7_nguoi', 'weekend', '16:00:00', '23:59:59', 'peak', 600000);

-- 4. Nạp giá Sân 11
-- Ngày thường
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '11_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 800000),
(1, '11_nguoi', 'weekday', '16:00:00', '23:59:59', 'peak', 1200000);
-- Cuối tuần
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '11_nguoi', 'weekend', '05:00:00', '16:00:00', 'off_peak', 1000000),
(1, '11_nguoi', 'weekend', '16:00:00', '23:59:59', 'peak', 1500000);

SET FOREIGN_KEY_CHECKS = 1;
