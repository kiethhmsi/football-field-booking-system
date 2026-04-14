const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Không tìm thấy Token. Vui lòng đăng nhập!' });
    }

    try {
        const bearer = token.split(' ')[1]; // Format: Bearer <token>
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
        req.user = decoded; // Dán ID và thông tin user vào req để dùng cho bước sau
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

module.exports = { verifyToken };
