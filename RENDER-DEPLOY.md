# Render Deployment - Do This Now!

## Step 1: Sign Up for Render

Go to: https://render.com

Click **"Sign Up"** and choose "Sign up with GitHub" (easiest option)

## Step 2: Create Web Service

1. After signing in, click **"New +"** in the top right
2. Select **"Web Service"**

## Step 3: Connect GitHub Repo

1. You'll see a list of your GitHub repos
2. Find and click **"clawdmanychat"** (or search for it)
3. Click **"Connect"**

## Step 4: Configure Settings

**Name:** `clawdmanychat` (or whatever you want)

**Region:** Leave as default (Oregon is fine)

**Branch:** `main`

**Runtime:** `Node`

**Root Directory:** Leave empty

**Build Command:** `npm install`

**Start Command:** `node server.js`

## Step 5: Add Environment Variables

1. Click **"Advanced"** (expand it)
2. Scroll to **"Environment Variables"**
3. Click **"Add Environment Variable"**

**Add these two variables:**

| Key | Value |
|-----|-------|
| `MANYCHAT_API_TOKEN` | `815642964958116:aa68c6405f241888a3764ae9467730f0` |
| `PORT` | `3000` |

## Step 6: Deploy!

Click the blue **"Create Web Service"** button

## Step 7: Wait for Deploy

Render will:
- Build your app (~1-2 minutes)
- Start the server (~30 seconds)

You'll see logs rolling by. Wait until it says "Your service is live!"

## Step 8: Get Your URL

Once live, you'll see a URL like:
```
https://clawdmanychat.onrender.com
```

**Your webhook URL is:** `https://clawdmanychat.onrender.com/webhook`

## Step 9: Configure ManyChat

1. Go to ManyChat → Flow Builder
2. Add **"External Request"** action to your flow
3. Configure:
   - **Method:** `POST`
   - **URL:** `https://clawdmanychat.onrender.com/webhook`
   - **JSON Payload:**
     ```json
     {
       "subscriber_id": "{{subscriber_id}}",
       "message_text": "{{message_text}}",
       "sender_id": "{{sender_id}}",
       "timestamp": "{{timestamp}}"
     }
     ```

## Step 10: Test It!

Send a test message through ManyChat. You should see:
1. Message hits your webhook (check Render logs)
2. Clawdbot subagent spawns
3. Response sent back to ManyChat
4. User receives reply

---

## Done! 🎉

Your ManyChat → Clawdbot integration is now live!

**Important Notes:**
- Render free tier spins down after 15 min of inactivity
- First request after idle takes ~30 sec to wake up
- ManyChat will retry if it times out (it's fine)
- To check logs: Go to Render → your service → Logs tab

**To update code:**
1. Make changes locally
2. `git add . && git commit -m "update" && git push`
3. Render auto-deploys new commits
