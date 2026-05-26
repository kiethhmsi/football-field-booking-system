const db = require('./config/db');

async function checkImages() {
    try {
        const [fields] = await db.execute("SELECT id, name, avatar_url FROM fields");
        console.log("FIELDS:", JSON.stringify(fields, null, 2));
        
        const [pitches] = await db.execute("SELECT id, name, type FROM pitches");
        console.log("PITCHES:", JSON.stringify(pitches, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();
