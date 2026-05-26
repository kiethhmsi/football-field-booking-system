const db = require('./config/db');

async function initMaintenanceTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS pitch_maintenance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pitch_id INT NOT NULL,
                maintenance_type VARCHAR(255) NOT NULL,
                description TEXT,
                scheduled_date DATE NOT NULL,
                completion_date DATE NULL,
                cost INT DEFAULT 0,
                status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
            )
        `);
        console.log('Pitch maintenance table created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error creating maintenance table:', err);
        process.exit(1);
    }
}

initMaintenanceTable();
