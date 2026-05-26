const db = require('../config/db');

(async () => {
    try {
        const [columns] = await db.execute('DESCRIBE tournament_matches');
        console.log('Columns in tournament_matches:', columns.map(c => c.Field));
    } catch (err) {
        console.error('Error describing table:', err.message);
    } finally {
        process.exit();
    }
})();
