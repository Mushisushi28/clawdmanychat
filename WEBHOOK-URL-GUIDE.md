# What is a Webhook URL?

A webhook URL is a public internet address that ManyChat can send data to when something happens (like when a user sends a message).

## The Problem

Your computer is not directly accessible from the internet. ManyChat (and other services) can't send POST requests to `http://localhost:3000` - that only works on your machine.

## The Solution

You need to expose your local server to the public internet. There are two ways:

### Option 1: Development (Quick & Free)

**Use ngrok** - A tool that creates a secure tunnel to your local machine.

1. **Install ngrok:**
   - Download from https://ngrok.com/download
   - Or run: `choco install ngrok` (if you have Chocolatey)

2. **Start your webhook server:**
   ```bash
   cd C:\Users\isaac\clawd\manychat-webhook
   npm install
   npm start
   ```

3. **In a new terminal, run ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL from ngrok output:**
   ```
   Forwarding   https://abc123-def456.ngrok-free.app -> http://localhost:3000
   ```

5. **Your webhook URL is:** `https://abc123-def456.ngrok-free.app/webhook`

6. **Use this URL in ManyChat's External Request action**

**Note:** Every time you restart ngrok, you get a new URL. You'd need to update ManyChat each time. Paid ngrok lets you use a consistent subdomain.

### Option 2: Production (Permanent)

Deploy your webhook server to a cloud service:

**Free Options:**
- **Render:** https://render.com - Easy deployment, free tier available
- **Railway:** https://railway.app - Simple, good for Node.js apps
- **Vercel:** https://vercel.com - Great for Node.js apps

**Steps (using Render as example):**

1. Create a GitHub repo with this code
2. Sign up for Render
3. Click "New Web Service"
4. Connect your GitHub repo
5. Configure build and start settings
6. Deploy

Render will give you a permanent URL like:
`https://your-webhook-server.onrender.com/webhook`

## Quick Summary

| Method | Cost | URL Stability | Best For |
|--------|------|---------------|----------|
| ngrok (free) | Free | Changes every restart | Development/testing |
| ngrok (paid) | Paid | Custom subdomain | Development/staging |
| Render/Railway/Vercel | Free tier | Permanent | Production |

## For Now

I recommend using **ngrok** to test this out. Once it's working, we can talk about deploying it somewhere permanent if needed.

## Security Note

Anyone with your webhook URL can send POST requests to it. For production:
- Add authentication (API key, secret token)
- Validate the request is actually from ManyChat
- Use HTTPS only (ngrok and cloud services provide this)
