const db = require('../config/db');

// --- LẤY DANH SÁCH SÂN BÓNG (Tích hợp Tìm kiếm & Lọc) ---
const getAllFields = async (req, res) => {
    try {
        const { search, type } = req.query; // Nhận param từ query URL 
        let query = 'SELECT id, name, type, address, base_price, avatar_url, status FROM fields WHERE is_deleted = 0 AND status = "active"';
        const params = [];

        // Tính năng Lọc Tìm kiếm Tên Sân
        if (search) {
            query += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }
        
        // Tính năng Lọc Loại Sân (Ví dụ: 7_nguoi)
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY created_at DESC';

        const [fields] = await db.execute(query, params);
        res.json({ message: 'Lấy danh sách sân thành công', data: fields });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- LẤY CHI TIẾT SÂN BÓNG THEO ID ---
const getFieldById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Kéo Thông tin cơ bản Sân
        const [fields] = await db.execute('SELECT * FROM fields WHERE id = ? AND is_deleted = 0', [id]);
        if (fields.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy Sân bóng' });
        }
        const fieldData = fields[0];

        // 2. Kéo Mảng Tiện ích (Amenities) thông qua lệnh JOIN
        const [amenities] = await db.execute(`
            SELECT a.id, a.name, a.icon 
            FROM amenities a
            JOIN field_amenities fa ON a.id = fa.amenity_id
            WHERE fa.field_id = ?
        `, [id]);

        // 3. Kéo Mảng Khung giờ (Time Slots)
        const [timeSlots] = await db.execute(`
            SELECT id, day_type, start_time, end_time, category, price 
            FROM time_slots 
            WHERE field_id = ? AND is_active = 1
            ORDER BY start_time ASC
        `, [id]);

        // Cấu trúc Data Trả ra JSON
        res.json({
            message: 'Thành công',
            data: {
                ...fieldData,
                amenities,   // Lồng ghép mạng tiện ích
                timeSlots    // Lồng ghép mảng giờ trống và bảng giá
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = { getAllFields, getFieldById };
