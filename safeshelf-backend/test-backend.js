const axios = require('axios');

async function testBackend() {
    try {
        console.log('Testing Backend API...');
        const response = await axios.get('http://localhost:3000/api/scan/3017620422003');
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Error Data:', error.response.data);
        }
    }
}

testBackend();
