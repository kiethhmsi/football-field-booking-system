const db = require('./config/db');

async function checkFields() {
    try {
        const [fields] = await db.execute('SELECT * FROM fields');
        console.log('--- FIELDS ---');
        console.table(fields.map(f => ({ id: f.id, name: f.name })));
        
        const [pitches] = await db.execute('SELECT * FROM pitches');
        console.log('--- PITCHES ---');
        console.table(pitches.map(p => ({ id: p.id, field_id: p.field_id, name: p.name })));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkFields();
