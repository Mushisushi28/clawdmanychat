# Deploy to Render (Free)

## Step 1: Push to GitHub

1. **Create a new GitHub repo:**
   - Go to https://github.com/new
   - Name it something like `manychat-webhook`
   - Make it public (easier to deploy)
   - Click "Create repository"

2. **Initialize git and push:**
   ```bash
   cd C:\Users\isaac\clawd\manychat-webhook
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/manychat-webhook.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)

## Step 2: Deploy to Render

1. **Go to https://render.com**
2. **Sign up** (use GitHub account for easy setup)
3. Click **"New +"** in the top right
4. Select **"Web Service"**
5. **Connect your GitHub repo:**
   - Search for `manychat-webhook`
   - Click "Connect"
6. **Configure settings:**

   **Name:** manychat-webhook (or whatever you want)

   **Branch:** main

   **Runtime:** Node

   **Build Command:** `npm install`

   **Start Command:** `node server.js`

7. **Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add `MANYCHAT_API_TOKEN` = `your_actual_token_here`
   - Add `PORT` = `3000`

8. **Click "Create Web Service"**

## Step 3: Get Your Webhook URL

After a few minutes, Render will finish deploying and give you a URL like:
`https://manychat-webhook.onrender.com`

Your webhook URL is: `https://manychat-webhook.onrender.com/webhook`

## Step 4: Configure ManyChat

1. In ManyChat Flow Builder, add "External Request" action
2. Method: POST
3. URL: `https://manychat-webhook.onrender.com/webhook`
4. JSON payload:
   ```json
   {
     "subscriber_id": "{{subscriber_id}}",
     "message_text": "{{message_text}}",
     "sender_id": "{{sender_id}}",
     "timestamp": "{{timestamp}}"
   }
   ```

## Notes

- **Free tier limitations:**
  - Service spins down after 15 minutes of inactivity
  - Takes ~30 seconds to wake up on first request
  - This is fine for ManyChat (it will retry on timeout)

- **Your ManyChat API token:**
  - Find it in ManyChat → Settings → API → API Tokens
  - Generate a new token if needed

- **Updates:**
  - Push changes to GitHub
  - Render auto-deploys on new commits

## Troubleshooting

**Deploy fails:**
- Check GitHub repo has `package.json` and `server.js`
- Make sure files are committed and pushed

**Webhook not working:**
- Check Render logs (dashboard → Logs)
- Verify `MANYCHAT_API_TOKEN` is set correctly
- Make sure `/webhook` path is correct in ManyChat

**Need to change environment variables:**
- Go to Render dashboard → your service → Environment
- Edit variables → Save changes → Redeploy
