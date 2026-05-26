const db = require('../config/db');

// --- 1. LẤY DANH SÁCH THÔNG BÁO CỦA TÔI ---
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await db.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );
        res.json({ message: 'Thành công', data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 2. ĐÁNH DẤU LÀ ĐÃ ĐỌC ---
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        const io = req.app.get('io');
        if (io) io.emit('notifications_updated', { user_id: userId });

        res.json({ message: 'Đã đánh dấu đã đọc' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 3. ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC ---
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
            [userId]
        );

        const io = req.app.get('io');
        if (io) io.emit('notifications_updated', { user_id: userId });

        res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- 4. HÀM TIỆN ÍCH: TẠO THÔNG BÁO (Dùng nội bộ trong code) ---
const createNotification = async (userId, title, message, type = 'system', io = null) => {
    try {
        await db.execute(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, title, message, type]
        );
        
        if (io) {
            io.emit('new_notification', { user_id: userId, title, type });
        }
        
        return true;
    } catch (err) {
        console.error('Lỗi tạo thông báo:', err);
        return false;
    }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, createNotification };
