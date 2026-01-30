import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MANYCHAT_API_TOKEN = process.env.MANYCHAT_API_TOKEN;
const CLAWDBOT_GATEWAY_URL = process.env.CLAWDBOT_GATEWAY_URL || 'http://127.0.0.1:18789';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { subscriber_id, message_text, sender_id, timestamp } = req.body;

    if (!subscriber_id || !message_text) {
      console.error('Missing required fields:', { subscriber_id, message_text });
      return res.status(400).json({ error: 'Missing subscriber_id or message_text' });
    }

    console.log('Received webhook:', { subscriber_id, message_text, sender_id });

    // Acknowledge webhook immediately
    res.status(200).json({ status: 'received', message: 'Processing...' });

    // Each subscriber gets their own persistent subagent session
    const subagentLabel = `manychat-${subscriber_id}`;

    // Check if session already exists
    let sessionExists = false;
    try {
      const listResponse = await fetch(`${CLAWDBOT_GATEWAY_URL}/api/sessions/list?limit=100`);
      if (listResponse.ok) {
        const sessions = await listResponse.json();
        sessionExists = sessions.some(s => s.label === subagentLabel);
        console.log(`Session for ${subagentLabel} exists:`, sessionExists);
      }
    } catch (error) {
      console.error('Error checking for existing session:', error);
    }

    let subagentResponse;

    if (sessionExists) {
      // Send message to existing session (keeps memory)
      console.log('Sending message to existing session');
      const sendResponse = await fetch(`${CLAWDBOT_GATEWAY_URL}/api/sessions/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: subagentLabel,
          message: message_text,
          timeoutSeconds: 60
        })
      });

      if (!sendResponse.ok) {
        throw new Error(`Failed to send to session: ${sendResponse.statusText}`);
      }

      // Wait for response from existing session
      subagentResponse = await waitForSubagentResult(subagentLabel, 55000);
    } else {
      // Spawn new session for this subscriber
      console.log('Spawning new session for subscriber');
      const spawnResponse = await fetch(`${CLAWDBOT_GATEWAY_URL}/api/sessions/spawn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: `User message: ${message_text}`,
          label: subagentLabel,
          cleanup: 'keep', // Keep session alive for unlimited memory
          timeoutSeconds: 60
        })
      });

      if (!spawnResponse.ok) {
        throw new Error(`Failed to spawn subagent: ${spawnResponse.statusText}`);
      }

      const spawnData = await spawnResponse.json();
      console.log('New session spawned:', spawnData);

      // Wait for subagent to respond
      subagentResponse = await waitForSubagentResult(subagentLabel, 55000);
    }

    if (subagentResponse) {
      // Send response back to ManyChat
      await sendManyChatMessage(subscriber_id, subagentResponse);
      console.log('Response sent to ManyChat');
    } else {
      console.error('No response from subagent');
      await sendManyChatMessage(subscriber_id, "I'm sorry, I couldn't process your message right now. Please try again.");
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
    // Don't send error response ManyChat already received 200
  }
});

// Poll subagent for completion
async function waitForSubagentResult(label, timeoutMs) {
  const startTime = Date.now();
  const pollInterval = 2000; // Poll every 2 seconds

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(`${CLAWDBOT_GATEWAY_URL}/api/sessions/history?label=${label}&limit=1`);
      if (response.ok) {
        const history = await response.json();

        // Look for completion message or error
        if (history && history.messages) {
          const lastMessage = history.messages[0];
          if (lastMessage && lastMessage.role === 'assistant') {
            // Extract the response text
            const responseText = extractResponseText(lastMessage);
            if (responseText) {
              return responseText;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error polling subagent:', error);
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  return null; // Timeout
}

// Extract response text from subagent message
function extractResponseText(message) {
  if (typeof message.content === 'string') {
    return message.content;
  }
  if (message.content && message.content.text) {
    return message.content.text;
  }
  if (Array.isArray(message.content)) {
    return message.content.map(c => c.text || '').join('');
  }
  return null;
}

// Send message back to ManyChat
async function sendManyChatMessage(subscriberId, messageText) {
  const url = 'https://api.manychat.com/fb/sending/sendContent';

  const payload = {
    subscriber_id: subscriberId,
    data: {
      version: 'v2',
      content: {
        type: 'facebook', // Change to 'instagram' or 'whatsapp' as needed
        messages: [
          {
            type: 'text',
            text: messageText
          }
        ]
      }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANYCHAT_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`ManyChat API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Message sent to ManyChat:', result);
    return result;

  } catch (error) {
    console.error('Error sending to ManyChat:', error);
    throw error;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`ManyChat webhook server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`\nTo expose this server, use: ngrok http ${PORT}`);
});
