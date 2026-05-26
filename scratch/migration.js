const db = require('../config/db');

async function migrate() {
    try {
        console.log('🚀 Starting Database Migration...');

        // 1. Update bookings table
        console.log('Updating bookings table...');
        await db.execute(`
            ALTER TABLE bookings 
            MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'paid', 'completed', 'pending_payment', 'pending_confirmation', 'awaiting_match') DEFAULT 'pending'
        `);
        
        // Add booking_type if not exists
        try {
            await db.execute(`ALTER TABLE bookings ADD COLUMN booking_type ENUM('private', 'matchmaking') DEFAULT 'private' AFTER status`);
            console.log('✅ Added booking_type column to bookings.');
        } catch (err) {
            console.log('ℹ️ booking_type column might already exist.');
        }

        // 2. Update open_matches table
        console.log('Updating open_matches table...');
        try {
            await db.execute(`ALTER TABLE open_matches ADD COLUMN booking_id INT AFTER field_id`);
            console.log('✅ Added booking_id column to open_matches.');
        } catch (err) {
            console.log('ℹ️ booking_id column might already exist.');
        }

        try {
            await db.execute(`
                ALTER TABLE open_matches 
                ADD CONSTRAINT fk_match_booking 
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
            `);
            console.log('✅ Added foreign key constraint fk_match_booking.');
        } catch (err) {
            console.log('ℹ️ Foreign key constraint might already exist.');
        }

        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
