const mysql = require('mysql2/promise');
const fs = require('fs');

async function checkDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Haikiet1!',
            database: 'sanbong'
        });

        let output = '--- Database Check Result ---\n';
        
        const [fields] = await connection.execute('SELECT id, name, status FROM fields');
        output += `Fields found: ${fields.length}\n`;
        output += JSON.stringify(fields, null, 2) + '\n\n';

        const [pitches] = await connection.execute('SELECT id, field_id, name FROM pitches');
        output += `Pitches Count: ${pitches.length}\n`;
        if (pitches.length > 0) {
            output += 'First 5 pitches:\n' + JSON.stringify(pitches.slice(0, 5), null, 2) + '\n';
        }

        fs.writeFileSync('db_check_result.txt', output);
        console.log('Result written to db_check_result.txt');
        
        await connection.end();
    } catch (err) {
        fs.writeFileSync('db_check_result.txt', 'Error: ' + err.message);
    }
}

checkDb();
