const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Webhook endpoint to receive data from ManyChat via Render server
app.post('/webhook', (req, res) => {
  try {
    const data = req.body;
    console.log('Received webhook data from ManyChat:', {
      subscriber_id: data.subscriber_id,
      message_text: data.message_text,
      timestamp: data.timestamp
    });

    // Process the message based on content
    let responseMessage = '';
    
    if (data.message_text && data.message_text.toLowerCase() === 'lethbridge') {
      responseMessage = 'Lethbridge is a city in Alberta, Canada. What would you like to know about it?';
    } else {
      responseMessage = `Received your message: "${data.message_text}"`;
    }

    // Send response back to ManyChat through the Render server
    console.log('Processing message and preparing response:', responseMessage);
    
    res.json({
      status: 'success',
      message: 'Webhook received and processed',
      response: responseMessage
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
  console.log(`Clawdbot webhook receiver running on port ${port}`);
  console.log(`Webhook endpoint available at: http://localhost:${port}/webhook`);
});