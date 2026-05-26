-- ==========================================================
-- 🏟️ KASPORT REAL DATA INJECTION (Trình Hội Đồng Đồ Án)
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. XOÁ DỮ LIỆU CŨ ĐỂ LÀM SẠCH (Chỉ xoá phần liên quan đến sân)
TRUNCATE TABLE field_amenities;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE pitches;
TRUNCATE TABLE fields;
TRUNCATE TABLE amenities;

-- 2. NẠP TIỆN ÍCH (Amenities)
INSERT INTO amenities (id, name, icon) VALUES 
(1, 'Wifi miễn phí', 'Wifi'),
(2, 'Gửi xe miễn phí', 'ParkingSquare'),
(3, 'Căng tin / Nước uống', 'Coffee'),
(4, 'Phòng thay đồ', 'DoorOpen'),
(5, 'Đèn cao áp chuẩn FIFA', 'Lightbulb'),
(6, 'Cho thuê giày / áo', 'Shirt');

-- 3. NẠP CHI TIẾT CÁC CỤM SÂN THẬT (Fields)
INSERT INTO fields (id, owner_id, name, address, hotline, open_time, close_time, avatar_url, description) VALUES 
(1, 10, 'KaSport Premium Complex', 'Số 10 Mai Chí Thọ, Thủ Thiêm, Quận 2, TP.HCM', '0901234567', '05:00:00', '23:30:00', 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=1200', 'Tổ hợp thể thao cao cấp nhất khu vực phía Đông với 10 sân cỏ nhân tạo đạt chuẩn FIFA, hệ thống thoát nước hiện đại.'),
(2, 50, 'Sân Bóng Chảo Lửa', '30 Phan Thúc Duyện, Phường 4, Tân Bình, TP.HCM', '0911000999', '05:30:00', '23:00:00', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200', 'Một trong những cụm sân bóng phủi nổi tiếng nhất Sài Gòn, nơi thường xuyên tổ chức các giải đấu phong trào lớn.'),
(3, 100, 'Sân bóng Cỏ Nhân Tạo Kỳ Hòa', '824 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM', '0922334455', '06:00:00', '22:30:00', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200', 'Không gian thoáng mát, nằm trong khuôn viên khách sạn Kỳ Hòa, chất lượng cỏ luôn được bảo trì định kỳ hàng tháng.'),
(4, 10, 'Sân Vận Động Phú Thọ', '219 Lý Thường Kiệt, Phường 15, Quận 11, TP.HCM', '0933445566', '05:00:00', '22:00:00', 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1200', 'Hệ thống sân bóng trung tâm, thuận tiện di chuyển, có cụm sân 7 và sân 11 rất rộng.'),
(5, 50, 'Hanoi Football Complex', 'Số 2 Phạm Văn Đồng, Cầu Giấy, Hà Nội', '0944556677', '05:00:00', '23:00:00', 'https://images.unsplash.com/photo-1518605336397-90db35f5bd04?q=80&w=1200', 'Tổ hợp sân bóng đẳng cấp tại Thủ đô với mặt cỏ mềm, hạn chế chấn thương tối đa cho cầu thủ.');

-- 4. LIÊN KẾT TIỆN ÍCH CHO TỪNG SÂN
INSERT INTO field_amenities (field_id, amenity_id) VALUES 
(1,1), (1,2), (1,3), (1,5),
(2,2), (2,3), (2,5), (2,6),
(3,1), (3,2), (3,3),
(4,2), (4,5),
(5,1), (5,2), (5,3), (5,4), (5,5);

-- 5. NẠP CÁC SÂN CON (Pitches)
INSERT INTO pitches (field_id, name, type) VALUES 
(1, 'Sân 5 - King', '5_nguoi'), (1, 'Sân 5 - Queen', '5_nguoi'), (1, 'Sân 7 - Diamond', '7_nguoi'),
(2, 'Sân Chảo Lửa 1', '7_nguoi'), (2, 'Sân Chảo Lửa 2', '7_nguoi'), (2, 'Sân 11 - Olympic', '11_nguoi'),
(3, 'Sân Kỳ Hòa A', '5_nguoi'), (3, 'Sân Kỳ Hòa B', '5_nguoi'),
(4, 'Sân Phú Thọ 1', '7_nguoi'), (4, 'Sân Phú Thọ 2', '11_nguoi'),
(5, 'Sân Mỹ Đình Jr 1', '7_nguoi'), (5, 'Sân Mỹ Đình Jr 2', '7_nguoi');

-- 6. NẠP KHUNG GIỜ & GIÁ (Time Slots) - Thiết lập chuẩn chuyên nghiệp
-- Giá Sân 5 (200k - 400k)
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 250000),
(1, '5_nguoi', 'weekday', '16:00:00', '23:00:00', 'peak', 450000),
(1, '5_nguoi', 'weekend', '05:00:00', '23:00:00', 'peak', 500000);

-- Giá Sân 7 (500k - 900k)
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '7_nguoi', 'weekday', '05:00:00', '16:00:00', 'off_peak', 600000),
(1, '7_nguoi', 'weekday', '16:00:00', '23:00:00', 'peak', 950000),
(2, '7_nguoi', 'weekday', '16:00:00', '23:00:00', 'peak', 850000);

-- Giá Sân 11 (1tr5 - 2tr5)
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(4, '11_nguoi', 'weekday', '17:00:00', '21:00:00', 'peak', 2500000),
(2, '11_nguoi', 'weekday', '17:00:00', '21:00:00', 'peak', 2200000);

SET FOREIGN_KEY_CHECKS = 1;
