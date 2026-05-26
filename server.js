require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

// Copy generated AI image to frontend public folder at server startup
const sourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\hero_fans_1779245124854.png";
const destFile = path.join(__dirname, 'frontend', 'public', 'hero-fans.png');

const ballSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\soccer_ball_1779245816170.png";
const ballDestFile = path.join(__dirname, 'frontend', 'public', 'soccer-ball.png');

const neymarSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\neymar_dribble_1779246065394.png";
const neymarDestFile = path.join(__dirname, 'frontend', 'public', 'neymar-dribble.png');

const greenscreenSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\neymar_greenscreen_1779246238449.png";
const greenscreenDestFile = path.join(__dirname, 'frontend', 'public', 'neymar-greenscreen.png');

const facilitySourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\football_facility_illustration_1779445005393.png";
const facilityDestFile = path.join(__dirname, 'frontend', 'public', 'football-facility.png');

try {
    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log("--- [Server] SUCCESSFULLY COPIED AI IMAGE TO FRONTEND PUBLIC FOLDER! ---");
    } else {
        console.log("--- [Server] Source image file not found:", sourceFile);
    }

    if (fs.existsSync(ballSourceFile)) {
        fs.copyFileSync(ballSourceFile, ballDestFile);
        console.log("--- [Server] SUCCESSFULLY COPIED SOCCER BALL IMAGE TO FRONTEND PUBLIC FOLDER! ---");
    } else {
        console.log("--- [Server] Soccer ball source file not found:", ballSourceFile);
    }

    if (fs.existsSync(neymarSourceFile)) {
        fs.copyFileSync(neymarSourceFile, neymarDestFile);
        console.log("--- [Server] SUCCESSFULLY COPIED NEYMAR IMAGE TO FRONTEND PUBLIC FOLDER! ---");
    } else {
        console.log("--- [Server] Neymar source file not found:", neymarSourceFile);
    }

    if (fs.existsSync(greenscreenSourceFile)) {
        fs.copyFileSync(greenscreenSourceFile, greenscreenDestFile);
        console.log("--- [Server] SUCCESSFULLY COPIED NEYMAR GREENSCREEN IMAGE! ---");
    } else {
        console.log("--- [Server] Neymar greenscreen source file not found:", greenscreenSourceFile);
    }

    if (fs.existsSync(facilitySourceFile)) {
        fs.copyFileSync(facilitySourceFile, facilityDestFile);
        console.log("--- [Server] SUCCESSFULLY COPIED FOOTBALL FACILITY IMAGE! ---");
    } else {
        console.log("--- [Server] Football facility source file not found:", facilitySourceFile);
    }
} catch (err) {
    console.error("--- [Server] Error copying image file:", err);
}

// --- SERVER RECOVERED ---
const cors = require('cors');

