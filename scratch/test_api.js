const fetch = require('node-fetch');

async function testDetail() {
    try {
        console.log('Testing GET /api/fields/1 ...');
        const res = await fetch('http://localhost:3000/api/fields/1');
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

testDetail();
