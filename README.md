# ManyChat Webhook Integration

Webhook receiver that forwards ManyChat messages to Clawdbot subagents and sends responses back.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your ManyChat API token
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

## ManyChat Configuration

1. In ManyChat Flow Builder, add an "External Request" action
2. Set method to POST
3. Set URL to your webhook endpoint (e.g., `https://your-domain.com/webhook`)
4. Configure JSON payload with message data:
   ```json
   {
     "subscriber_id": "{{subscriber_id}}",
     "message_text": "{{message_text}}",
     "sender_id": "{{sender_id}}",
     "timestamp": "{{timestamp}}"
   }
   ```

## Webhook URL

To expose this server locally for testing, use ngrok:
```bash
ngrok http 3000
```

This will give you a public HTTPS URL (e.g., `https://abc123.ngrok.io/webhook`) that you can use in ManyChat.

For production, deploy to a service like:
- Vercel
- Render
- Railway
- AWS Lambda
- Any Node.js hosting

## API Endpoints

### POST /webhook
Receives messages from ManyChat and forwards to Clawdbot subagent.

**Request body:**
```json
{
  "subscriber_id": "123456789",
  "message_text": "Hello!",
  "sender_id": "987654321",
  "timestamp": "1704000000"
}
```

**Response:**
- Returns 200 OK when webhook is received
- Subagent response is sent back via ManyChat API asynchronously

### GET /health
Health check endpoint.

## How It Works

1. ManyChat sends POST to `/webhook` with message data
2. Server extracts message text and subscriber ID
3. Server checks if a session already exists for this subscriber
   - **If yes**: Sends message to existing session (keeps full conversation memory)
   - **If no**: Spawns new subagent session for this subscriber
4. Subagent processes the message and generates response
5. Server sends response back to ManyChat using SendContent API
6. Message appears in ManyChat conversation

## Unlimited Conversation Memory

Each subscriber gets their own **persistent subagent session** that remembers everything:
- Session label: `manychat-{subscriber_id}`
- Sessions are never deleted (cleanup: 'keep')
- Full conversation history is maintained
- The subagent remembers previous context, preferences, and conversations

This means if a user says "My name is Alice", then later says "What's my name?", the subagent will remember it's Alice.