console.log("--- SYSTEM CHECK ---");
console.log("GEMINI_API_KEY Loaded:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : "❌ NOT FOUND");
console.log("--------------------");

const app = express();

// Cấu hình Middlewares
app.use(cors({
    origin: true, // Cho phép tất cả các nguồn trong quá trình phát triển để tránh lỗi kết nối
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // <-- Đã thêm PATCH vào đây
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Khởi chạy kiểm tra kết nối Database & Tự động Migration
const db = require('./config/db');
(async () => {
    try {
        // Migration nâng cấp bảng bookings (Trạng thái và Thanh toán)
        const addColumn = async (table, col, definition) => {
            try {
                await db.execute(`ALTER TABLE ${table} ADD ${col} ${definition}`);
                console.log(`[Migration] Added ${col} to ${table}`);
            } catch (e) {
                // Ignore if column already exists
                if (!e.message.includes('Duplicate column name')) {
                    console.error(`[Migration Error] ${col}:`, e.message);
                }
            }
        };

        await db.execute("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'paid', 'completed', 'pending_payment', 'pending_confirmation', 'awaiting_match') DEFAULT 'pending'").catch(() => {});
        await addColumn('bookings', 'payment_method', "ENUM('cash', 'online', 'transfer') DEFAULT 'cash'");
        await addColumn('bookings', 'check_in_status', "ENUM('not_checked_in', 'checked_in') DEFAULT 'not_checked_in' AFTER status");
        await addColumn('bookings', 'notes', "TEXT AFTER check_in_status");

        // Migration nâng cấp bảng notifications (Thêm type booking_status và payment)
        await db.execute(`
            ALTER TABLE notifications 
            MODIFY COLUMN type ENUM('match_accepted', 'match_rejected', 'new_application', 'system', 'booking_status', 'payment') DEFAULT 'system'
        `).catch(() => {});

        // Migration thêm tọa độ cho bảng fields
        await db.execute('ALTER TABLE fields ADD COLUMN latitude DECIMAL(10, 8) AFTER address').catch(() => {});
        await db.execute('ALTER TABLE fields ADD COLUMN longitude DECIMAL(11, 8) AFTER latitude').catch(() => {});

        // Migration thêm VIP cho bảng users
        await addColumn('users', 'is_vip', "TINYINT(1) DEFAULT 0");
        await addColumn('users', 'vip_expire', "DATETIME NULL");

        // Cập nhật tọa độ mẫu cho các sân bóng tại Sài Gòn
        const saigonCoords = [
            { id: 1, lat: 10.8035, lng: 106.6975 }, // Bình Thạnh
            { id: 2, lat: 10.7966, lng: 106.7214 }, // Quận 2
            { id: 3, lat: 10.7303, lng: 106.7075 }, // Quận 7
            { id: 4, lat: 10.8415, lng: 106.6343 }, // Gò Vấp
            { id: 5, lat: 10.7711, lng: 106.6934 }, // Quận 1
            { id: 6, lat: 10.8142, lng: 106.6667 }, // Phú Nhuận
            { id: 7, lat: 10.7551, lng: 106.6661 }, // Quận 5
            { id: 8, lat: 10.8231, lng: 106.6297 }  // Tân Bình
        ];

        for (const coord of saigonCoords) {
            await db.execute('UPDATE fields SET latitude = ?, longitude = ? WHERE id = ?', [coord.lat, coord.lng, coord.id]).catch(() => {});
        }

        // Migration toàn diện cho bảng open_matches
        try {
            const columnsToAdd = [
                { name: 'creator_id', type: 'INT AFTER team_id' },
                { name: 'host_team_name', type: 'VARCHAR(255) AFTER creator_id' },
                { name: 'end_time', type: 'TIME AFTER start_time' },
                { name: 'field_type', type: 'VARCHAR(50) DEFAULT "Sân 5" AFTER field_id' },
                { name: 'contact_phone', type: 'VARCHAR(20) AFTER field_type' },
                { name: 'positions_needed', type: 'JSON AFTER contact_phone' },
                { name: 'expense_sharing', type: 'VARCHAR(255) AFTER positions_needed' },
                { name: 'side_bet', type: 'VARCHAR(255) AFTER expense_sharing' },
                { name: 'notes', type: 'TEXT AFTER side_bet' },
                { name: 'current_players', type: 'INT DEFAULT 0' },
                { name: 'max_players', type: 'INT DEFAULT 1' }
            ];

            for (const col of columnsToAdd) {
                await db.execute(`ALTER TABLE open_matches ADD COLUMN ${col.name} ${col.type}`).catch(() => {});
            }

            // Bổ sung cột cho tournament_matches nếu thiếu
            await addColumn('tournament_matches', 'next_match_id', 'INT AFTER winner_id');
            await addColumn('tournament_matches', 'end_time', 'TIME AFTER match_date');
        } catch (e) { console.log('OpenMatches Migration skipped'); }

        // Migration cho bảng time_slots (Thêm is_active)
        try {
            await db.execute('ALTER TABLE time_slots ADD COLUMN is_active TINYINT(1) DEFAULT 1 AFTER price').catch(() => {});
        } catch (e) { console.log('TimeSlots Migration skipped'); }

        // Migration Hệ thống Đội bóng
        try {
            await db.execute(`
                CREATE TABLE IF NOT EXISTS teams (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slogan VARCHAR(255),
                    logo_url VARCHAR(500),
                    captain_id INT,
                    skill_level ENUM('fun', 'amateur', 'semi_pro', 'pro') DEFAULT 'amateur',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `).catch(() => {});

            await db.execute(`
                CREATE TABLE IF NOT EXISTS team_members (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    team_id INT,
                    user_id INT,
                    role ENUM('captain', 'member') DEFAULT 'member',
                    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
                )
            `).catch(() => {});
        } catch (e) { console.log('Team Migration skipped'); }

        // Migration Hệ thống Giải đấu
        try {
            await db.execute(`
                CREATE TABLE IF NOT EXISTS tournaments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    banner_url VARCHAR(500),
                    location VARCHAR(255),
                    start_date DATE,
                    max_teams INT DEFAULT 8,
                    current_teams INT DEFAULT 0,
                    prize_pool VARCHAR(255),
                    entry_fee VARCHAR(255),
                    rules TEXT,
                    status ENUM('registration', 'ongoing', 'completed') DEFAULT 'registration',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `).catch(() => {});

            await db.execute(`
                CREATE TABLE IF NOT EXISTS tournament_teams (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tournament_id INT,
                    team_id INT,
                    status ENUM('pending', 'confirmed') DEFAULT 'pending',
                    payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
                    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
                )
            `).catch(() => {});

            // Thêm cột payment_status nếu chưa có
            await db.execute(`
                ALTER TABLE tournament_teams ADD COLUMN IF NOT EXISTS payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid'
            `).catch(() => {});

            await db.execute(`
                CREATE TABLE IF NOT EXISTS tournament_registrations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tournament_id INT,
                    user_id INT,
                    team_name VARCHAR(255),
                    team_logo_url VARCHAR(500),
                    captain_name VARCHAR(255),
                    phone VARCHAR(50),
                    members_list TEXT,
                    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
                    registration_status ENUM('pending_payment', 'registered', 'payment_failed') DEFAULT 'pending_payment',
                    amount DECIMAL(15,2),
                    order_code BIGINT UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `).catch(() => {});

            await db.execute(`
                CREATE TABLE IF NOT EXISTS tournament_matches (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tournament_id INT,
                    round VARCHAR(50),
                    team_a_id INT,
                    team_b_id INT,
                    score_a INT DEFAULT 0,
                    score_b INT DEFAULT 0,
                    match_date DATETIME,
                    winner_id INT,
                    next_match_id INT,
                    status ENUM('scheduled', 'finished') DEFAULT 'scheduled',
                    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
                )
            `).catch(() => {});

            const [existingTournaments] = await db.execute('SELECT id FROM tournaments LIMIT 1');
            if (existingTournaments.length === 0) {
                await db.execute(`
                    INSERT INTO tournaments (title, banner_url, location, start_date, max_teams, prize_pool, entry_fee, rules, status)
                    VALUES 
                    ('🏆 KASPORT WEEKLY CUP #01', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000', 'Sân HKSPORT - Quận 7', '2026-06-20', 8, '5.000.000đ', '500.000đ/Đội', 'Thi đấu loại trực tiếp. Mỗi trận 2 hiệp, mỗi hiệp 20 phút.', 'registration'),
                    ('🔥 GIẢI PHỦI SINH VIÊN T5', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000', 'Sân HKSPORT - Bình Thạnh', '2026-06-25', 16, '10.000.000đ', 'Miễn phí', 'Dành cho sinh viên các trường đại học tại TP.HCM.', 'registration')
                `);
            }
        } catch (e) { console.log('Tournament Migration skipped'); }

        // Tự động bổ sung khung giờ mẫu
        try {
            const [fieldsList] = await db.execute('SELECT id FROM fields');
            const types = ['5_nguoi', '7_nguoi', '11_nguoi'];
            const days = ['weekday', 'weekend'];
            const slotTemplates = [
                { start: '05:00', end: '17:00', price: 200000 },
                { start: '17:00', end: '22:00', price: 400000 },
                { start: '22:00', end: '23:30', price: 250000 }
            ];

            for (const field of fieldsList) {
                for (const type of types) {
                    const [existing] = await db.execute(
                        'SELECT id FROM time_slots WHERE field_id = ? AND pitch_type = ? LIMIT 1', 
                        [field.id, type]
                    );

                    if (existing.length === 0) {
                        for (const day of days) {
                            for (const s of slotTemplates) {
                                const price = type === '7_nguoi' ? s.price * 1.5 : (type === '11_nguoi' ? s.price * 3 : s.price);
                                await db.execute(
                                    'INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, price) VALUES (?, ?, ?, ?, ?, ?)',
                                    [field.id, type, day, s.start, s.end, price]
                                );
                            }
                        }
                    }
                }
            }
        } catch (e) { console.log('Slot Migration skipped'); }

        // Migration cho bảng TIN TỨC (NEWS)
        try {
            await db.execute(`
                CREATE TABLE IF NOT EXISTS news (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    cover_image VARCHAR(500),
                    excerpt TEXT,
                    content LONGTEXT,
                    category VARCHAR(100),
                    views_count INT DEFAULT 0,
                    author_id INT NOT NULL,
                    status ENUM('draft', 'published') DEFAULT 'published',
                    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (author_id) REFERENCES users(id)
                )
            `).catch(() => {});
        } catch (e) { console.log('News Migration skipped'); }

        console.log('✅ Hệ thống Migration: Kiểm tra hoàn tất.');
    } catch (err) {
        console.error('❌ Lỗi Migration Tổng:', err.message);
    }
})();

// Nạp các Routes (API Endpoints)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payos', require('./routes/payosRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));

// Route thử nghiệm hệ thống
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API Backend Hệ thống Sân Bóng KASPORT!' });
});

// Middlewares xử lý lỗi toàn cục - PHẢI ĐẶT SAU CÙNG
app.use((err, req, res, next) => {
    console.error('💥 LỖI HỆ THỐNG:', err.stack);
    res.status(500).json({ 
        message: 'Có lỗi xảy ra tại Server Backend!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Chạy Server
// ---------------------------------------------------------
// AUTOMATION SYSTEMS (Lên nhạc! 🚀)
// ---------------------------------------------------------

// 1. Tự động hoàn thành đơn đặt sân & Trận đấu khi hết giờ
setInterval(async () => {
    try {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

        // Tự động hoàn thành Đơn đặt sân
        const [expiredBookings] = await db.execute(`
            UPDATE bookings 
            SET status = 'completed' 
            WHERE status = 'confirmed' 
            AND (booking_date < ? OR (booking_date = ? AND end_time <= ?))
        `, [currentDate, currentDate, currentTime]);

        if (expiredBookings.affectedRows > 0) {
            console.log(`[Automation] Đã tự động hoàn thành ${expiredBookings.affectedRows} đơn đặt sân.`);
        }

        // Tự động hoàn thành Trận đấu giải đấu
        const [expiredMatches] = await db.execute(`
            UPDATE tournament_matches 
            SET status = 'completed' 
            WHERE status = 'scheduled' 
            AND (match_date < ? OR (match_date = ? AND end_time <= ?))
        `, [currentDate, currentDate, currentTime]);

        if (expiredMatches.affectedRows > 0) {
            console.log(`[Automation] Đã tự động hoàn thành ${expiredMatches.affectedRows} trận đấu giải.`);
        }

        // Tự động reset VIP hết hạn
        const [expiredVIPs] = await db.execute(`
            UPDATE users 
            SET is_vip = 0, vip_expire = NULL 
            WHERE is_vip = 1 
            AND vip_expire IS NOT NULL 
            AND vip_expire < NOW()
        `);

        if (expiredVIPs.affectedRows > 0) {
            console.log(`[Automation] Đã tự động hủy VIP của ${expiredVIPs.affectedRows} tài khoản hết hạn.`);
        }

    } catch (err) {
        console.error('[Automation Error]:', err);
    }
}, 60000); // Chạy mỗi 60 giây

const PORT = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('🔥 User disconnected');
    });
});

// Gán io vào app để dùng ở các controller
app.set('io', io);

server.listen(PORT, () => {
    console.log(`🚀 Server Backend & Realtime đã khởi chạy tại: http://localhost:${PORT}`);
});

module.exports = { app, server, io };
