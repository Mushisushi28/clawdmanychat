const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to forward data to Clawdbot
async function forwardToClawdbot(data) {
  const clawdbotWebhookUrl = 'https://your-clawdbot-webhook-url'; // Replace with your actual Clawdbot webhook URL
  
  try {
    const response = await fetch(clawdbotWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
      },
      body: JSON.stringify(data)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error forwarding to Clawdbot:', error);
    throw error;
  }
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received ManyChat webhook data:', {
      subscriber_id: data.subscriber_id,
      message_text: data.message_text,
      timestamp: data.timestamp
    });

    // Forward data to Clawdbot
    try {
      const clawdbotResponse = await forwardToClawdbot(data);
      console.log('Clawdbot processed:', clawdbotResponse);
    } catch (error) {
      console.error('Forwarding to Clawdbot failed:', error);
    }
    
    // Send success response to ManyChat
    res.json({ 
      status: 'success',
      received: true,
      message: 'Webhook received and forwarded to Clawdbot'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Webhook server running on port ${port}`);
  console.log(`Webhook endpoint available at: http://localhost:${port}/webhook`);
});