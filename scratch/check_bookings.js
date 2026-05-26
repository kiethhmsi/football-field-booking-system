const db = require('../config/db');

(async () => {
    try {
        console.log('--- DIAGNOSTIC SCRIPT ---');
        
        // 1. Kiểm tra tổng số lượng bookings và năm
        const [bookings] = await db.query(`
            SELECT YEAR(booking_date) as year, MONTH(booking_date) as month, status, COUNT(*) as count, SUM(total_price) as sum_rev
            FROM bookings
            GROUP BY YEAR(booking_date), MONTH(booking_date), status
        `);
        console.log('Bookings in DB:', bookings);

        // 2. Kiểm tra sân 5, sân 7, sân 11 có bookings nào không
        const [pitchStats] = await db.query(`
            SELECT p.type, b.status, COUNT(*) as count
            FROM bookings b
            JOIN pitches p ON b.pitch_id = p.id
            GROUP BY p.type, b.status
        `);
        console.log('Pitches & bookings stats:', pitchStats);

        process.exit(0);
    } catch (err) {
        console.error('Error running check:', err);
        process.exit(1);
    }
})();
