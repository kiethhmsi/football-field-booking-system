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
        const isMatch = await bcrypt.compare(password, user.password);
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
            user: { id: user.id, full_name: user.full_name, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- GET ME (Lấy TT Cá Nhân) ---
const getMe = async (req, res) => {
    try {
        const userId = req.user.id; // Có được nhờ verifyToken Middleware
        const [users] = await db.execute(
            'SELECT id, full_name, phone_number, email, avatar, role, status, loyalty_points, is_verified, created_at FROM users WHERE id = ?', 
            [userId]
        );
        res.json({ user: users[0] });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { register, login, getMe };
