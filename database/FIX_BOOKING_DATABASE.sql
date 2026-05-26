-- ==========================================================
-- 🛠️ FIX DATABASE LỖI ĐẶT SÂN (PHIÊN BẢN TƯƠNG THÍCH CAO)
-- ==========================================================

USE sanbong;

-- Tắt chế độ Safe Update để có thể xóa/sửa dữ liệu thoải mái
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bổ sung các cột thiếu vào bảng bookings (Chạy từng dòng)
-- Nếu dòng nào báo lỗi "Duplicate column name" thì cứ kệ nó, là do cột đó có rồi.
ALTER TABLE bookings ADD COLUMN coupon_id INT NULL AFTER pitch_id;
ALTER TABLE bookings ADD COLUMN subtotal INT NOT NULL DEFAULT 0 AFTER end_time;
ALTER TABLE bookings ADD COLUMN service_fee INT DEFAULT 0 AFTER subtotal;
ALTER TABLE bookings ADD COLUMN discount_amount INT DEFAULT 0 AFTER service_fee;
ALTER TABLE bookings ADD COLUMN deposit_amount INT DEFAULT 0 AFTER total_price;
ALTER TABLE bookings ADD COLUMN contact_email VARCHAR(255) NULL AFTER team_name;
ALTER TABLE bookings ADD COLUMN payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending' AFTER status;

-- 2. Đảm bảo bảng coupons tồn tại
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percent', 'fixed_amount') NOT NULL,
    discount_value INT NOT NULL,
    max_discount INT,
    expiry_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;
