const mysql = require('mysql2');
require('dotenv').config();

// Sử dụng Connection Pool giúp tối ưu kết nối đến MySQL thay vì connect đơn lẻ
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Chạy hàm Test DB khi khởi động Server
promisePool.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối thành công tới Database MySQL!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database MySQL. Vui lòng check lại service MySQL:', err.message);
    });

module.exports = promisePool;
