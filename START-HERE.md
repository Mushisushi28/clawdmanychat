# Quick Start - Deploy to Render

## What You'll Need

✅ Git installed (you have it)
✅ GitHub account
✅ ManyChat Pro account (for API access)
✅ ManyChat API token

## Step-by-Step

### 1. Prepare Your ManyChat API Token

1. Log into ManyChat
2. Go to **Settings** → **API**
3. Click **API Tokens**
4. Generate a new token (or use existing)
5. **Copy it somewhere safe** - you'll need it

### 2. Push Code to GitHub

Open a terminal in `C:\Users\isaac\clawd\manychat-webhook`:

```bash
# Create GitHub repo first at: https://github.com/new

git init
git add .
git commit -m "Initial commit"
git branch -M main

# Replace with YOUR GitHub username and repo name
git remote add origin https://github.com/YOUR_USERNAME/manychat-webhook.git
git push -u origin main
```

### 3. Deploy to Render

1. Go to https://render.com
2. **Sign up** with GitHub
3. Click **New +** → **Web Service**
4. **Connect** your GitHub repo (`manychat-webhook`)
5. Configure:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add environment variables:
   - `MANYCHAT_API_TOKEN` = (your token from step 1)
   - `PORT` = `3000`
7. Click **Create Web Service**

### 4. Get Your URL

After ~2-5 minutes, Render will give you:
```
https://manychat-webhook.onrender.com
```

Your webhook URL: `https://manychat-webhook.onrender.com/webhook`

### 5. Configure ManyChat

In ManyChat Flow Builder:

1. Add **External Request** action
2. Method: **POST**
3. URL: `https://manychat-webhook.onrender.com/webhook`
4. JSON Payload:
   ```json
   {
     "subscriber_id": "{{subscriber_id}}",
     "message_text": "{{message_text}}",
     "sender_id": "{{sender_id}}",
     "timestamp": "{{timestamp}}"
   }
   ```

## That's It!

Now when a user sends a message:
1. ManyChat receives it
2. Sends POST to your webhook
3. Webhook spawns a Clawdbot subagent
4. Subagent generates response
5. Response sent back to user via ManyChat

## Files Created

- `server.js` - Main webhook server
- `package.json` - Dependencies
- `.env.example` - Environment template
- `DEPLOY-GUIDE.md` - Detailed deployment instructions
- `WEBHOOK-URL-GUIDE.md` - Explains webhook URLs
- `test-webhook.js` - Test script
- `README.md` - Full documentation

## Need Help?

- **Render docs:** https://render.com/docs
- **ManyChat API docs:** https://api.manychat.com/swagger
- **Ask me** if you get stuck on any step!
