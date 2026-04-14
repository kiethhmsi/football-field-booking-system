-- Bỏ qua kiểm tra khóa ngoại tạm thời để có thể xóa bảng không bị vướng
SET FOREIGN_KEY_CHECKS = 0;

-- Dọn dẹp sạch sẽ các bảng cũ nếu đã lỡ tạo trước đó
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
DROP TABLE IF EXISTS fields;
DROP TABLE IF EXISTS users;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. USERS & AUTHENTICATION
-- ==========================================
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

-- ==========================================
-- 2. FIELDS & AMENITIES
-- ==========================================
CREATE TABLE fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('5_nguoi', '7_nguoi', '11_nguoi') NOT NULL,
    address VARCHAR(500),
    hotline VARCHAR(20),
    open_time TIME,
    close_time TIME,
    base_price INT NOT NULL DEFAULT 0,
    avatar_url VARCHAR(500),
    images JSON,
    description TEXT,
    status ENUM('active', 'suspended', 'maintenance') DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

CREATE TABLE field_amenities (
    field_id INT,
    amenity_id INT,
    PRIMARY KEY (field_id, amenity_id),
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE TABLE time_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    day_type ENUM('weekday', 'weekend', 'holiday') DEFAULT 'weekday',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category ENUM('normal', 'peak', 'off_peak') DEFAULT 'normal',
    price INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. BOOKINGS & COUPONS
-- ==========================================
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percent', 'fixed_amount') NOT NULL,
    discount_value INT NOT NULL,
    max_discount INT,
    expiry_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    field_id INT NOT NULL,
    coupon_id INT NULL,
    team_name VARCHAR(255),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subtotal INT NOT NULL,
    service_fee INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    total_price INT NOT NULL,
    deposit_amount INT DEFAULT 0,
    note TEXT,
    status ENUM('pending', 'confirmed', 'playing', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (field_id) REFERENCES fields(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    field_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (field_id) REFERENCES fields(id)
);

-- ==========================================
-- 4. TEAMS & MATCHMAKING
-- ==========================================
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slogan VARCHAR(500),
    logo_url VARCHAR(500),
    captain_id INT NOT NULL,
    skill_level ENUM('amateur', 'semi_pro', 'pro') DEFAULT 'amateur',
    total_wins INT DEFAULT 0,
    total_draws INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    reputation_score INT DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_id) REFERENCES users(id)
);

CREATE TABLE team_members (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('captain', 'member') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE open_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NULL,
    match_type ENUM('find_opponent', 'find_teammate') NOT NULL,
    title VARCHAR(500) NOT NULL,
    match_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    field_id INT NULL,
    skill_level_required ENUM('amateur', 'semi_pro', 'pro', 'fun') DEFAULT 'fun',
    positions_needed JSON,
    expense_sharing VARCHAR(255),
    side_bet VARCHAR(255),
    notes TEXT,
    status ENUM('open', 'matched', 'finished', 'cancelled') DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL
);

CREATE TABLE match_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    applicant_team_id INT NULL,
    applicant_user_id INT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES open_matches(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. NEWS & BLOG
-- ==========================================
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    cover_image VARCHAR(500),
    excerpt TEXT,
    content LONGTEXT,
    category VARCHAR(100),
    views_count INT DEFAULT 0,
    author_id INT NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'published',
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
