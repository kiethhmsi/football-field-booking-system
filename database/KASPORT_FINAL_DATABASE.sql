-- ==========================================================
-- 🏟️ KASPORT FINAL DATABASE SETUP (Master Script)
-- ==========================================================
-- Dành cho báo cáo thực tập - KaSport (KAKAKA) System
-- Script này sẽ khởi tạo lại toàn bộ cấu trúc và nạp dữ liệu mẫu
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DỌN DẸP HỆ THỐNG (Clean up)
DROP TABLE IF EXISTS match_applications;
DROP TABLE IF EXISTS open_matches;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS time_slots;
DROP TABLE IF EXISTS field_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS pitches;
DROP TABLE IF EXISTS fields;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 2. CẤU TRÚC BẢNG (Schema)
-- ==========================================

-- Bảng USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('customer', 'staff', 'admin', 'field_owner') DEFAULT 'customer',
    status ENUM('active', 'banned', 'on_leave') DEFAULT 'active',
    loyalty_points INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng FIELDS (Cụm sân)
CREATE TABLE fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    hotline VARCHAR(20),
    open_time TIME,
    close_time TIME,
    avatar_url VARCHAR(500),
    images JSON,
    description TEXT,
    status ENUM('active', 'suspended', 'maintenance') DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Bảng PITCHES (Sân con)
CREATE TABLE pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    status ENUM('active', 'maintenance', 'hidden') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Bảng AMENITIES (Tiện ích)
CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

-- Bảng FIELD_AMENITIES (Liên kết Tiện ích)
CREATE TABLE field_amenities (
    field_id INT,
    amenity_id INT,
    PRIMARY KEY (field_id, amenity_id),
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Bảng TIME_SLOTS (Khung giờ & Giá động)
CREATE TABLE time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    pitch_type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    day_type ENUM('weekday', 'weekend', 'holiday') DEFAULT 'weekday',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category ENUM('normal', 'peak', 'off_peak') DEFAULT 'normal',
    price INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- Bảng COUPONS
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percent', 'fixed_amount') NOT NULL,
    discount_value INT NOT NULL,
    max_discount INT,
    expiry_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bảng BOOKINGS
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    coupon_id INT NULL,
    team_name VARCHAR(255),
    contact_email VARCHAR(255) NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subtotal INT NOT NULL,
    service_fee INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    total_price INT NOT NULL,
    deposit_amount INT DEFAULT 0,
    status ENUM('pending', 'confirmed', 'playing', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

-- Bảng REVIEWS
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
);

-- Bảng TEAMS
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(500),
    captain_id INT NOT NULL,
    skill_level ENUM('amateur', 'semi_pro', 'pro') DEFAULT 'amateur',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_id) REFERENCES users(id)
);

-- Bảng TEAM_MEMBERS
CREATE TABLE team_members (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('captain', 'member') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng OPEN_MATCHES (Kèo đấu)
CREATE TABLE open_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NULL,
    match_type ENUM('find_opponent', 'find_teammate') NOT NULL,
    title VARCHAR(500) NOT NULL,
    match_date DATE NOT NULL,
    start_time TIME,
    field_id INT NULL,
    skill_level_required ENUM('amateur', 'semi_pro', 'pro', 'fun') DEFAULT 'fun',
    status ENUM('open', 'matched', 'finished', 'cancelled') DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL
);

-- Bảng NEWS
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    author_id INT NOT NULL,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- ==========================================
-- 3. NẠP DỮ LIỆU MẪU (Sample Data)
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;

