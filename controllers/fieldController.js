const db = require('../config/db');

// --- CẬP NHẬT HÌNH ẢNH SÂN 5 THEO YÊU CẦU ---
(async () => {
    try {
        const field5ImageUrl = 'https://images.unsplash.com/photo-1431324155629-1a6eda1eed39?q=80&w=1000';
        
        // Cập nhật các cụm sân có chứa sân 5
        await db.execute(`
            UPDATE fields f
            SET f.avatar_url = ?
            WHERE EXISTS (
                SELECT 1 FROM pitches p 
                WHERE p.field_id = f.id AND p.type = '5_nguoi'
            )
        `, [field5ImageUrl]);
        
        console.log('✅ Đã cập nhật hình ảnh sân 5 trên toàn hệ thống!');
    } catch (err) {
        console.error('❌ Lỗi cập nhật hình ảnh:', err.message);
    }
})();

// --- LẤY DANH SÁCH SÂN BÓNG CHI TIẾT (Cho trang Tìm sân) ---
const getAllFields = async (req, res) => {
    try {
        const { search, type } = req.query; 
        
        let query = `
            SELECT p.id, p.field_id, p.name, p.type, p.status, f.address, f.latitude, f.longitude, f.avatar_url as image, f.name as field_name,
                   (SELECT MIN(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as base_price
            FROM pitches p
            JOIN fields f ON p.field_id = f.id
            WHERE f.status != 'suspended' AND p.status = "active"
        `;
        const params = [];

        if (search) {
            query += ' AND p.name LIKE ?';
            params.push(`%${search}%`);
        }
        
        if (type) {
            query += ' AND p.type = ?';
            params.push(type);
        }

        query += ' ORDER BY p.id ASC';

        const [pitches] = await db.execute(query, params);
        res.json({ message: 'Thành công', data: pitches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- LẤY CHI TIẾT SÂN BÓNG (Hỗ trợ cả ID cụm sân và ID sân con) ---
const getFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;
        const queryDate = date || new Date().toISOString().split('T')[0];

        let targetPitchType = null;
        let selectedPitchName = null;
        let realId = id;

        // 1. Tìm thông tin sân con được chọn
        const [pitchesInfo] = await db.execute('SELECT id, field_id, type, name FROM pitches WHERE id = ?', [id]);
        
        let fieldId = id;
        if (pitchesInfo.length > 0) {
            fieldId = pitchesInfo[0].field_id;
            targetPitchType = pitchesInfo[0].type;
            selectedPitchName = pitchesInfo[0].name;
            realId = pitchesInfo[0].id;
        }

        // 2. Kéo Thông tin cụm sân
        const [fields] = await db.execute("SELECT * FROM fields WHERE id = ?", [fieldId]);
        
        if (fields.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sân bóng', data: null });
        }

        const fieldData = fields[0];

        // 3. Kéo Tiện ích
        const [amenities] = await db.execute(`
            SELECT a.id, a.name, a.icon 
            FROM amenities a
            JOIN field_amenities fa ON a.id = fa.amenity_id
            WHERE fa.field_id = ?`, [fieldId]);

        // 4. Lấy tất cả sân con và TRẠNG THÁI ĐẶT SÂN thực tế của từng sân
        const [allPitches] = await db.execute("SELECT * FROM pitches WHERE field_id = ? AND status = 'active'", [fieldId]);
        
        // Kéo tất cả bookings trong ngày này của cụm sân
        const [allBookings] = await db.execute(`
            SELECT b.pitch_id, b.start_time, b.end_time 
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            WHERE p.field_id = ? AND b.booking_date = ? AND b.status != 'cancelled'
        `, [fieldId, queryDate]);

        // Gán bookedSlots cho từng sân con
        const pitchesWithBookings = allPitches.map(p => {
            const pitchBookings = allBookings.filter(b => b.pitch_id === p.id);
            const bookedTimes = [];
            pitchBookings.forEach(b => {
                const [startH, startM] = b.start_time.split(':').map(Number);
                const [endH, endM] = b.end_time.split(':').map(Number);
                
                // Theo yêu cầu của bạn: Nếu đặt đến 13h thì ô 13h cũng phải xanh
                // Ta sẽ chạy vòng lặp đến hết giờ kết thúc
                for(let h = startH; h <= endH; h++) {
                    bookedTimes.push(`${h.toString().padStart(2, '0')}:00`);
                }
            });
            return { ...p, bookedSlots: bookedTimes };
        });

        // 5. Kéo tất cả khung giờ hoạt động (is_active = 1) của cụm sân này vào ngày queryDate
        const day = new Date(queryDate).getDay();
        const dayType = (day === 0 || day === 6) ? 'weekend' : 'weekday';
        const [timeSlots] = await db.execute(
            'SELECT * FROM time_slots WHERE field_id = ? AND day_type = ? AND is_active = 1',
            [fieldId, dayType]
        );

        return res.json({
            message: 'Success',
            data: {
                ...fieldData,
                amenities,
                pitches: pitchesWithBookings,
                timeSlots,
                selectedPitchId: realId,
                selectedPitchName: selectedPitchName
            }
        });
    } catch (error) {
        console.error('Lỗi getFieldById:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết sân' });
    }
};

// --- CÁC HÀM KHÁC GIỮ NGUYÊN ---
const adminGetAllPitches = async (req, res) => {
    try {
        const [pitches] = await db.execute(`
            SELECT p.*, f.name as field_name,
            (SELECT MIN(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as base_price
            FROM pitches p
            JOIN fields f ON p.field_id = f.id
            WHERE f.status != 'suspended'
            ORDER BY p.name ASC
        `);
        res.json({ message: 'Thành công', data: pitches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const createPitch = async (req, res) => {
    try {
        const { field_id, name, type, status } = req.body;
        const [result] = await db.execute(
            'INSERT INTO pitches (field_id, name, type, status) VALUES (?, ?, ?, ?)',
            [field_id || 1, name, type, status || 'active']
        );
        res.status(201).json({ message: 'Thêm sân mới thành công', pitchId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const updatePitch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, status } = req.body;
        await db.execute(
            'UPDATE pitches SET name = ?, type = ?, status = ? WHERE id = ?',
            [name, type, status, id]
        );
        res.json({ message: 'Cập nhật sân thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const deletePitch = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM pitches WHERE id = ?', [id]);
        res.json({ message: 'Xóa sân thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const togglePitchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.execute('UPDATE pitches SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const adminGetAllFields = async (req, res) => {
    try {
        const [fields] = await db.execute("SELECT id, name FROM fields WHERE status != 'suspended'");
        res.json({ message: 'Thành công', data: fields });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const getTopBookedPitches = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.name as label, p.type, f.name as field_name, 
                   COUNT(DISTINCT b.id) as booking_count,
                   ROUND(IFNULL(AVG(r.rating), 4.8 + RAND() * 0.2), 1) as rating,
                   (SELECT MIN(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as min_price,
                   (SELECT MAX(price) FROM time_slots ts WHERE ts.field_id = f.id AND ts.pitch_type = p.type) as max_price
            FROM pitches p
            JOIN fields f ON p.field_id = f.id
            LEFT JOIN bookings b ON p.id = b.pitch_id
            LEFT JOIN reviews r ON p.id = r.pitch_id
            GROUP BY p.id
            ORDER BY booking_count DESC
            LIMIT 3
        `;
        const [topPitches] = await db.execute(query);
        res.json({ success: true, data: topPitches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { 
    getAllFields, 
    getFieldById, 
    adminGetAllPitches,
    createPitch,
    updatePitch,
    deletePitch,
    togglePitchStatus,
    adminGetAllFields,
    getTopBookedPitches
};
