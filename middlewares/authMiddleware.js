const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Middleware xác thực Token (Kiểm tra xem đã đăng nhập chưa)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Không tìm thấy Token. Vui lòng đăng nhập!' });
    }

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Định dạng Token không đúng hoặc không tìm thấy!' });
        }

        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('❌ Lỗi xác thực Token:', err.message);
        return res.status(401).json({ message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!' });
    }
};

// 2. Middleware kiểm tra quyền ADMIN
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền Quản trị viên!' });
    }
};

// 3. Middleware kiểm tra quyền CHỦ SÂN (Field Owner)
const isFieldOwner = (req, res, next) => {
    if (req.user && (req.user.role === 'field_owner' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền Chủ sân!' });
    }
};

module.exports = { verifyToken, isAdmin, isFieldOwner };