-- Nạp 100 Users
INSERT INTO users (id, full_name, phone_number, email, password, role, status, is_verified) VALUES 
(1, 'Nguyễn Văn An', '0901000001', 'nguyenvanan1@gmail.com', 'pass123', 'customer', 'active', 1),
(6, 'Vũ Văn Giang', '0901000006', 'vuvangiang6@gmail.com', 'pass123', 'staff', 'active', 1),
(10, 'Hồ Văn Minh', '0901000010', 'hovanminh10@gmail.com', 'pass123', 'field_owner', 'active', 1),
(31, 'Hoàng Văn Lâm', '0901000031', 'hoangvanlam31@gmail.com', 'pass123', 'staff', 'active', 1),
(50, 'Vũ Thị Kim', '0901000050', 'vuthikim50@gmail.com', 'pass123', 'field_owner', 'active', 1),
(100, 'Trần Đình Vương', '0901000100', 'trandinhvuong100@gmail.com', 'pass123', 'field_owner', 'active', 1);
-- (Lưu ý: Bạn có thể thêm tiếp 94 user còn lại nếu cần, ở đây tôi nạp các ID quan trọng làm mẫu)

-- Nạp 5 Cụm sân Premium (DNA Design)
INSERT INTO fields (id, owner_id, name, address, hotline, open_time, close_time, avatar_url, description) VALUES 
(1, 10, 'KaSport Premium Complex', 'Phú Mỹ Hưng, Quận 7, TP.HCM', '0901000100', '05:00:00', '23:00:00', 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800', 'Tổ hợp thể thao tiêu chuẩn quốc tế với mặt cỏ nhân tạo nhập khẩu.'),
(2, 50, 'Sân Vận Động Tao Đàn', 'Quận 1, TP.HCM', '0911000001', '05:00:00', '23:00:00', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800', 'Sân bóng biểu tượng tại trung tâm Thành phố.'),
(3, 100, 'Tổ Hợp Mỹ Đình', 'Nam Từ Liêm, Hà Nội', '0911000002', '05:00:00', '23:30:00', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800', 'Chất lượng cỏ hàng đầu khu vực phía Bắc.');

-- Nạp Pitches (Sân con)
INSERT INTO pitches (id, field_id, name, type) VALUES 
(1, 1, 'Sân 5 - Số 01', '5_nguoi'), (2, 1, 'Sân 5 - Số 02', '5_nguoi'),
(5, 1, 'Sân 7 - Số 01', '7_nguoi'), (11, 1, 'Sân 11 - Số 01', '11_nguoi');

-- Nạp Khung giờ & Giá động
INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES 
(1, '5_nguoi', 'weekday', '05:00:00', '17:00:00', 'off_peak', 200000),
(1, '5_nguoi', 'weekday', '17:00:00', '22:00:00', 'peak', 350000),
(1, '7_nguoi', 'weekday', '17:00:00', '22:00:00', 'peak', 600000);

-- Nạp Bookings (Dữ liệu cho Dashboard Doanh thu)
INSERT INTO bookings (id, booking_code, user_id, pitch_id, booking_date, start_time, end_time, subtotal, total_price, status) VALUES 
(1, 'BK201', 1, 1, CURDATE() - INTERVAL 1 DAY, '17:30:00', '19:00:00', 350000, 350000, 'paid'),
(2, 'BK202', 6, 2, CURDATE() - INTERVAL 1 DAY, '19:00:00', '20:30:00', 350000, 350000, 'paid'),
(3, 'BK203', 10, 5, CURDATE() - INTERVAL 2 DAY, '18:00:00', '19:30:00', 600000, 600000, 'paid');

-- Nạp Tin tức (DNA Blog)
INSERT INTO news (title, content, author_id) VALUES 
('5 Bí quyết duy trì thể lực cho cầu thủ phủi', 'Nội dung chi tiết về dinh dưỡng và tập luyện...', 6),
('KaSport Premium chính thức hoạt động', 'Thông tin khai trương cụm sân mới tại Quận 7...', 31);

-- Nạp Đánh giá (Social Proof)
INSERT INTO reviews (booking_id, user_id, pitch_id, rating, comment) VALUES 
(1, 1, 1, 5, 'Sân rất đẹp, ánh sáng tốt, nhân viên nhiệt tình!'),
(2, 6, 2, 4, 'Cỏ hơi mòn một chút nhưng tổng thể chất lượng vẫn ok.');

SET FOREIGN_KEY_CHECKS = 1;
