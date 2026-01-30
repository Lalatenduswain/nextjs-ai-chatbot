# Using Your Existing Cloudflare Token

You already have Cloudflare credentials. Let's test if they work with Workers AI!

## Option 1: Test Your Existing Token (Quick)

Your existing scoped token: `dihS8g2oaTp8ZEm454CkzqMatWmerIwXfF_gt6R4`

### Test it:

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/fe867c47829b4a3be82e1ad1401e724f/ai/run/@cf/meta/llama-2-7b-chat-int8" \
  -H "Authorization: Bearer dihS8g2oaTp8ZEm454CkzqMatWmerIwXfF_gt6R4" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### If it works:
✅ You'll see a response with AI-generated text

**Then add to Vercel:**
- Variable: `CLOUDFLARE_API_TOKEN`
- Value: `dihS8g2oaTp8ZEm454CkzqMatWmerIwXfF_gt6R4`

### If it fails:
❌ Error: "insufficient permissions" or "unauthorized"

**Then proceed to Option 2** (create new token)

---

## Option 2: Create Workers AI-Specific Token (Recommended)

Even if your existing token works, it's better to create a dedicated token for security.

### Step 1: Create Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens

2. Click **"Create Token"**

3. Click **"Create Custom Token"**

4. Configure:
   ```
   Token name: Workers AI API Token

   Permissions:
   - Account → Workers AI → Edit
   - Account → Account Settings → Read

   Account Resources:
   - Include → Specific account → Select your account

   TTL: Start immediately, No expiration
   ```

5. Click **"Continue to summary"**

6. Click **"Create Token"**

7. **COPY THE TOKEN** - You won't see it again!

### Step 2: Add to Vercel

1. Go to: https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot/settings/environment-variables

2. Add new variable:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: `your-new-token-here`
   - **Environments**: ✓ Production ✓ Preview ✓ Development

3. Click **"Save"**

### Step 3: Redeploy

Vercel will auto-deploy when you push to GitHub, or:
- Go to Deployments tab
- Click ••• → "Redeploy"

---

## Option 3: Use Global API Key (Not Recommended)

Your Global API Key: `b9807c787a0db51c73ac97f61a18c7881947a`

⚠️ **Warning**: Global API keys have full account access. Use tokens instead!

If you must use it:

### For Workers AI API calls:

Use this format:
```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/fe867c47829b4a3be82e1ad1401e724f/ai/run/@cf/meta/llama-2-7b-chat-int8" \
  -H "X-Auth-Email: lalatendu.swain@gmail.com" \
  -H "X-Auth-Key: b9807c787a0db51c73ac97f61a18c7881947a" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**However**, the Next.js app expects a Bearer token format, so you'll need to:
- Use Option 1 (test scoped token) or
- Use Option 2 (create new token)

---

## Quick Test Script

Save this to test your token:

```bash
#!/bin/bash

# Test Cloudflare Workers AI token
TOKEN="your-token-here"
ACCOUNT_ID="fe867c47829b4a3be82e1ad1401e724f"

echo "Testing Workers AI..."
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/run/@cf/meta/llama-2-7b-chat-int8" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Say hello in 5 words"}
    ],
    "stream": false
  }' | jq '.'

echo ""
echo "If you see a response above, your token works! ✅"
echo "If you see an error, create a new token with Workers AI permissions."
```

---

## Recommended Approach

**For Maximum Security and Convenience:**

1. ✅ Create a **NEW** token specifically for Workers AI
2. ✅ Set minimal permissions (Workers AI → Edit only)
3. ✅ Add to Vercel environment variables
4. ✅ Keep your existing tokens for other purposes

**Benefits:**
- Separate concerns (one token per purpose)
- Easy to revoke if needed
- Minimal attack surface
- Better audit trail

---

## After Setup

Once your token is in Vercel, test it:

1. Wait for auto-deploy (~2 minutes)

2. Visit: https://nextjs-ai-chatbot-4t5t4r8kb-lalatenduswains-projects.vercel.app/providers

3. Select **"Workers AI"** provider

4. Send a test message

5. Check logs in Vercel dashboard

If you see responses, you're all set! 🎉

---

## Troubleshooting

### "Insufficient permissions"
- Your token doesn't have Workers AI permissions
- Create a new token with correct permissions

### "Unauthorized"
- Token is invalid or expired
- Recreate the token

### "Account not found"
- Wrong account ID
- Check: https://dash.cloudflare.com/ (your account ID is in the URL)

### "Rate limited"
- Free tier: 10,000 neurons/day
- Wait 24 hours or upgrade to paid plan

---

## Summary

**Quickest path:**

1. Try your existing scoped token first
2. If it doesn't work, create a new Workers AI token
3. Add to Vercel environment variables
4. Wait for auto-deploy
5. Test at /providers route

**Need help?** Check the full guide: `WORKERS_AI_SETUP.md`
