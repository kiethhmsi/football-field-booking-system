const db = require('../config/db');

// --- 1. TẠO ĐƠN ĐẶT SÂN MỚI ---
const createBooking = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ Middleware sau khi check Token
        const { field_id, coupon_id, team_name, booking_date, start_time, end_time, subtotal, service_fee, discount_amount, total_price, deposit_amount, note } = req.body;

        // Code sinh Mã Đơn Hàng Booking Code tự động đẹp mắt giống Shopee/Traveloka
        const year = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000); 
        const bookingCode = `SB-${year}-${randNum}`;

        // Insert vào database (Mặc định status là pending chờ chuyển khoản cọc)
        const [result] = await db.execute(
            `INSERT INTO bookings 
            (booking_code, user_id, field_id, coupon_id, team_name, booking_date, start_time, end_time, subtotal, service_fee, discount_amount, total_price, deposit_amount, note, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [bookingCode, userId, field_id, coupon_id || null, team_name, booking_date, start_time, end_time, subtotal, service_fee, discount_amount, total_price, deposit_amount, note]
        );

        res.status(201).json({ 
            message: 'Tạo đơn đặt sân thành công', 
            booking_code: bookingCode, // Trả mã cho FE hiển thị Trang Đặt Thành Công
            bookingId: result.insertId 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. LẤY LỊCH SỬ ĐẶT SÂN CỦA PROFILE ---
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Cần JOIN với bảng fields để lấy Tên sân ra ngoài lịch sử
        const [bookings] = await db.execute(`
            SELECT b.id, b.booking_code, b.booking_date, b.start_time, b.end_time, b.total_price, b.status, f.name as field_name, f.avatar_url
            FROM bookings b
            JOIN fields f ON b.field_id = f.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [userId]);

        res.json({ message: 'Thành công', data: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 3. ĐỌC CHI TIẾT 1 HÓA ĐƠN ---
const getBookingDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Chỉ cho phép user xem hóa đơn của riêng họ (Security check: user_id = ?)
        const [bookings] = await db.execute(`
            SELECT * FROM bookings 
            WHERE id = ? AND user_id = ?
        `, [id, userId]);

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy Đơn hàng' });
        }

        res.json({ message: 'Thành công', data: bookings[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookingDetails };
