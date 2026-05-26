-- ==========================================================
-- KASPORT DATA EXPANSION PACK (DỰA TRÊN CẤU TRÚC HIỆN TẠI)
-- Mục tiêu: Làm đẹp Dashboard, Tin tức và Đánh giá sân
-- ==========================================================

-- Tắt kiểm tra khóa ngoại để nạp dữ liệu mẫu mà không bị lỗi ID
SET FOREIGN_KEY_CHECKS = 0;

-- 1. THÊM DỮ LIỆU TIN TỨC (NEWS)
INSERT INTO news (title, content, author_id, published_at) VALUES 
('5 Bí quyết duy trì thể lực cho cầu thủ phủi', 'Để có thể duy trì sức bền trong suốt 90 phút trên sân cỏ nhân tạo, bạn cần có chế độ dinh dưỡng và tập luyện khoa học...', 6, CURDATE() - INTERVAL 5 DAY),
('KaSport Premium: Trải nghiệm tiêu chuẩn FIFA tại Quận 7', 'Cụm sân KaSport Premium vừa chính thức đi vào hoạt động với hệ thống đèn LED chuyên dụng và mặt cỏ nhân tạo nhập khẩu...', 31, CURDATE() - INTERVAL 3 DAY),
('Cách chọn giày bóng đá phù hợp với mặt sân cỏ nhân tạo', 'Việc sử dụng giày đinh TF hay AG trên sân cỏ nhân tạo ảnh hưởng rất lớn đến khớp gối của bạn...', 6, CURDATE() - INTERVAL 2 DAY),
('Chiến thuật sơ đồ 2-3-1 cực đỉnh cho sân 7 người', 'Sơ đồ 2-3-1 giúp đội hình cân bằng giữa phòng ngự và tấn công, đặc biệt hiệu quả trong các trận đấu tranh chấp mạnh...', 31, CURDATE() - INTERVAL 1 DAY);

-- 2. THÊM ĐÁNH GIÁ (REVIEWS) - Gán cho cụm sân Premium (ID 1)
INSERT INTO reviews (booking_id, user_id, pitch_id, rating, comment) VALUES 
(1, 5, 1, 5, 'Sân rất đẹp, cỏ mềm, ánh sáng tốt. Nhân viên hỗ trợ nhiệt tình.'),
(2, 12, 5, 4, 'Chất lượng sân tốt nhưng bãi giữ xe hơi xa một chút.'),
(3, 15, 3, 5, 'Giá hợp lý so với chất lượng dịch vụ tại Quận 7.'),
(1, 20, 1, 5, 'Khung giờ sáng sớm mát mẻ, lại có ưu đãi 20%. Rất tuyệt!'),
(2, 25, 2, 4, 'Ok, sân sạch sẽ.');

-- 3. NẠP THÊM NHIỀU ĐƠN HÀNG (BOOKINGS) ĐỂ LÀM ĐẸP BIỂU ĐỒ DOANH THU
INSERT INTO bookings (booking_code, user_id, pitch_id, booking_date, start_time, end_time, subtotal, total_price, status, created_at) VALUES 
('BK201', 2, 1, CURDATE() - INTERVAL 1 DAY, '17:30:00', '19:00:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK202', 8, 2, CURDATE() - INTERVAL 1 DAY, '19:00:00', '20:30:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK203', 14, 5, CURDATE() - INTERVAL 1 DAY, '18:00:00', '19:30:00', 600000, 600000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK204', 22, 11, CURDATE() - INTERVAL 1 DAY, '17:00:00', '19:00:00', 1800000, 1800000, 'paid', CURDATE() - INTERVAL 2 DAY),
('BK205', 40, 1, CURDATE() - INTERVAL 2 DAY, '18:00:00', '19:30:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 3 DAY),
('BK206', 45, 6, CURDATE() - INTERVAL 2 DAY, '19:30:00', '21:00:00', 600000, 600000, 'paid', CURDATE() - INTERVAL 3 DAY),
('BK207', 60, 2, CURDATE() - INTERVAL 3 DAY, '17:30:00', '19:00:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 4 DAY),
('BK208', 75, 5, CURDATE() - INTERVAL 3 DAY, '19:00:00', '20:30:00', 600000, 600000, 'paid', CURDATE() - INTERVAL 4 DAY),
('BK209', 2, 1, CURDATE() - INTERVAL 4 DAY, '18:00:00', '19:30:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 5 DAY),
('BK210', 8, 3, CURDATE() - INTERVAL 4 DAY, '20:00:00', '21:30:00', 350000, 350000, 'paid', CURDATE() - INTERVAL 5 DAY);

-- 4. CẬP NHẬT HÌNH ẢNH SÂN BÓNG CHO ĐẸP (DNA KASPORT)
UPDATE fields SET avatar_url = 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800' WHERE id = 1;
UPDATE fields SET avatar_url = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800' WHERE id = 2;
UPDATE fields SET avatar_url = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800' WHERE id = 3;
UPDATE fields SET avatar_url = 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800' WHERE id = 4;
UPDATE fields SET avatar_url = 'https://images.unsplash.com/photo-1518153925619-3bf71ee813b1?q=80&w=800' WHERE id = 5;

-- Bật lại kiểm tra khóa ngoại sau khi hoàn tất
SET FOREIGN_KEY_CHECKS = 1;









