const db = require('./config/db');

async function fixDatabase() {
    try {
        console.log('Checking bookings table...');
        const [columns] = await db.execute('SHOW COLUMNS FROM bookings');
        const hasNotes = columns.some(c => c.Field === 'notes');
        
        if (!hasNotes) {
            console.log('Adding notes column...');
            await db.execute('ALTER TABLE bookings ADD COLUMN notes TEXT NULL AFTER status');
            console.log('Notes column added successfully.');
        } else {
            console.log('Notes column already exists.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error fixing database:', err);
        process.exit(1);
    }
}

fixDatabase();
