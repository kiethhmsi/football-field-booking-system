const isAdmin = (req, res, next) => {
    // req.user đã được nạp từ authMiddleware trước đó
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Bạn không có quyền quản trị!' });
    }
};

module.exports = isAdmin;
