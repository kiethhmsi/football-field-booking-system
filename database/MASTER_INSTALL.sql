-- ==========================================================
-- 🏟️ KASPORT COMPREHENSIVE MASTER SETUP V2
-- ==========================================================
-- Bản kết hợp: Cấu trúc mới nhất + Dữ liệu cũ của bạn + 30 Cụm sân
-- ==========================================================

CREATE DATABASE IF NOT EXISTS sanbong;
USE sanbong;

-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS match_applications;
-- DROP TABLE IF EXISTS open_matches;
-- DROP TABLE IF EXISTS team_members;
-- DROP TABLE IF EXISTS teams;
-- DROP TABLE IF EXISTS news;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS coupons;
-- DROP TABLE IF EXISTS time_slots;
-- DROP TABLE IF EXISTS field_amenities;
-- DROP TABLE IF EXISTS amenities;
-- DROP TABLE IF EXISTS pitches;
-- DROP TABLE IF EXISTS pitch_maintenance;
-- DROP TABLE IF EXISTS fields;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS notifications;
-- SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. FIELDS
CREATE TABLE IF NOT EXISTS fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    hotline VARCHAR(20),
    open_time TIME DEFAULT '05:00:00',
    close_time TIME DEFAULT '23:00:00',
    avatar_url VARCHAR(500),
    description TEXT,
    status ENUM('active', 'suspended', 'maintenance') DEFAULT 'active'
);

-- 3. PITCHES
CREATE TABLE IF NOT EXISTS pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    status ENUM('active', 'maintenance', 'hidden') DEFAULT 'active',
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 4. TIME_SLOTS
CREATE TABLE IF NOT EXISTS time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    pitch_type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    day_type ENUM('weekday', 'weekend', 'holiday') DEFAULT 'weekday',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category ENUM('normal', 'peak', 'off_peak') DEFAULT 'normal',
    price INT NOT NULL,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 5. AMENITIES
CREATE TABLE IF NOT EXISTS amenities (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, icon VARCHAR(255));
CREATE TABLE IF NOT EXISTS field_amenities (field_id INT, amenity_id INT, PRIMARY KEY (field_id, amenity_id), FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE, FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE);

-- 6. COUPONS
CREATE TABLE IF NOT EXISTS coupons (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(50) NOT NULL UNIQUE, discount_type ENUM('percent', 'fixed_amount') NOT NULL, discount_value INT NOT NULL, max_discount INT, expiry_date DATETIME, is_active BOOLEAN DEFAULT TRUE);

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price INT NOT NULL,
    status ENUM('pending', 'confirmed', 'playing', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
    team_name VARCHAR(255),
    contact_email VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
);

