const db = require('./config/db');

async function addPaymentMethodColumn() {
    try {
        await db.execute(`
            ALTER TABLE bookings 
            ADD COLUMN payment_method ENUM('cash', 'transfer') DEFAULT 'cash' AFTER deposit_amount
        `);
        console.log('✅ Đã thêm cột payment_method vào bảng bookings!');
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('ℹ️ Cột payment_method đã tồn tại.');
            process.exit(0);
        }
        console.error('❌ Lỗi khi thêm cột:', err.message);
        process.exit(1);
    }
}

addPaymentMethodColumn();
