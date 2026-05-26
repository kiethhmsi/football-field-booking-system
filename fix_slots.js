
const db = require('./config/db');

async function fixSlots() {
    try {
        console.log('Starting to fix slots...');
        
        // Delete old slots for field 1
        await db.execute('DELETE FROM time_slots WHERE field_id = 1');

        const types = ['5_nguoi', '7_nguoi', '11_nguoi'];
        
        for (const pType of types) {
            let startTime = '05:00:00';
            
            while (startTime < '23:00:00') {
                const [h, m] = startTime.split(':').map(Number);
                let endH = h + 1;
                let endM = m + 30;
                if (endM >= 60) {
                    endH += 1;
                    endM -= 60;
                }
                const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

                let price = 200000;
                let cat = 'off_peak';

                if (h >= 17 && h < 22) {
                    price = pType === '5_nguoi' ? 350000 : pType === '7_nguoi' ? 600000 : 1000000;
                    cat = 'peak';
                } else {
                    price = pType === '5_nguoi' ? 200000 : pType === '7_nguoi' ? 400000 : 800000;
                    cat = 'off_peak';
                }

                // Weekday
                await db.execute(
                    'INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [1, pType, 'weekday', startTime, endTime, cat, price, 1]
                );

                // Weekend
                await db.execute(
                    'INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [1, pType, 'weekend', startTime, endTime, cat, price + 50000, 1]
                );

                startTime = endTime;
                if (startTime >= '23:00:00') break;
            }
        }
        
        console.log('✅ Success! Time slots have been updated to 1.5h blocks.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

fixSlots();
