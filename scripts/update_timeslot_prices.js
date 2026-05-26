require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

// Bảng giá thực tế từ ảnh người dùng cung cấp
// field_id = 1 (KaSport Complex)
const pricingData = [
  // ======= SÂN 5 =======
  { pitch_type: '5_nguoi', day_type: 'weekday',  start_time: '05:00:00', end_time: '16:00:00', price: 180000 },
  { pitch_type: '5_nguoi', day_type: 'weekend',  start_time: '05:00:00', end_time: '16:00:00', price: 200000 },
  { pitch_type: '5_nguoi', day_type: 'weekday',  start_time: '16:00:00', end_time: '24:00:00', price: 250000 },
  { pitch_type: '5_nguoi', day_type: 'weekend',  start_time: '16:00:00', end_time: '24:00:00', price: 350000 },

  // ======= SÂN 7 =======
  { pitch_type: '7_nguoi', day_type: 'weekday',  start_time: '05:00:00', end_time: '16:00:00', price: 350000 },
  { pitch_type: '7_nguoi', day_type: 'weekend',  start_time: '05:00:00', end_time: '16:00:00', price: 450000 },
  { pitch_type: '7_nguoi', day_type: 'weekday',  start_time: '16:00:00', end_time: '24:00:00', price: 500000 },
  { pitch_type: '7_nguoi', day_type: 'weekend',  start_time: '16:00:00', end_time: '24:00:00', price: 600000 },

  // ======= SÂN 11 =======
  { pitch_type: '11_nguoi', day_type: 'weekday', start_time: '05:00:00', end_time: '16:00:00', price: 800000  },
  { pitch_type: '11_nguoi', day_type: 'weekend', start_time: '05:00:00', end_time: '16:00:00', price: 1000000 },
  { pitch_type: '11_nguoi', day_type: 'weekday', start_time: '16:00:00', end_time: '24:00:00', price: 1200000 },
  { pitch_type: '11_nguoi', day_type: 'weekend', start_time: '16:00:00', end_time: '24:00:00', price: 1500000 },
];

const FIELD_ID = 1;

async function run() {
  console.log('🔄 Bắt đầu cập nhật bảng giá khung giờ...\n');

  for (const row of pricingData) {
    // Kiểm tra xem record đã tồn tại chưa
    const [existing] = await db.execute(
      `SELECT id FROM time_slots 
       WHERE field_id = ? AND pitch_type = ? AND day_type = ? AND start_time = ?`,
      [FIELD_ID, row.pitch_type, row.day_type, row.start_time]
    );

    if (existing.length > 0) {
      // Cập nhật giá
      await db.execute(
        `UPDATE time_slots 
         SET price = ?, end_time = ?, is_active = 1, category = 'normal'
         WHERE field_id = ? AND pitch_type = ? AND day_type = ? AND start_time = ?`,
        [row.price, row.end_time, FIELD_ID, row.pitch_type, row.day_type, row.start_time]
      );
      console.log(`  ✅ CẬP NHẬT: [${row.pitch_type}] ${row.day_type} ${row.start_time.substring(0,5)}-${row.end_time.substring(0,5)} → ${row.price.toLocaleString()}đ/h`);
    } else {
      // Thêm mới nếu chưa có
      await db.execute(
        `INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active)
         VALUES (?, ?, ?, ?, ?, 'normal', ?, 1)`,
        [FIELD_ID, row.pitch_type, row.day_type, row.start_time, row.end_time, row.price]
      );
      console.log(`  ➕ THÊM MỚI: [${row.pitch_type}] ${row.day_type} ${row.start_time.substring(0,5)}-${row.end_time.substring(0,5)} → ${row.price.toLocaleString()}đ/h`);
    }
  }

  console.log('\n🎉 Hoàn tất cập nhật bảng giá!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
