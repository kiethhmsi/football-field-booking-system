-- ==========================================================
-- KASPORT DASHBOARD MOCK DATA
-- Nap du lieu doanh thu/booking mau cho man hinh Admin Dashboard.
-- File co the chay lai nhieu lan: cac booking DEMO-% se duoc xoa va nap lai.
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

UPDATE users
SET role = 'admin'
WHERE phone_number = '0123456789';

DELETE FROM bookings
WHERE booking_code LIKE 'DEMO-%';
 
SET @month_start = DATE_FORMAT(CURDATE(), '%Y-%m-01');
SET @month_end = LAST_DAY(CURDATE());

INSERT INTO bookings
    (booking_code, user_id, pitch_id, team_name, contact_email, booking_date, start_time, end_time, subtotal, service_fee, discount_amount, total_price, deposit_amount, status, created_at)
VALUES
    ('DEMO-001', 1, 1, 'FC Anh Em', 'demo001@kasport.local', DATE_ADD(@month_start, INTERVAL 0 DAY), '17:00:00', '18:30:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ('DEMO-002', 6, 11, 'Dong Doi FC', 'demo002@kasport.local', DATE_ADD(@month_start, INTERVAL 2 DAY), '18:00:00', '20:00:00', 800000, 0, 0, 800000, 200000, 'paid', DATE_SUB(NOW(), INTERVAL 14 DAY)),
    ('DEMO-003', 10, 21, 'K11 United', 'demo003@kasport.local', DATE_ADD(@month_start, INTERVAL 4 DAY), '19:00:00', '21:00:00', 2500000, 0, 0, 2500000, 500000, 'paid', DATE_SUB(NOW(), INTERVAL 13 DAY)),
    ('DEMO-004', 1, 2, 'Morning Club', 'demo004@kasport.local', DATE_ADD(@month_start, INTERVAL 5 DAY), '08:00:00', '09:30:00', 200000, 0, 0, 200000, 50000, 'paid', DATE_SUB(NOW(), INTERVAL 12 DAY)),
    ('DEMO-005', 6, 12, 'Green Star', 'demo005@kasport.local', DATE_ADD(@month_start, INTERVAL 7 DAY), '16:30:00', '18:00:00', 500000, 0, 0, 500000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 11 DAY)),
    ('DEMO-006', 10, 1, 'Blue Ocean', 'demo006@kasport.local', DATE_ADD(@month_start, INTERVAL 9 DAY), '18:30:00', '20:00:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ('DEMO-007', 1, 22, 'Sai Gon 11', 'demo007@kasport.local', DATE_ADD(@month_start, INTERVAL 11 DAY), '20:00:00', '22:00:00', 2500000, 0, 0, 2500000, 500000, 'completed', DATE_SUB(NOW(), INTERVAL 9 DAY)),
    ('DEMO-008', 6, 3, 'Weekend FC', 'demo008@kasport.local', DATE_ADD(@month_start, INTERVAL 12 DAY), '17:00:00', '18:30:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 8 DAY)),
    ('DEMO-009', 10, 13, 'Storm Seven', 'demo009@kasport.local', DATE_ADD(@month_start, INTERVAL 14 DAY), '19:00:00', '20:30:00', 800000, 0, 0, 800000, 200000, 'paid', DATE_SUB(NOW(), INTERVAL 7 DAY)),
    ('DEMO-010', 1, 4, 'Sunset FC', 'demo010@kasport.local', DATE_ADD(@month_start, INTERVAL 16 DAY), '18:00:00', '19:30:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 6 DAY)),
    ('DEMO-011', 6, 23, 'Early Bird', 'demo011@kasport.local', DATE_ADD(@month_start, INTERVAL 18 DAY), '06:00:00', '08:00:00', 1500000, 0, 0, 1500000, 300000, 'paid', DATE_SUB(NOW(), INTERVAL 5 DAY)),
    ('DEMO-012', 10, 5, 'Night Kick', 'demo012@kasport.local', DATE_ADD(@month_start, INTERVAL 19 DAY), '20:30:00', '22:00:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 4 DAY)),
    ('DEMO-013', 1, 14, 'Rapid Seven', 'demo013@kasport.local', DATE_ADD(@month_start, INTERVAL 21 DAY), '17:30:00', '19:00:00', 800000, 0, 0, 800000, 200000, 'paid', DATE_SUB(NOW(), INTERVAL 3 DAY)),
    ('DEMO-014', 6, 6, 'KAS Friends', 'demo014@kasport.local', DATE_ADD(@month_start, INTERVAL 23 DAY), '18:00:00', '19:30:00', 400000, 0, 0, 400000, 100000, 'paid', DATE_SUB(NOW(), INTERVAL 2 DAY)),
    ('DEMO-015', 10, 24, 'Big Match', 'demo015@kasport.local', DATE_ADD(@month_start, INTERVAL 25 DAY), '19:00:00', '21:00:00', 2500000, 0, 0, 2500000, 500000, 'paid', DATE_SUB(NOW(), INTERVAL 1 DAY)),
    ('DEMO-TODAY-1', 1, 1, 'Today FC', 'today1@kasport.local', CURDATE(), '17:00:00', '18:30:00', 400000, 0, 0, 400000, 100000, 'confirmed', NOW()),
    ('DEMO-TODAY-2', 6, 11, 'Today Seven', 'today2@kasport.local', CURDATE(), '18:30:00', '20:00:00', 800000, 0, 0, 800000, 200000, 'pending', NOW()),
    ('DEMO-TODAY-3', 10, 21, 'Today Eleven', 'today3@kasport.local', CURDATE(), '19:00:00', '21:00:00', 2500000, 0, 0, 2500000, 500000, 'confirmed', NOW());

SET FOREIGN_KEY_CHECKS = 1;
