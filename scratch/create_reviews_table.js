const db = require('./config/db');

async function createTable() {
    try {
        const sql = `
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
        `;
        await db.execute(sql);
        console.log("✅ Đã khởi tạo bảng 'reviews' thành công trong database 'sanbong'!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Lỗi khởi tạo bảng:", err.message);
        process.exit(1);
    }
}

createTable();
