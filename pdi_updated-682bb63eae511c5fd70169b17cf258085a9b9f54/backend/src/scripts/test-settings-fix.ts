async function testSettings() {
    const url = 'http://localhost:4000/api/v1/settings/institutional_identity_sections';
    try {
        console.log(`--- Testing: ${url} ---`);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
        
        if (response.ok && data.data.setting.key === 'institutional_identity_sections') {
            const sections = JSON.parse(data.data.setting.value);
            console.log(`✅ SUCCESS: Found ${sections.length} sections.`);
        } else {
            console.log('❌ FAILED: Unexpected response.');
        }
    } catch (err: any) {
        console.error('❌ FAILED: Error calling API:', err.message);
    }
}

testSettings();
