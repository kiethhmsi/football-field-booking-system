const db = require('./config/db');

async function setupNotificationsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type ENUM('system', 'booking', 'match', 'promotion') DEFAULT 'system',
                is_read BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Bảng notifications đã sẵn sàng!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi tạo bảng notifications:', err.message);
        process.exit(1);
    }
}

setupNotificationsTable();
