// Simple test script to verify webhook server is working
// Run this in a separate terminal after starting the server

const WEBHOOK_URL = 'http://localhost:3000/webhook';

const testPayload = {
  subscriber_id: '123456789',
  message_text: 'Hello, this is a test message!',
  sender_id: '987654321',
  timestamp: Date.now().toString()
};

fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testPayload)
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Webhook test successful!');
    console.log('Response:', data);
  })
  .catch(error => {
    console.error('❌ Webhook test failed:', error);
  });
