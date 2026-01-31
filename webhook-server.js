const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  try {
    const data = req.body;
    console.log('Received ManyChat webhook data:', {
      subscriber_id: data.subscriber_id,
      message_text: data.message_text,
      timestamp: data.timestamp
    });

    // Here you can add your processing logic
    // For example: handle the message_text and respond appropriately
    
    // Send success response to ManyChat
    res.json({ 
      status: 'success',
      received: true,
      message: 'Webhook received successfully'
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