-- 8. TEAMS & MATCHMAKING
CREATE TABLE IF NOT EXISTS teams (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, slogan VARCHAR(500), logo_url VARCHAR(500), captain_id INT NOT NULL, skill_level ENUM('amateur', 'semi_pro', 'pro') DEFAULT 'amateur', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (captain_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS open_matches (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    team_id INT NULL, 
    creator_id INT NULL, 
    host_team_name VARCHAR(255), 
    match_type ENUM('find_opponent', 'find_teammate') NOT NULL, 
    title VARCHAR(500) NOT NULL, 
    match_date DATE NOT NULL, 
    start_time TIME, 
    end_time TIME, 
    field_id INT NULL, 
    field_type ENUM('Sân 5', 'Sân 7', 'Sân 11') DEFAULT 'Sân 7', 
    contact_phone VARCHAR(20), 
    skill_level_required ENUM('amateur', 'semi_pro', 'pro', 'fun') DEFAULT 'fun', 
    positions_needed TEXT, -- Lưu JSON các vị trí cần tuyển
    expense_sharing VARCHAR(255), 
    side_bet VARCHAR(255), 
    notes TEXT, 
    status ENUM('open', 'matched', 'finished', 'cancelled') DEFAULT 'open', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE, 
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS match_applications (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    match_id INT NOT NULL, 
    applicant_team_id INT NULL, 
    applicant_team_name VARCHAR(255), 
    applicant_skill_level ENUM('amateur', 'semi_pro', 'pro', 'fun') DEFAULT 'fun',
    applicant_user_id INT NOT NULL, 
    message TEXT, 
    contact_phone VARCHAR(20),
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (match_id) REFERENCES open_matches(id) ON DELETE CASCADE
);

-- 9. PITCH_MAINTENANCE
CREATE TABLE IF NOT EXISTS pitch_maintenance (id INT AUTO_INCREMENT PRIMARY KEY, pitch_id INT NOT NULL, maintenance_type VARCHAR(255) NOT NULL, description TEXT, cost INT DEFAULT 0, start_date DATE NOT NULL, end_date DATE NOT NULL, status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/*
-- Amenities
INSERT INTO amenities (id, name, icon) VALUES (1, 'Wifi', 'wifi'), (2, 'Đậu xe', 'car'), (3, 'Căng tin', 'coffee'), (4, 'Phòng tắm', 'shower');

-- 🏟️ GENERATE 30 FIELDS (Để tìm sân hiện ra 30 kết quả)
INSERT INTO fields (id, name, address, description, avatar_url) VALUES 
(1, 'KaSport Complex Q7', 'Quận 7, TP.HCM', 'Tổ hợp KaSport 30 sân cỏ nhân tạo.', 'https://images.unsplash.com/photo-1529900948632-586bc48fe710?q=80&w=800'),
(2, 'KaSport Tân Bình', 'Quận Tân Bình, TP.HCM', 'Sân bóng KaSport nổi tiếng.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800'),
(3, 'KaSport Quận 10', 'Quận 10, TP.HCM', 'Không gian KaSport thoáng mát.', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800'),
(4, 'KaSport Quận 11', 'Quận 11, TP.HCM', 'Trung tâm KaSport lớn.', 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=800'),
(5, 'KaSport Hà Nội', 'Nam Từ Liêm, Hà Nội', 'Cỏ FIFA KaSport chất lượng.', 'https://images.unsplash.com/photo-1518605336397-90db35f5bd04?q=80&w=800'),
(6, 'KaSport Bách Khoa', 'Quận Hai Bà Trưng, Hà Nội', 'Sân bóng sinh viên KaSport.', 'https://picsum.photos/seed/f6/800/600'),
(7, 'KaSport Đầm Sen', 'Quận 11, TP.HCM', 'Gần khu vui chơi KaSport.', 'https://picsum.photos/seed/f7/800/600'),
(8, 'KaSport Gia Định', 'Quận Bình Thạnh, TP.HCM', 'Sân cỏ KaSport.', 'https://picsum.photos/seed/f8/800/600'),
(9, 'KaSport Thống Nhất', 'Quận 10, TP.HCM', 'Lịch sử KaSport.', 'https://picsum.photos/seed/f9/800/600'),
(10, 'KaSport Hoa Lư', 'Quận 1, TP.HCM', 'Trung tâm KaSport.', 'https://picsum.photos/seed/f10/800/600'),
(11, 'KaSport Quân Khu 7', 'Quận Phú Nhuận, TP.HCM', 'Hệ thống KaSport đa năng.', 'https://picsum.photos/seed/f11/800/600'),
(12, 'KaSport Thanh Đa', 'Quận Bình Thạnh, TP.HCM', 'Không khí KaSport.', 'https://picsum.photos/seed/f12/800/600'),
(13, 'KaSport Bình Lợi', 'Quận Bình Thạnh, TP.HCM', 'Mới nâng cấp KaSport.', 'https://picsum.photos/seed/f13/800/600'),
(14, 'KaSport Thủ Đức', 'TP. Thủ Đức', 'Hiện đại KaSport.', 'https://picsum.photos/seed/f14/800/600'),
(15, 'KaSport Làng Đại Học', 'TP. Thủ Đức', 'Sân bóng KaSport sv.', 'https://picsum.photos/seed/f15/800/600'),
(16, 'KaSport Chu Văn An', 'Quận Bình Thạnh, TP.HCM', 'Sân bóng KaSport trường học.', 'https://picsum.photos/seed/f16/800/600'),
(17, 'KaSport Rạch Chiếc', 'Quận 2, TP.HCM', 'Dự án KaSport lớn.', 'https://picsum.photos/seed/f17/800/600'),
(18, 'KaSport An Phú', 'Quận 2, TP.HCM', 'Khu dân cư KaSport.', 'https://picsum.photos/seed/f18/800/600'),
(19, 'KaSport Thảo Điền', 'Quận 2, TP.HCM', 'Sân bóng KaSport.', 'https://picsum.photos/seed/f19/800/600'),
(20, 'KaSport Cát Lái', 'Quận 2, TP.HCM', 'KaSport Cát Lái.', 'https://picsum.photos/seed/f20/800/600'),
(21, 'KaSport Hiệp Bình Phước', 'TP. Thủ Đức', 'Sân bóng KaSport mới.', 'https://picsum.photos/seed/f21/800/600'),
(22, 'KaSport Linh Đông', 'TP. Thủ Đức', 'Sân cỏ KaSport mượt.', 'https://picsum.photos/seed/f22/800/600'),
(23, 'KaSport Tam Phú', 'TP. Thủ Đức', 'Giá rẻ KaSport.', 'https://picsum.photos/seed/f23/800/600'),
(24, 'KaSport Tăng Nhơn Phú', 'Quận 9, TP.HCM', 'Khu KaSport cao.', 'https://picsum.photos/seed/f24/800/600'),
(25, 'KaSport Long Thạnh Mỹ', 'Quận 9, TP.HCM', 'Yên tĩnh KaSport.', 'https://picsum.photos/seed/f25/800/600'),
(26, 'KaSport Suối Tiên', 'Quận 9, TP.HCM', 'Khu du lịch KaSport.', 'https://picsum.photos/seed/f26/800/600'),
(27, 'KaSport Tân Phú', 'Quận Tân Phú, TP.HCM', 'Sân bóng KaSport phủi.', 'https://picsum.photos/seed/f27/800/600'),
(28, 'KaSport Bình Tân', 'Quận Bình Tân, TP.HCM', 'Quy mô KaSport lớn.', 'https://picsum.photos/seed/f28/800/600'),
(29, 'KaSport Hóc Môn', 'Huyện Hóc Môn, TP.HCM', 'Thoáng đãng KaSport.', 'https://picsum.photos/seed/f29/800/600'),
(30, 'KaSport Củ Chi', 'Huyện Củ Chi, TP.HCM', 'Sân bóng KaSport.', 'https://picsum.photos/seed/f30/800/600');
*/
