const db = require('./config/db');

async function updateBooking() {
    try {
        const [user] = await db.execute("SELECT id FROM users WHERE phone_number = '0346201787' OR full_name LIKE '%Kiet%'");
        if (user.length > 0) {
            const userId = user[0].id;
            await db.execute("UPDATE bookings SET status = 'completed' WHERE user_id = ? LIMIT 1", [userId]);
            console.log("✅ Đã cập nhật 1 đơn hàng sang trạng thái HOÀN THÀNH cho user ID:", userId);
        } else {
            console.log("❌ Không tìm thấy user.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateBooking();
