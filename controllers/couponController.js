const db = require('../config/db');

const getAllCoupons = async (req, res) => {
    try {
        const [coupons] = await db.execute('SELECT * FROM coupons ORDER BY id DESC');
        res.json({ message: 'Thành công', data: coupons });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, max_discount, expiry_date } = req.body;
        await db.execute(
            'INSERT INTO coupons (code, discount_type, discount_value, max_discount, expiry_date) VALUES (?, ?, ?, ?, ?)',
            [code, discount_type, discount_value, max_discount || null, expiry_date]
        );
        res.status(201).json({ message: 'Tạo mã giảm giá thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const updateCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await db.execute('UPDATE coupons SET is_active = ? WHERE id = ?', [is_active, id]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM coupons WHERE id = ?', [id]);
        res.json({ message: 'Xóa mã giảm giá thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getAllCoupons, createCoupon, updateCouponStatus, deleteCoupon };
