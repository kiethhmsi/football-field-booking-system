const db = require('./config/db');

async function insertPitches() {
    try {
        // 1. Lấy ID của cụm sân đầu tiên
        const [fields] = await db.execute('SELECT id FROM fields LIMIT 1');
        if (fields.length === 0) {
            console.error('❌ Không tìm thấy cụm sân nào!');
            process.exit(1);
        }
        const fieldId = fields[0].id;

        // 2. Chuẩn bị 30 sân
        const pitches = [];
        
        // Sân 5 người
        for (let i = 1; i <= 10; i++) {
            pitches.push({ name: `Sân 5 - ${i < 10 ? '0' + i : i}`, type: '5_nguoi' });
        }

        // Sân 7 người
        for (let i = 1; i <= 10; i++) {
            pitches.push({ name: `Sân 7 - ${i < 10 ? '0' + i : i}`, type: '7_nguoi' });
        }

        // Sân 11 người
        for (let i = 1; i <= 10; i++) {
            pitches.push({ name: `Sân 11 - ${i < 10 ? '0' + i : i}`, type: '11_nguoi' });
        }

        console.log(`⏳ Đang chèn 30 sân vào Field ID ${fieldId}...`);

        for (const p of pitches) {
            await db.execute(
                'INSERT INTO pitches (field_id, name, type, status) VALUES (?, ?, ?, ?)',
                [fieldId, p.name, p.type, 'active']
            );
        }

        console.log('✅ ĐÃ CẬP NHẬT ĐỦ 30 SÂN THÀNH CÔNG! 🎉');
        process.exit(0);
    } catch (err) {
        console.error('💥 LỖI:', err.message);
        process.exit(1);
    }
}

insertPitches();
