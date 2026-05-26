const db = require('../config/db');

// --- LẤY DANH SÁCH KHUNG GIỜ THEO CỤM SÂN ---
const getTimeSlotsByField = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const { pitchType, dayType } = req.query; // Tùy chọn lọc theo loại sân và ngày

        let query = 'SELECT * FROM time_slots WHERE field_id = ?';
        const params = [fieldId];

        if (pitchType) {
            query += ' AND pitch_type = ?';
            params.push(pitchType);
        }
        if (dayType) {
            query += ' AND day_type = ?';
            params.push(dayType);
        }

        query += ' ORDER BY start_time ASC';

        const [slots] = await db.execute(query, params);
        res.json({ message: 'Thành công', data: slots });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- THÊM KHUNG GIỜ MỚI ---
const createTimeSlot = async (req, res) => {
    try {
        const { field_id, pitch_type, day_type, start_time, end_time, category, price } = req.body;
        
        // Kiểm tra trùng lặp khung giờ (tùy chọn nhưng nên có)
        
        const [result] = await db.execute(
            'INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [field_id, pitch_type, day_type || 'weekday', start_time, end_time, category || 'normal', price]
        );
        
        res.status(201).json({ message: 'Thêm khung giờ thành công', slotId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- CẬP NHẬT KHUNG GIỜ ---
// Hỗ trợ 2 chế độ:
// 1. Cập nhật đơn lẻ (truyền price + day_type)
// 2. Cập nhật cả cặp ngày thường + cuối tuần (truyền weekday_price + weekend_price + start_time + end_time)
const updateTimeSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { pitch_type, day_type, start_time, end_time, category, price, is_active, weekday_price, weekend_price, field_id } = req.body;
        
        // Nếu có weekday_price và weekend_price → cập nhật cả cặp theo start/end time
        if (weekday_price !== undefined && weekend_price !== undefined) {
            // Lấy thông tin slot hiện tại để biết field_id và pitch_type
            const [existing] = await db.execute('SELECT * FROM time_slots WHERE id = ?', [id]);
            if (existing.length === 0) return res.status(404).json({ message: 'Không tìm thấy khung giờ' });
            
            const slot = existing[0];
            const fid = field_id || slot.field_id;
            const ptype = pitch_type || slot.pitch_type;
            const stime = start_time || slot.start_time;
            const etime = end_time || slot.end_time;
            
            // Cập nhật weekday
            await db.execute(
                'UPDATE time_slots SET start_time = ?, end_time = ?, price = ?, category = ? WHERE field_id = ? AND pitch_type = ? AND day_type = ? AND start_time = ?',
                [stime, etime, parseInt(weekday_price), 'normal', fid, ptype, 'weekday', slot.start_time]
            );
            // Cập nhật weekend
            await db.execute(
                'UPDATE time_slots SET start_time = ?, end_time = ?, price = ?, category = ? WHERE field_id = ? AND pitch_type = ? AND day_type = ? AND start_time = ?',
                [stime, etime, parseInt(weekend_price), 'normal', fid, ptype, 'weekend', slot.start_time]
            );
        } else {
            // Cập nhật đơn lẻ (legacy)
            await db.execute(
                'UPDATE time_slots SET pitch_type = ?, day_type = ?, start_time = ?, end_time = ?, category = ?, price = ?, is_active = ? WHERE id = ?',
                [pitch_type, day_type, start_time, end_time, category || 'normal', price, is_active, id]
            );
        }
        
        res.json({ message: 'Cập nhật khung giờ thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- XÓA KHUNG GIỜ ---
const deleteTimeSlot = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM time_slots WHERE id = ?', [id]);
        res.json({ message: 'Xóa khung giờ thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// --- BẬT/TẮT TRẠNG THÁI KHUNG GIỜ ---
// --- KIỂM TRA KHUNG GIỜ TRỐNG ---
const getAvailableSlots = async (req, res) => {
    try {
        const { field_id, pitch_id, date, pitch_type } = req.query;

        if (!field_id || !date) {
            return res.status(400).json({ message: 'Thiếu thông tin field_id hoặc date' });
        }

        // Mapping pitch_type
        const typeMapping = {
            'Sân 5': '5_nguoi',
            'Sân 7': '7_nguoi',
            'Sân 11': '11_nguoi'
        };
        const mappedType = typeMapping[pitch_type] || pitch_type;

        // 1. Lấy tất cả khung giờ của cụm sân này
        const day = new Date(date).getDay();
        const dayType = (day === 0 || day === 6) ? 'weekend' : 'weekday';

        let query = 'SELECT * FROM time_slots WHERE field_id = ? AND day_type = ? AND is_active = 1';
        const params = [field_id, dayType];

        if (mappedType) {
            query += ' AND pitch_type = ?';
            params.push(mappedType);
        }

        const [allSlots] = await db.execute(query, params);

        // 2. Lấy các đơn đặt sân đã được xác nhận hoặc đang chờ xử lý vào ngày đó
        let bookingQuery = 'SELECT start_time, end_time, pitch_id FROM bookings WHERE booking_date = ? AND status != "cancelled"';
        const bookingParams = [date];

        if (pitch_id) {
            bookingQuery += ' AND pitch_id = ?';
            bookingParams.push(pitch_id);
        }

        const [bookedSlots] = await db.execute(bookingQuery, bookingParams);

        // 3. Đánh dấu khung giờ nào đã có người đặt
        const results = allSlots.map(slot => {
            const isBooked = bookedSlots.some(booking => 
                (pitch_id ? (booking.pitch_id == pitch_id) : true) &&
                booking.start_time === slot.start_time && 
                booking.end_time === slot.end_time
            );
            return {
                ...slot,
                status: isBooked ? 'booked' : 'available'
            };
        });

        res.json({ message: 'Thành công', data: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

const toggleTimeSlotStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await db.execute('UPDATE time_slots SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

module.exports = {
    getTimeSlotsByField,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlotStatus,
    getAvailableSlots
};
