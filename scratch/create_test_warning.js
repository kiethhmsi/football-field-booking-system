const db = require('./config/db');
(async () => {
    try {
        const [pitches] = await db.execute('SELECT id FROM pitches LIMIT 1');
        const [users] = await db.execute('SELECT id FROM users LIMIT 1');
        
        if (pitches.length === 0 || users.length === 0) {
            console.log('Không có dữ liệu sân hoặc người dùng');
            process.exit();
        }

        const pitchId = pitches[0].id;
        const userId = users[0].id;
        const today = new Date().toISOString().split('T')[0];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const startTime = `${oneHourAgo.getHours().toString().padStart(2, '0')}:00:00`;
        const endTime = `${(oneHourAgo.getHours() + 1).toString().padStart(2, '0')}:00:00`;
        const bookingCode = `TEST${Date.now().toString().slice(-4)}`;

        await db.execute(`
            INSERT INTO bookings (
                booking_code, user_id, pitch_id, booking_date, start_time, end_time, 
                total_price, status, check_in_status, payment_method, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [bookingCode, userId, pitchId, today, startTime, endTime, 200000, 'confirmed', 'not_checked_in', 'cash', 'pending']);

        console.log(`Đã tạo đơn hàng test thành công: ${bookingCode}`);
        console.log(`Thời gian bắt đầu: ${startTime} (Quá hạn)`);
        console.log(`Trạng thái: confirmed, Check-in: not_checked_in`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
