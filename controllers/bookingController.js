const db = require('../config/db');
const { sendBookingStatusEmail } = require('../utils/mailer');

// --- 0. TỰ ĐỘNG HỦY ĐƠN CHƯA THANH TOÁN (SAU 15 PHÚT) ---
const checkUnpaidBookings = async () => {
    try {
        await db.execute(`
            UPDATE bookings 
            SET status = 'cancelled' 
            WHERE status = 'pending_payment' 
            AND payment_method = 'online'
            AND created_at < NOW() - INTERVAL 15 MINUTE
        `);
    } catch (err) {
        console.error('Lỗi checkUnpaidBookings:', err);
    }
};

// --- 0.1. TỰ ĐỘNG DỌN DẸP ĐƠN CHỜ GHÉP KÈO QUÁ 10 PHÚT ---
const checkAwaitingMatchBookings = async () => {
    try {
        // Xóa các booking 'awaiting_match' mà chưa được gắn vào kèo đấu nào sau 10 phút
        await db.execute(`
            UPDATE bookings 
            SET status = 'cancelled' 
            WHERE status = 'awaiting_match' 
            AND booking_type = 'matchmaking'
            AND created_at < NOW() - INTERVAL 10 MINUTE
            AND id NOT IN (SELECT booking_id FROM open_matches WHERE booking_id IS NOT NULL)
        `);
    } catch (err) {
        console.error('Lỗi checkAwaitingMatchBookings:', err);
    }
};

// --- 0.2. TỰ ĐỘNG HOÀN THÀNH ĐƠN ĐÃ QUA GIỜ ---
const checkCompletedBookings = async () => {
    try {
        await db.execute(`
            UPDATE bookings 
            SET status = 'completed' 
            WHERE status IN ('confirmed', 'paid') 
            AND (
                booking_date < CURDATE() 
                OR (booking_date = CURDATE() AND end_time < CURTIME())
            )
        `);
    } catch (err) {
        console.error('Lỗi checkCompletedBookings:', err);
    }
};

// --- 1. TẠO ĐƠN ĐẶT SÂN MỚI ---
const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            pitch_id, 
            coupon_id, 
            team_name, 
            customer_name,
            booking_date, 
            start_time, 
            end_time, 
            subtotal, 
            service_fee, 
            discount_amount, 
            payment_method,
            contact_email
        } = req.body;

        const [conflicts] = await db.execute(`
            SELECT id FROM bookings 
            WHERE pitch_id = ? 
            AND booking_date = ? 
            AND status IN ('confirmed', 'pending', 'paid', 'completed', 'pending_payment', 'pending_confirmation')
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (? <= start_time AND ? > start_time)
            )
        `, [pitch_id, booking_date, start_time, start_time, end_time, end_time, start_time, end_time]);

        if (conflicts.length > 0) {
            return res.status(400).json({ message: 'Khung giờ này đã có người đặt.' });
        }

        const bookingCode = `SB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const final_team_name = team_name || customer_name || 'Đội vãng lai';
        const final_subtotal = Number(subtotal) || 0;
        const final_discount_amount = Number(discount_amount) || 0;
        const final_total_price = final_subtotal + (Number(service_fee) || 0) - final_discount_amount;

        let status = 'pending_confirmation';
        if (payment_method === 'online') status = 'pending_payment';

        const [result] = await db.execute(
            `INSERT INTO bookings 
            (booking_code, user_id, pitch_id, coupon_id, team_name, contact_email, booking_date, start_time, end_time, subtotal, service_fee, discount_amount, total_price, payment_method, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [bookingCode, userId, pitch_id, coupon_id || null, final_team_name, contact_email || '', booking_date, start_time, end_time, final_subtotal, service_fee || 0, final_discount_amount, final_total_price, payment_method || 'cash', status]
        );

        res.status(201).json({ message: 'Thành công', bookingId: result.insertId, booking_code: bookingCode });
        
        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'create', booking_id: result.insertId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. LẤY LỊCH SỬ ĐẶT SÂN CỦA PROFILE ---
