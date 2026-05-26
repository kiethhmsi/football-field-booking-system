const db = require('./config/db');

async function checkData() {
    try {
        const [rows] = await db.execute('SELECT id, team_id, creator_id, host_team_name, title, status FROM open_matches ORDER BY id DESC LIMIT 5');
        console.log('--- 5 KÈO MỚI NHẤT TRONG DB ---');
        console.table(rows);
        
        const [users] = await db.execute('SELECT id, full_name FROM users LIMIT 5');
        console.log('--- DANH SÁCH USER ---');
        console.table(users);
        
        process.exit(0);
    } catch (err) {
        console.error('Lỗi:', err);
        process.exit(1);
    }
}

checkData();
