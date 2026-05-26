const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kasport'
    });

    try {
        console.log('--- Đang cập nhật Database ---');
        await connection.execute('ALTER TABLE open_matches ADD COLUMN current_players INT DEFAULT 0');
        await connection.execute('ALTER TABLE open_matches ADD COLUMN max_players INT DEFAULT 1');
        console.log('✅ Cập nhật thành công: Thêm current_players và max_players vào open_matches');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('ℹ️ Cột đã tồn tại, bỏ qua.');
        } else {
            console.error('❌ Lỗi:', err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
