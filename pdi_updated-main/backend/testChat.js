
const axios = require('axios');

async function testChat() {
    try {
        console.log('Sending request to /api/v1/ai/chat...');
        const response = await axios.post('http://localhost:3000/api/v1/ai/chat', {
            message: "Hello",
            history: [],
            context: { pageTitle: "Test", url: "/", data: {} }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testChat();
