const db = require('../config/db');
const { sendBookingStatusEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt');

const getOverviewStats = async (req, res) => {
    try {
        const [stats] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURDATE()) as today_bookings,
                (SELECT IFNULL(SUM(total_price), 0) FROM bookings WHERE status NOT IN ('cancelled', 'pending') AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())) as month_projected_revenue,
                (SELECT IFNULL(SUM(deposit_amount), 0) + IFNULL(SUM(CASE WHEN status IN ('paid', 'completed') THEN (total_price - deposit_amount) ELSE 0 END), 0) FROM bookings WHERE status NOT IN ('cancelled') AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())) as month_actual_revenue,
                (SELECT COUNT(*) FROM pitches WHERE status = 'active') as total_pitches,
                (SELECT IFNULL(SUM(total_price), 0) FROM bookings WHERE status IN ('paid', 'completed') AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())) as legacy_revenue
        `);

        const [distribution] = await db.execute(`
            SELECT p.type as name, SUM(b.total_price) as value
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            WHERE b.status IN ('paid', 'completed')
              AND MONTH(b.created_at) = MONTH(CURDATE())
              AND YEAR(b.created_at) = YEAR(CURDATE())
            GROUP BY p.type
        `);

        const [recentBookings] = await db.execute(`
            SELECT b.id, b.booking_code, COALESCE(NULLIF(b.team_name, ''), u.full_name) as customerName, b.start_time, b.end_time, b.status, p.name as pitchName
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.id DESC
            LIMIT 5
        `);

        res.json({ message: 'Thành công', data: { overview: stats[0], distribution, recentBookings } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const { search, field_id, check_in_status, status } = req.query;
        let query = `
            SELECT b.*, f.id as field_id, f.name as field_name, p.name as pitch_name, p.type as pitch_type, u.full_name as customer_name, u.phone_number as customer_phone, COALESCE(NULLIF(b.contact_email, ''), u.email) as contact_email
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            JOIN fields f ON p.field_id = f.id
            JOIN users u ON b.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        
        if (search) {
            query += ' AND (b.booking_code LIKE ? OR u.full_name LIKE ? OR u.phone_number LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (field_id) {
            query += ' AND (f.id = ? OR p.id = ?)';
            params.push(field_id, field_id);
        }
        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }
        if (check_in_status) {
            if (check_in_status === 'overdue') {
                // Logic Quá giờ: Hiện tại > start_time, trạng thái xác nhận, chưa check-in
                const now = new Date();
                const currentDate = now.toISOString().split('T')[0];
                const currentTime = now.toTimeString().split(' ')[0];
                
                query += ` AND b.check_in_status = 'not_checked_in' 
                           AND b.status IN ('confirmed', 'paid') 
                           AND (b.booking_date < ? OR (b.booking_date = ? AND b.start_time < ?))`;
                params.push(currentDate, currentDate, currentTime);
            } else {
                query += ' AND b.check_in_status = ?';
                params.push(check_in_status);
            }
        }
        query += ' ORDER BY b.id DESC';
        const [bookings] = await db.execute(query, params);
        res.json({ message: 'Thành công', data: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

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
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const createUser = async (req, res) => {
    try {
        const { full_name, phone_number, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);
        await db.execute('INSERT INTO users (full_name, phone_number, email, password, role) VALUES (?, ?, ?, ?, ?)', [full_name, phone_number, email, hashedPassword, role || 'customer']);
        res.status(201).json({ message: 'Thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.execute('SELECT id, full_name, phone_number, email, role, status, created_at FROM users WHERE id = ?', [id]);
        if (user.length === 0) return res.status(404).json({ message: 'Không thấy user' });
        res.json({ message: 'Thành công', data: { profile: user[0] } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, full_name, phone_number, email, role, status, is_vip, vip_expire, created_at FROM users ORDER BY created_at DESC');
        res.json({ message: 'Thành công', data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const [staff] = await db.execute('SELECT * FROM users WHERE role = "staff"');
        res.json({ message: 'Thành công', data: staff });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const updateCheckInStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { check_in_status } = req.body;
        await db.execute('UPDATE bookings SET check_in_status = ? WHERE id = ?', [check_in_status, id]);
        
        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'check_in_update', booking_id: id, check_in_status });
        
        res.json({ message: 'Cập nhật trạng thái check-in thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { pitch_id, booking_date, start_time, end_time, deposit_amount, status, total_price, notes } = req.body;

        // 1. Kiểm tra xung đột (Conflict Check)
        const [conflicts] = await db.execute(`
            SELECT id FROM bookings 
            WHERE pitch_id = ? 
            AND booking_date = ? 
            AND status NOT IN ('cancelled')
            AND id != ?
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (? <= start_time AND ? > start_time)
            )
        `, [pitch_id, booking_date, id, start_time, start_time, end_time, end_time, start_time, end_time]);

        if (conflicts.length > 0) {
            return res.status(400).json({ message: 'Sân đã có người đặt trong khung giờ này!' });
        }

        // 2. Cập nhật
        await db.execute(`
            UPDATE bookings 
            SET pitch_id = ?, booking_date = ?, start_time = ?, end_time = ?, deposit_amount = ?, status = ?, total_price = ?, notes = ?
            WHERE id = ?
        `, [pitch_id, booking_date, start_time, end_time, deposit_amount, status, total_price, notes || '', id]);

        const io = req.app.get('io');
        if (io) io.emit('booking_updated', { action: 'update_full', booking_id: id });

        res.json({ message: 'Cập nhật đơn đặt sân thành công' });
    } catch (err) {
        console.error('SERVER UPDATE ERROR:', err);
        res.status(500).json({ message: 'Lỗi server: ' + err.message });
    }
};

module.exports = { 
    getOverviewStats, 
    getAllBookings, 
    updateBookingStatus, 
    getAllUsers, 
    updateUserStatus, 
    deleteUser, 
    getUserDetails, 
    createUser, 
    getAllStaff, 
    updateCheckInStatus,
    updateBooking
};
