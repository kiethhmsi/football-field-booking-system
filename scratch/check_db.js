const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.execute('DESC fields');
        console.log('--- Fields Columns ---');
        rows.forEach(r => console.log(`${r.Field}: ${r.Type}`));
        
        const [tournaments] = await db.execute('DESC tournaments');
        console.log('--- Tournaments Columns ---');
        tournaments.forEach(r => console.log(`${r.Field}: ${r.Type}`));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        process.exit();
    }
}

check();