const getMyBookings = async (req, res) => {
    try {
        await checkUnpaidBookings();
        await checkCompletedBookings();
        const userId = req.user.id;
        const [bookings] = await db.execute(`
            SELECT b.id, b.booking_code, b.booking_date, b.start_time, b.end_time, b.total_price, b.deposit_amount, b.status, b.payment_status, f.name as field_name, f.avatar_url
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
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
        const [bookings] = await db.execute(`
            SELECT b.*, p.name as pitch_name, f.name as field_name, u.full_name as customer_name, u.phone_number as customer_phone
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ? AND b.user_id = ?
        `, [id, userId]);
        if (bookings.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        res.json({ message: 'Thành công', data: bookings[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 4. ADMIN: LẤY TẤT CẢ ĐƠN ĐẶT SÂN (PHÂN TRANG & LỌC) ---
const getAllBookings = async (req, res) => {
    try {
        await checkUnpaidBookings(); 
        await checkAwaitingMatchBookings();
        await checkCompletedBookings();
        const { search, field_id, status, page = 1, limit = 10 } = req.query;

        // Parse sang số nguyên ngay từ đầu — tránh lỗi ER_WRONG_ARGUMENTS của mysql2
        const limitInt = Math.max(1, parseInt(limit, 10) || 10);
        const pageInt  = Math.max(1, parseInt(page,  10) || 1);
        const offsetInt = (pageInt - 1) * limitInt;

        let query = `
            SELECT b.*, f.name as field_name, p.name as pitch_name, u.full_name as customer_name, b.deposit_amount, p.field_id, p.type as pitch_type
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            JOIN users u ON b.user_id = u.id
        `;
        let countQuery = `
            SELECT COUNT(*) as total
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            JOIN users u ON b.user_id = u.id
        `;
        
        const params = [];
        const countParams = [];
        let whereClause = ' WHERE 1=1';
        
        if (search && search.trim() !== '') {
            whereClause += ' AND (b.booking_code LIKE ? OR u.full_name LIKE ? OR u.phone_number LIKE ?)';
            const s = `%${search.trim()}%`;
            params.push(s, s, s);
            countParams.push(s, s, s);
        }
        
        if (field_id && field_id !== '') {
            whereClause += ' AND p.id = ?';
            params.push(field_id);
            countParams.push(field_id);
        }
        
        if (status && status !== '') {
            const s = status.toLowerCase().trim();
            if (s === 'pending') {
                whereClause += " AND b.status IN ('pending', 'pending_payment', 'pending_confirmation')";
            } else if (s === 'confirmed') {
                whereClause += " AND b.status IN ('confirmed', 'paid')";
            } else if (s !== 'all' && s !== '') {
                whereClause += ' AND b.status = ?';
                params.push(s);
                countParams.push(s);
            }
        }

        // Nhúng LIMIT/OFFSET trực tiếp vào query string (đã parse sang int) để tránh lỗi mysql2 prepared statement
        const finalQuery = query + whereClause + ` ORDER BY b.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;
        const finalCountQuery = countQuery + whereClause;

        const [bookings] = await db.execute(finalQuery, params);
        const [totalResult] = await db.execute(finalCountQuery, countParams);
        const total = totalResult[0].total;

        res.json({ 
            message: 'Thành công', 
            data: bookings,
            pagination: { total, page: pageInt, limit: limitInt, totalPages: Math.ceil(total / limitInt) }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 5. ADMIN: CẬP NHẬT TRẠNG THÁI ---
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [bookings] = await db.execute(`
            SELECT b.*, f.name as field_name, p.name as pitch_name, u.full_name as customer_name, COALESCE(NULLIF(b.contact_email, ''), u.email) as customer_email
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ?
        `, [id]);

        if (bookings.length === 0) return res.status(404).json({ message: 'Không thấy đơn' });

        await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

        // Nếu trạng thái là cancelled, tự động hủy kèo đấu liên quan (nếu có)
        if (status === 'cancelled') {
            await db.execute('UPDATE open_matches SET status = "cancelled" WHERE booking_id = ?', [id]);
        }

        if (status === 'confirmed' || status === 'cancelled') {
            sendBookingStatusEmail({ ...bookings[0], status }).catch(e => console.error('Lỗi email:', e));
            
            // Gửi thông báo nội bộ cho người dùng
            try {
                const { createNotification } = require('./notificationController');
                const title = status === 'confirmed' ? 'Đơn đặt sân đã được xác nhận' : 'Đơn đặt sân đã bị hủy';
                const message = status === 'confirmed' 
                    ? `Tuyệt vời! Đơn hàng ${bookings[0].booking_code} tại ${bookings[0].field_name} đã được xác nhận thành công.`
                    : `Rất tiếc! Đơn hàng ${bookings[0].booking_code} đã bị hủy bởi Admin. Vui lòng liên hệ để biết thêm chi tiết.`;
                const io = req.app.get('io');
                await createNotification(bookings[0].user_id, title, message, 'booking_status', io);
            } catch (notifyErr) {
                console.error('Lỗi gửi thông báo:', notifyErr);
            }
        }

        res.json({ message: 'Thành công' });
        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'update', booking_id: id, status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 6. USER: HỦY ĐƠN ---
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const [existing] = await db.execute('SELECT status FROM bookings WHERE id = ? AND user_id = ?', [id, userId]);
        if (existing.length === 0) return res.status(404).json({ message: 'Không thấy đơn' });
        if (['completed', 'cancelled'].includes(existing[0].status)) return res.status(400).json({ message: 'Không thể hủy' });

        await db.execute('UPDATE bookings SET status = "cancelled" WHERE id = ?', [id]);
        
        // Tự động hủy kèo đấu liên quan khi người dùng chủ động hủy sân
        await db.execute('UPDATE open_matches SET status = "cancelled" WHERE booking_id = ?', [id]);

        res.json({ message: 'Thành công' });
        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'cancel', booking_id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- 7. USER: XÁC NHẬN CHUYỂN KHOẢN (DEMO) ---
const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const [result] = await db.execute('UPDATE bookings SET payment_status = "partial" WHERE id = ? AND user_id = ? AND status = "pending"', [id, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Không thấy đơn' });
        res.json({ message: 'Thành công' });
        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'payment_confirmed', booking_id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- 8. TẠO ĐẶT SÂN TẠM THỜI ĐỂ TẠO KÈO (MATCHMAKING) ---
const createMatchmakingBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pitch_id, booking_date, start_time, end_time, price, subtotal, total_price } = req.body;
        const finalPrice = price || total_price || subtotal || 0;

        // 1. Kiểm tra xem slot này đã bị ai đặt thật chưa
        const [conflicts] = await db.execute(`
            SELECT id FROM bookings 
            WHERE pitch_id = ? 
            AND booking_date = ? 
            AND status IN ('confirmed', 'paid', 'completed')
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (? <= start_time AND ? > start_time)
            )
        `, [pitch_id, booking_date, start_time, start_time, end_time, end_time, start_time, end_time]);

        if (conflicts.length > 0) {
            return res.status(400).json({ message: 'Rất tiếc, sân này vừa có người đặt chính thức.' });
        }

        const bookingCode = `MATCH-${Date.now()}`;
        
        // 2. Tạo đơn đặt sân tạm thời với type matchmaking
        const [result] = await db.execute(
            `INSERT INTO bookings 
            (booking_code, user_id, pitch_id, team_name, booking_date, start_time, end_time, subtotal, total_price, status, booking_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_match', 'matchmaking')`,
            [bookingCode, userId, pitch_id, 'Đang tạo kèo...', booking_date, start_time, end_time, finalPrice, finalPrice]
        );

        res.status(201).json({ 
            message: 'Đã giữ sân tạm thời trong 10 phút!', 
            bookingId: result.insertId,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { 
    createBooking, 
    getMyBookings, 
    getBookingDetails, 
    getAllBookings, 
    updateBookingStatus, 
    cancelBooking, 
    confirmPayment,
    createMatchmakingBooking
};
