# Update Your Existing Vercel Project

## Your Existing Project
- **URL**: https://nextjs-ai-chatbot-4t5t4r8kb-lalatenduswains-projects.vercel.app
- **Dashboard**: https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot

## 🔄 Option 1: Update via Vercel Dashboard (Easiest - 5 minutes)

### Step 1: Change Git Repository

1. Go to your Vercel project dashboard:
   https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot

2. Click **Settings** → **Git**

3. Click **"Disconnect"** (to disconnect from old repo)

4. Click **"Connect Git Repository"**

5. Select: **`Lalatenduswain/nextjs-ai-chatbot`**
   (The new repo with AI Gateway integration)

6. Click **"Connect"**

### Step 2: Add Environment Variable

1. Go to **Settings** → **Environment Variables**

2. Add (or update) this variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-openai-key-here`
   - **Environment**: Production, Preview, Development

3. Click **"Save"**

### Step 3: Redeploy

1. Go to **Deployments** tab

2. Click the **three dots** (•••) on the latest deployment

3. Click **"Redeploy"**

**OR** just push to GitHub:
```bash
cd /home/ehs/vercel/nextjs-ai-chatbot
git add .
git commit -m "Update to AI Gateway version" --allow-empty
git push
```

Vercel will automatically deploy! ✨

---

## 🔄 Option 2: Update via Git Push (Fastest)

If your existing Vercel project is already connected to a GitHub repo:

### Step 1: Push to Your Existing Repo

Find out which repo your Vercel project uses:
1. Go to https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot/settings/git
2. Check the connected repository name

### Step 2: Push New Code There

```bash
cd /home/ehs/vercel/nextjs-ai-chatbot

# Add your existing repo as remote (replace with your actual repo)
git remote add vercel-project https://github.com/Lalatenduswain/YOUR_EXISTING_REPO.git

# Force push the new code
git push vercel-project main --force

# Or if different branch:
git push vercel-project main:master --force
```

### Step 3: Verify Deployment

1. Vercel will auto-deploy
2. Check: https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot
3. Wait ~2 minutes for deployment

---

## 🔄 Option 3: Manual File Upload

If you prefer not to use Git:

### Step 1: Download Project Files

```bash
cd /home/ehs/vercel/nextjs-ai-chatbot
npm run build
tar -czf nextjs-ai-chatbot-updated.tar.gz .
```

### Step 2: Deploy via Vercel CLI (if you have access token)

```bash
vercel --prod --force
```

Or upload via Vercel dashboard drag-and-drop

---

## ✅ Verify AI Gateway Integration

After deployment, check these:

### 1. Test the Chatbot
Visit: https://nextjs-ai-chatbot-4t5t4r8kb-lalatenduswains-projects.vercel.app
- Send a test message
- Should get streaming response

### 2. Check AI Gateway Analytics
https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway

You should see:
- Request count increasing
- Cache hits (after repeat queries)
- Response times
- Cost savings metrics

### 3. Check Vercel Logs
https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot/logs

Look for:
```
🚀 Using Cloudflare AI Gateway: https://gateway.ai.cloudflare.com/v1/...
🔄 Stream started
✅ Stream completed
```

---

## 🎯 What Changed?

### New Features:
✅ **Cloudflare AI Gateway integration** (`lib/ai-gateway.ts`)
✅ **Cost optimization** - Up to 80% savings through caching
✅ **Rate limiting** - 100 requests/minute
✅ **Analytics** - Full observability dashboard
✅ **Improved streaming** - Better error handling
✅ **Beautiful UI** - Enhanced chat interface

### Updated Files:
- `app/api/chat/route.ts` - Now uses AI Gateway
- `lib/ai-gateway.ts` - New AI Gateway configuration
- `components/Chat.tsx` - Improved UI with stats
- `app/globals.css` - Better styling

---

## 🔧 Environment Variables

Make sure these are set in Vercel:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | `sk-...` | ✅ Yes |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | ❌ Optional |

To check/add:
1. Go to https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot/settings/environment-variables
2. Add or verify `OPENAI_API_KEY`
3. Redeploy if needed

---

## 🆘 Troubleshooting

### Build fails?
1. Check environment variables are set
2. Try redeploying from Vercel dashboard
3. Check build logs for specific errors

### API Gateway not showing requests?
1. Wait a few minutes (analytics may be delayed)
2. Verify the API endpoint is being called
3. Check Vercel function logs

### Old code still showing?
1. Clear browser cache
2. Force redeploy from Vercel
3. Check correct branch is deployed

---

## 📊 Monitor Your Deployment

**Vercel Dashboard**: https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot

**AI Gateway Dashboard**: https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway

**Live App**: https://nextjs-ai-chatbot-4t5t4r8kb-lalatenduswains-projects.vercel.app

---

## 🎉 You're All Set!

After updating, you'll have:
- Same Vercel URL (your existing one)
- AI Gateway integration (cost savings!)
- Better UI and performance
- Full analytics dashboard
- Automatic caching

**Recommended**: Use Option 1 (Vercel Dashboard) - it's the easiest and most reliable!
