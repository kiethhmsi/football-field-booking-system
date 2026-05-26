-- HƯỚNG DẪN: 
-- 1. Ở cột bên trái, nhấp đúp vào Database của bạn (để nó hiện IN ĐẬM lên).
-- 2. Sau đó mới chạy lệnh bên dưới:

ALTER TABLE bookings 
ADD COLUMN payment_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending' 
AFTER status;

ALTER TABLE bookings
ADD COLUMN contact_email VARCHAR(255) NULL
AFTER team_name;
