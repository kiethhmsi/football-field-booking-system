-- ==========================================
-- SCRIPT KHỞI TẠO TOÀN BỘ CẤU TRÚC BẢNG (KASPORT)
-- Chạy script này để đảm bảo đủ các bảng trước khi nạp dữ liệu
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff', 'admin', 'field_owner') DEFAULT 'customer',
    status ENUM('active', 'banned', 'on_leave') DEFAULT 'active',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng FIELDS
CREATE TABLE IF NOT EXISTS fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    hotline VARCHAR(20),
    open_time TIME,
    close_time TIME,
    avatar_url VARCHAR(500),
    description TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Bảng PITCHES
CREATE TABLE IF NOT EXISTS pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    status ENUM('active', 'maintenance') DEFAULT 'active',
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 4. Bảng AMENITIES
CREATE TABLE IF NOT EXISTS amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

-- 5. Bảng FIELD_AMENITIES
CREATE TABLE IF NOT EXISTS field_amenities (
    field_id INT,
    amenity_id INT,
    PRIMARY KEY (field_id, amenity_id),
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- 6. Bảng TIME_SLOTS
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

-- 7. Bảng BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    pitch_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subtotal INT NOT NULL,
    total_price INT NOT NULL,
    status ENUM('pending', 'confirmed', 'playing', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
);

-- 8. Bảng REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
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

-- 9. Bảng NEWS
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    author_id INT NOT NULL,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 10. Bảng TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(500),
    captain_id INT NOT NULL,
    skill_level ENUM('amateur', 'semi_pro', 'pro') DEFAULT 'amateur',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_id) REFERENCES users(id)
);

-- 11. Bảng TEAM_MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('captain', 'member') DEFAULT 'member',
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Bảng OPEN_MATCHES
CREATE TABLE IF NOT EXISTS open_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    match_type ENUM('find_opponent', 'find_teammate') NOT NULL,
    title VARCHAR(500) NOT NULL,
    match_date DATE NOT NULL,
    start_time TIME,
    field_id INT,
    status ENUM('open', 'matched', 'finished', 'cancelled') DEFAULT 'open',
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL
);

-- 13. Bảng MATCH_APPLICATIONS
CREATE TABLE IF NOT EXISTS match_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    applicant_user_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (match_id) REFERENCES open_matches(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_user_id) REFERENCES users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
