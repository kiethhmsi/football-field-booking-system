const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Cấu hình Middlewares
app.use(cors()); // Phục vụ gọi API từ Frontend khác origin
app.use(express.json()); // Đọc body JSON từ request client

// Khởi chạy kiểm tra kết nối Database
require('./config/db');

// Nạp các Routes (API Endpoints)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

// Route thử nghiệm hệ thống
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API Backend Hệ thống Sân Bóng KAKAKA!' });
});

// Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đã khởi chạy tại: http://localhost:${PORT}`);
});
