const db = require('./config/db');

async function debug() {
    try {
        console.log('--- Creating tournaments table ---');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tournaments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                banner_url VARCHAR(500),
                location VARCHAR(255),
                start_date DATE,
                max_teams INT DEFAULT 8,
                current_teams INT DEFAULT 0,
                prize_pool VARCHAR(255),
                entry_fee VARCHAR(255),
                rules TEXT,
                status ENUM('registration', 'ongoing', 'completed') DEFAULT 'registration',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created tournaments');

        console.log('--- Creating tournament_teams table ---');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tournament_teams (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tournament_id INT,
                team_id INT,
                status ENUM('pending', 'confirmed') DEFAULT 'pending',
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created tournament_teams');

        console.log('--- Creating tournament_matches table ---');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tournament_matches (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tournament_id INT,
                round VARCHAR(50),
                team_a_id INT,
                team_b_id INT,
                score_a INT DEFAULT 0,
                score_b INT DEFAULT 0,
                match_date DATETIME,
                winner_id INT,
                status ENUM('scheduled', 'finished') DEFAULT 'scheduled',
                FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created tournament_matches');

    } catch (err) {
        console.error('❌ SQL Error:', err.message);
    } finally {
        process.exit();
    }
}

debug();
