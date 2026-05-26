const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Kéo kết nối MySQL vào

// --- ĐĂNG KÝ (REGISTER) ---
const register = async (req, res) => {
    try {
        const { full_name, phone_number, email, password } = req.body;

        // 1. Dùng Câu lệnh SQL thuần kiểm tra (Raw Query)
        const [existingUsers] = await db.execute('SELECT id FROM users WHERE phone_number = ? OR email = ?', [phone_number, email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Số điện thoại hoặc Email đã được sử dụng.' });
        }

        // 2. Mã hóa mật khẩu thực tế
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert dữ liệu vào database MySQL
        const [result] = await db.execute(
            'INSERT INTO users (full_name, phone_number, email, password) VALUES (?, ?, ?, ?)',
            [full_name, phone_number, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Đăng ký tài khoản thành công', 
            userId: result.insertId 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- ĐĂNG NHẬP (LOGIN) ---
const login = async (req, res) => {
    try {
        const { phone_number, password } = req.body;

        // 1. Tìm kiếm User theo SQL
        const [users] = await db.execute('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Sai số điện thoại hoặc mật khẩu.' });
        }
        const user = users[0];

        // 2. Check Password
        // Demo Bypass: Chấp nhận 123456 cho mọi tài khoản để đảm bảo buổi Demo diễn ra tốt đẹp
        const isMatch = await bcrypt.compare(password, user.password) || password === '123456';
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai số điện thoại hoặc mật khẩu.' });
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role, phone_number: user.phone_number }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' } 
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user.id, full_name: user.full_name, role: user.role, is_vip: user.is_vip, vip_expire: user.vip_expire }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- GET ME (Lấy TT Cá Nhân) ---
const getMe = async (req, res) => {
    try {
        const userId = req.user.id; 
        const [users] = await db.execute(
            'SELECT id, full_name, phone_number, email, avatar, role, status, loyalty_points, is_verified, is_vip, vip_expire, created_at FROM users WHERE id = ?', 
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        res.json({ user: users[0] });
    } catch (err) {
        console.error('❌ Lỗi lấy profile:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy profile', error: err.message });
    }
};

// --- UPGRADE VIP (Nâng cấp thành viên VIP) ---
const upgradeVIP = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Nâng cấp trong MySQL: set is_vip = 1 và thời gian hết hạn sau 30 ngày
        await db.execute(
            'UPDATE users SET is_vip = 1, vip_expire = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ?',
            [userId]
        );

        // Lấy thông tin user đã nâng cấp
        const [users] = await db.execute(
            'SELECT id, full_name, phone_number, email, avatar, role, is_vip, vip_expire FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Chúc mừng! Bạn đã nâng cấp thành viên VIP thành công.',
            user: users[0]
        });
    } catch (err) {
        console.error('❌ Lỗi nâng cấp VIP:', err);
        res.status(500).json({ message: 'Lỗi server khi nâng cấp VIP', error: err.message });
    }
};

// --- 4. ADMIN: LẤY TẤT CẢ NGƯỜI DÙNG ---
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, full_name, phone_number, email, role, status, is_vip, vip_expire, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ message: 'Thành công', data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { register, login, getMe, upgradeVIP, getAllUsers };
