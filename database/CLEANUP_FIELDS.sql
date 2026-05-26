-- ==========================================================
-- 🧹 DỌN DẸP DATABASE - CHỈ GIỮ LẠI 1 SÂN DUY NHẤT
-- ==========================================================

USE sanbong;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Xóa các sân (fields) từ ID 2 trở đi
DELETE FROM fields WHERE id > 1;

-- 2. Xóa các sân con (pitches) thuộc về các sân đã xóa
DELETE FROM pitches WHERE field_id > 1;

-- 3. Xóa các khung giờ (time_slots) thuộc về các sân đã xóa
DELETE FROM time_slots WHERE field_id > 1;

-- 4. Xóa các tiện ích liên quan
DELETE FROM field_amenities WHERE field_id > 1;

-- 5. Xóa các booking liên quan đến sân đã xóa (nếu có)
DELETE FROM bookings WHERE pitch_id NOT IN (SELECT id FROM pitches WHERE field_id = 1);

SET FOREIGN_KEY_CHECKS = 1;

-- Cập nhật lại tên sân số 1 cho chuẩn thương hiệu bạn muốn
UPDATE fields SET name = 'KaSport Complex' WHERE id = 1;
