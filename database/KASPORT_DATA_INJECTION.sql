-- ==========================================================
-- 💉 KASPORT DATA INJECTION (Chỉ nạp dữ liệu - INSERT ONLY)
-- Chạy script này SAU KHI đã chạy KASPORT_SCHEMA_ONLY.sql
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 🧹 DỌN DẸP DỮ LIỆU CŨ TRƯỚC KHI NẠP (TRUNCATE)
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

-- 1. NẠP DỮ LIỆU TIỆN ÍCH (AMENITIES)
INSERT INTO amenities (id, name, icon) VALUES 
(1, 'Wifi miễn phí', 'wifi'), (2, 'Bãi đậu xe ô tô', 'car'), 
(3, 'Căng tin nước uống', 'coffee'), (4, 'Phòng tắm & Thay đồ', 'shower'), 
(5, 'Cho thuê giày/áo', 'shirt'), (6, 'Hệ thống đèn LED', 'zap'), 
(7, 'Khán đài có mái che', 'users');

-- 2. NẠP DỮ LIỆU NGƯỜI DÙNG (USERS)
INSERT INTO users (id, full_name, phone_number, email, password, role, status, is_verified) VALUES 
(1, 'Nguyễn Văn An', '0901000001', 'nguyenvanan1@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'customer', 'active', 1),
(6, 'Vũ Văn Giang', '0901000006', 'vuvangiang6@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'staff', 'active', 1),
(10, 'Hồ Văn Minh', '0901000010', 'hovanminh10@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'field_owner', 'active', 1),
(31, 'Hoàng Văn Lâm', '0901000031', 'hoangvanlam31@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'staff', 'active', 1),
(50, 'Vũ Thị Kim', '0901000050', 'vuthikim50@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'field_owner', 'active', 1),
(100, 'Trần Đình Vương', '0901000100', 'trandinhvuong100@gmail.com', '$2b$10$6uT5R0F8Z0O6Z0O6Z0O6Z0u.B69I9u9I9u9I9u9I9u9I9u9I9u9I9', 'field_owner', 'active', 1);

-- 3. NẠP DỮ LIỆU CỤM SÂN (FIELDS) & SÂN CON (PITCHES)
INSERT INTO fields (id, owner_id, name, address, hotline, open_time, close_time, avatar_url, description) VALUES 
(1, 10, 'KaSport Premium Complex', 'Khu đô thị Phú Mỹ Hưng, Quận 7, TP.HCM', '0901000100', '05:00:00', '23:00:00', 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800', 'Tổ hợp thể thao tiêu chuẩn quốc tế với 30 sân cỏ nhân tạo cao cấp.'),
(2, 50, 'Sân Vận Động Tao Đàn', 'Số 1 Huyền Trân Công Chúa, Quận 1, TP.HCM', '0911000001', '05:00:00', '23:00:00', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800', 'Sân bóng biểu tượng tại trung tâm Quận 1.'),
(3, 100, 'Tổ Hợp Thể Thao Mỹ Đình', 'Đường Lê Đức Thọ, Nam Từ Liêm, Hà Nội', '0911000002', '05:00:00', '23:30:00', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800', 'Khu liên hợp thể thao quốc gia với chất lượng cỏ hàng đầu.');

-- Tạo sân con
INSERT INTO pitches (field_id, name, type) VALUES 
(1, 'Sân 5 - Số 01', '5_nguoi'), (1, 'Sân 5 - Số 02', '5_nguoi'),
(1, 'Sân 7 - Số 01', '7_nguoi'), (1, 'Sân 11 - Số 01', '11_nguoi');

-- 4. NẠP KHUNG GIỜ & GIÁ (TIME_SLOTS)
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '17:00:00', 'off_peak', 200000),
(1, '5_nguoi', 'weekday', '17:00:00', '22:00:00', 'peak', 350000),
(1, '7_nguoi', 'weekday', '17:00:00', '22:00:00', 'peak', 600000);

-- 5. NẠP ĐƠN HÀNG MẪU (BOOKINGS)
INSERT INTO bookings (booking_code, user_id, pitch_id, booking_date, start_time, end_time, subtotal, total_price, status, created_at) VALUES 
('BK201', 1, 1, CURDATE() - INTERVAL 1 DAY, '17:30:00', '19:00:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK202', 6, 2, CURDATE() - INTERVAL 1 DAY, '19:00:00', '20:30:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK203', 10, 5, CURDATE() - INTERVAL 2 DAY, '18:00:00', '19:30:00', 600000, 600000, 'paid', CURDATE() - INTERVAL 3 DAY),
('BK204', 1, 1, CURDATE(), '19:00:00', '20:30:00', 350000, 350000, 'confirmed', CURDATE());

-- 6. NẠP TIN TỨC (NEWS) & ĐÁNH GIÁ (REVIEWS)
INSERT INTO news (title, slug, content, author_id) VALUES 
('5 Bí quyết duy trì thể lực cho cầu thủ phủi', 'bi-quyet-the-luc', 'Nội dung chi tiết giúp bạn bền bỉ hơn trên sân...', 6),
('KaSport Premium chính thức đi vào hoạt động', 'khai-truong-kasport', 'Đánh dấu bước ngoặt mới của hệ thống KaSport...', 31);

INSERT INTO reviews (booking_id, user_id, pitch_id, rating, comment) VALUES 
(1, 1, 1, 5, 'Sân bóng tuyệt nhất khu vực Quận 7, cỏ rất êm!'),
(2, 6, 1, 4, 'Dịch vụ tốt, giá cả hợp lý.');

SET FOREIGN_KEY_CHECKS = 1;
