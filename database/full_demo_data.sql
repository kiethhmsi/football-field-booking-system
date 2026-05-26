-- ==========================================================
-- 💉 KASPORT MASTER DEMO DATA (BẢN FINAL - CHẠY LÀ ĐƯỢC)
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE match_applications;
TRUNCATE TABLE open_matches;
TRUNCATE TABLE team_members;
TRUNCATE TABLE teams;
TRUNCATE TABLE news;
TRUNCATE TABLE reviews;
TRUNCATE TABLE bookings;
TRUNCATE TABLE coupons;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE field_amenities;
TRUNCATE TABLE amenities;   
TRUNCATE TABLE pitches;
TRUNCATE TABLE fields;
TRUNCATE TABLE users;

-- 1. USERS
INSERT INTO users (id, full_name, phone_number, email, password, role, status, created_at) VALUES 
(1, 'Admin KaSport', '0123456789', 'admin@kasport.vn', '$2b$10$Epj9NoBv6pE0g0.g0.g0.uG7R8mN99iWp0m.fR0Z1E8f9f8f9f8f9', 'admin', 'active', NOW()),
(2, 'Nguyễn Hoàng Nam', '0987654321', 'nam.hoang@gmail.com', '$2b$10$Epj9NoBv6pE0g0.g0.g0.uG7R8mN99iWp0m.fR0Z1E8f9f8f9f8f9', 'customer', 'active', NOW());

-- 2. FIELDS
INSERT INTO fields (id, owner_id, name, address, description, avatar_url, status) VALUES 
(1, 1, 'HKSPORT Premium Complex', '123 Đường Số 7, Quận 7, TP. Hồ Chí Minh', 'Tổ hợp thể thao tiêu chuẩn FIFA với hệ thống 30 sân cỏ nhân tạo cao cấp.', 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=1200', 'active');

-- 3. AMENITIES
INSERT INTO amenities (id, name, icon) VALUES (1, 'Wifi', 'wifi'), (2, 'Đậu xe', 'car'), (3, 'Căng tin', 'coffee'), (4, 'Phòng tắm', 'shower');
INSERT INTO field_amenities (field_id, amenity_id) VALUES (1,1), (1,2), (1,3), (1,4);

-- 4. PITCHES (Đủ 10 sân mỗi loại = 30 sân)
INSERT INTO pitches (id, field_id, name, type, status) VALUES 
(1,1,'Sân 5 - 01','5_nguoi','active'), (2,1,'Sân 5 - 02','5_nguoi','active'), (3,1,'Sân 5 - 03','5_nguoi','active'), (4,1,'Sân 5 - 04','5_nguoi','active'), (5,1,'Sân 5 - 05','5_nguoi','active'),
(6,1,'Sân 5 - 06','5_nguoi','active'), (7,1,'Sân 5 - 07','5_nguoi','active'), (8,1,'Sân 5 - 08','5_nguoi','active'), (9,1,'Sân 5 - 09','5_nguoi','active'), (10,1,'Sân 5 - 10','5_nguoi','active'),
(11,1,'Sân 7 - 01','7_nguoi','active'), (12,1,'Sân 7 - 02','7_nguoi','active'), (13,1,'Sân 7 - 03','7_nguoi','active'), (14,1,'Sân 7 - 04','7_nguoi','active'), (15,1,'Sân 7 - 05','7_nguoi','active'),
(16,1,'Sân 7 - 06','7_nguoi','active'), (17,1,'Sân 7 - 07','7_nguoi','active'), (18,1,'Sân 7 - 08','7_nguoi','active'), (19,1,'Sân 7 - 09','7_nguoi','active'), (20,1,'Sân 7 - 10','7_nguoi','active'),
(21,1,'Sân 11 - 01','11_nguoi','active'), (22,1,'Sân 11 - 02','11_nguoi','active'), (23,1,'Sân 11 - 03','11_nguoi','active'), (24,1,'Sân 11 - 04','11_nguoi','active'), (25,1,'Sân 11 - 05','11_nguoi','active'),
(26,1,'Sân 11 - 06','11_nguoi','active'), (27,1,'Sân 11 - 07','11_nguoi','active'), (28,1,'Sân 11 - 08','11_nguoi','active'), (29,1,'Sân 11 - 09','11_nguoi','active'), (30,1,'Sân 11 - 10','11_nguoi','active');

-- 5. TIME_SLOTS (05:00 - 00:00)
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '16:00:00', 'normal', 150000, 1),
(1, '5_nguoi', 'weekday', '16:00:00', '21:00:00', 'peak', 250000, 1),
(1, '5_nguoi', 'weekday', '21:00:00', '00:00:00', 'off_peak', 180000, 1),
(1, '5_nguoi', 'weekend', '05:00:00', '23:59:59', 'peak', 300000, 1),
(1, '7_nguoi', 'weekday', '05:00:00', '16:00:00', 'normal', 300000, 1),
(1, '7_nguoi', 'weekday', '16:00:00', '21:00:00', 'peak', 450000, 1),
(1, '7_nguoi', 'weekday', '21:00:00', '00:00:00', 'off_peak', 350000, 1),
(1, '7_nguoi', 'weekend', '05:00:00', '23:59:59', 'peak', 550000, 1),
(1, '11_nguoi', 'weekday', '05:00:00', '00:00:00', 'normal', 1000000, 1),
(1, '11_nguoi', 'weekend', '05:00:00', '23:59:59', 'peak', 1500000, 1);

-- 6. BOOKINGS
INSERT INTO bookings (id, booking_code, user_id, pitch_id, booking_date, start_time, end_time, subtotal, total_price, status) VALUES 
(1, 'BK001', 2, 1, CURDATE(), '08:00:00', '09:00:00', 150000, 150000, 'paid'),
(2, 'BK002', 2, 1, CURDATE(), '17:00:00', '18:00:00', 250000, 250000, 'paid'),
(3, 'BK003', 2, 1, CURDATE(), '22:00:00', '23:00:00', 180000, 180000, 'paid');

SET FOREIGN_KEY_CHECKS = 1;
