const fetch = require('node-fetch');

async function testTimeSlots() {
    const baseUrl = 'http://localhost:3000/api/fields/admin';
    
    console.log('--- Testing Admin Time Slots API ---');
    
    try {
        // 1. Get Fields
        console.log('1. Fetching fields...');
        const resFields = await fetch(`${baseUrl}/fields`);
        const dataFields = await resFields.json();
        console.log('Fields count:', dataFields.data?.length || 0);
        
        if (dataFields.data && dataFields.data.length > 0) {
            const fieldId = dataFields.data[0].id;
            
            // 2. Get Time Slots
            console.log(`2. Fetching time slots for field ${fieldId}...`);
            const resSlots = await fetch(`${baseUrl}/time-slots/${fieldId}?pitchType=5_nguoi`);
            const dataSlots = await resSlots.json();
            console.log('Slots count:', dataSlots.data?.length || 0);
            
            if (dataSlots.data && dataSlots.data.length > 0) {
                const slot = dataSlots.data[0];
                
                // 3. Toggle Status
                console.log(`3. Toggling status for slot ${slot.id}...`);
                const resToggle = await fetch(`${baseUrl}/time-slots/${slot.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_active: !slot.is_active })
                });
                console.log('Toggle response:', resToggle.status);
            }
        }
    } catch (err) {
        console.error('Test failed:', err.message);
    }
}

testTimeSlots();
