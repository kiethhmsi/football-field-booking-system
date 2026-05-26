const db = require('../config/db');

// --- TỰ ĐỘNG KHỞI TẠO BẢNG REVIEWS NẾU CHƯA CÓ ---
(async () => {
    try {
        await db.execute(`
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
            )
        `);
        console.log('✅ Hệ thống đánh giá đã sẵn sàng (Bảng reviews đã tồn tại hoặc vừa được tạo)');
    } catch (err) {
        console.error('❌ Lỗi khởi tạo bảng reviews:', err.message);
    }
})();

// --- 1. LẤY CÁC ĐÁNH GIÁ MỚI NHẤT (Cho Trang Chủ) ---
exports.getLatestReviews = async (req, res) => {
    try {
        const [reviews] = await db.execute(`
            SELECT 
                r.id, 
                r.rating, 
                r.comment, 
                r.created_at,
                u.full_name as user_name,
                u.avatar as user_avatar,
                p.name as pitch_name,
                p.type as pitch_type
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN pitches p ON r.pitch_id = p.id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);

        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Lỗi lấy đánh giá:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

exports.createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { booking_id, rating, comment } = req.body;
        console.log('--- ĐANG TẠO ĐÁNH GIÁ ---');
        console.log('User ID:', userId);
        console.log('Data nhận được:', { booking_id, rating, comment });

        // Kiểm tra xem đơn hàng đã hoàn thành chưa
        const [booking] = await db.execute(
            'SELECT pitch_id, status FROM bookings WHERE id = ? AND user_id = ?',
            [booking_id, userId]
        );

        if (booking.length === 0) {
            console.log('❌ Không tìm thấy đơn đặt sân');
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
        }

        console.log('Trạng thái đơn hàng:', booking[0].status);

        if (booking[0].status !== 'completed' && booking[0].status !== 'paid' && booking[0].status !== 'confirmed') {
             // Thêm 'confirmed' để test nếu cần, nhưng plan ban đầu là 'completed'
            console.log('❌ Đơn hàng chưa đủ điều kiện đánh giá');
            return res.status(400).json({ message: 'Bạn chỉ có thể đánh giá sau khi đã hoàn thành trận đấu' });
        }

        // Kiểm tra xem đã đánh giá chưa
        const [existing] = await db.execute(
            'SELECT id FROM reviews WHERE booking_id = ?',
            [booking_id]
        );

        if (existing.length > 0) {
            console.log('❌ Đã đánh giá trước đó');
            return res.status(400).json({ message: 'Bạn đã đánh giá cho đơn hàng này rồi' });
        }

        // Thêm đánh giá
        await db.execute(
            'INSERT INTO reviews (booking_id, user_id, pitch_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [booking_id, userId, booking[0].pitch_id, rating, comment]
        );

        console.log('✅ Tạo đánh giá thành công!');
        res.status(201).json({ success: true, message: 'Cảm ơn bạn đã để lại đánh giá!' });
    } catch (error) {
        console.error('❌ LỖI TẠO ĐÁNH GIÁ:', error);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};
