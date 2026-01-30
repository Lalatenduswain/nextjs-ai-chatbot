# Cloudflare Workers AI Integration Guide

## 🎉 Why Use Workers AI?

✅ **FREE Tier** - 10,000 neurons per day (plenty for development!)
✅ **Fast** - Runs on Cloudflare's edge network
✅ **No External APIs** - Everything stays within Cloudflare
✅ **Multiple Models** - Llama 2, Mistral, Gemma, and more
✅ **Combined with AI Gateway** - Get analytics, caching, and rate limiting

## 📊 Free Tier Limits

- **10,000 neurons/day** for free
- 1 neuron ≈ 1 token (approximate)
- ~300-500 chat messages per day on free tier
- Upgrade to Workers Paid plan for unlimited usage

## 🚀 Setup Guide

### Step 1: Get Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens

2. Click **"Create Token"**

3. Click **"Create Custom Token"**

4. Configure the token:
   - **Token name**: `Workers AI API Token`
   - **Permissions**:
     - Account → Workers AI → Edit
     - Account → Account Settings → Read
   - **Account Resources**:
     - Include → Your Account

5. Click **"Continue to summary"**

6. Click **"Create Token"**

7. **COPY THE TOKEN** (you won't see it again!)
   - Format: `your-token-here`

### Step 2: Add Token to Your Project

#### For Local Development:

```bash
cd /home/ehs/vercel/nextjs-ai-chatbot
cp .env.example .env
```

Edit `.env` and add:
```env
CLOUDFLARE_API_TOKEN=your-token-here
AI_PROVIDER=workers-ai
```

#### For Vercel Deployment:

1. Go to https://vercel.com/lalatenduswains-projects/nextjs-ai-chatbot/settings/environment-variables

2. Add new variable:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: `your-token-here`
   - **Environments**: ✓ Production ✓ Preview ✓ Development

3. Optional: Add `AI_PROVIDER` to choose default:
   - **Name**: `AI_PROVIDER`
   - **Value**: `workers-ai`

4. Redeploy your project

### Step 3: Test It!

#### Local Testing:

```bash
npm run dev
```

Open http://localhost:3000 and start chatting!

#### Vercel Testing:

Visit your Vercel URL and test the chatbot.

---

## 🎯 Available API Endpoints

Your chatbot now has 3 API endpoints:

### 1. `/api/chat-workers` - Workers AI Only
Uses Cloudflare Workers AI (FREE!)

**Models Available:**
- `@cf/meta/llama-2-7b-chat-int8` (default, recommended)
- `@cf/mistral/mistral-7b-instruct-v0.1` (good for coding)
- `@hf/google/gemma-7b-it` (Google's Gemma)
- `@cf/meta/codellama-7b-instruct-awq` (specialized for code)

### 2. `/api/chat` - OpenAI via AI Gateway
Uses OpenAI API through Cloudflare AI Gateway (requires `OPENAI_API_KEY`)

**Features:**
- 80% cost savings via caching
- Rate limiting
- Analytics

### 3. `/api/chat-hybrid` - Smart Selection
Automatically chooses the best provider (defaults to Workers AI)

**Logic:**
- Uses Workers AI by default (FREE!)
- Falls back to OpenAI if specified
- Configurable via `AI_PROVIDER` env variable

---

## 🎨 Using Different Models

### Change Workers AI Model

Add to your `.env`:
```env
WORKERS_AI_MODEL=@cf/mistral/mistral-7b-instruct-v0.1
```

Or in Vercel environment variables.

### Available Models:

| Model | Description | Best For |
|-------|-------------|----------|
| `@cf/meta/llama-2-7b-chat-int8` | Llama 2 7B (default) | General chat, Q&A |
| `@cf/mistral/mistral-7b-instruct-v0.1` | Mistral 7B | Coding, technical |
| `@hf/google/gemma-7b-it` | Google Gemma 7B | Creative writing |
| `@cf/meta/codellama-7b-instruct-awq` | Code Llama 7B | Code generation |

---

## 💡 UI with Provider Selection

Use the enhanced Chat component to let users choose their provider:

**Update `app/page.tsx`:**

```typescript
import ChatWithProviderSelect from '@/components/ChatWithProviderSelect';

export default function Home() {
  return <ChatWithProviderSelect />;
}
```

This gives users a UI to switch between:
- **Workers AI** (FREE)
- **OpenAI + Gateway** (Optimized)
- **Hybrid** (Smart selection)

---

## 📊 Monitor Usage

### Workers AI Analytics

1. Go to https://dash.cloudflare.com/

2. Select your account

3. Go to **Workers & Pages** → **AI**

4. View:
   - Neurons used
   - Requests per model
   - Performance metrics

### AI Gateway Analytics

https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway

Track:
- Request count
- Cache hits
- Cost savings (for OpenAI)
- Response times

---

## 🔧 Advanced Configuration

### Use Multiple Providers

```typescript
// In your component
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat-hybrid',
  body: {
    provider: 'workers-ai', // or 'openai'
  },
});
```

### Custom Model Selection

```typescript
// In your API route
const model = process.env.WORKERS_AI_MODEL || '@cf/meta/llama-2-7b-chat-int8';
```

### Rate Limiting

Workers AI has built-in rate limiting:
- 10,000 neurons/day on free tier
- Unlimited on Workers Paid plan ($5/month)

---

## 💰 Cost Comparison

### Workers AI (FREE Tier)
- **Cost**: $0
- **Limit**: 10,000 neurons/day
- **Perfect for**: Development, low-traffic apps, testing

### Workers AI (Paid)
- **Cost**: $0.011 per 1,000 neurons
- **Limit**: Unlimited
- **Example**: 1M tokens = $11

### OpenAI via AI Gateway
- **Cost**: OpenAI pricing (reduced via caching)
- **Savings**: Up to 80% with caching
- **Example**: GPT-3.5-turbo ~$0.002 per 1K tokens (cached even cheaper)

### Recommendation:
1. **Development**: Use Workers AI (FREE!)
2. **Production (low traffic)**: Workers AI FREE tier
3. **Production (high traffic)**: Workers AI Paid or OpenAI + Gateway
4. **Best of both**: Use Hybrid mode - Workers AI for most requests, OpenAI for complex ones

---

## 🆘 Troubleshooting

### Error: "Cloudflare API token not configured"

**Solution**: Add `CLOUDFLARE_API_TOKEN` to environment variables

### Error: "Insufficient permissions"

**Solution**: Regenerate token with correct permissions:
- Account → Workers AI → Edit

### Error: "Rate limit exceeded"

**Solution**:
- Free tier: Wait 24 hours for reset
- Upgrade to Workers Paid plan
- Switch to OpenAI provider temporarily

### Slow responses?

**Solution**:
- Workers AI runs on edge, should be fast
- Check your network connection
- Try a different model

---

## 🎯 Quick Start Commands

```bash
# Local development
cd /home/ehs/vercel/nextjs-ai-chatbot
npm run dev

# Build for production
npm run build

# Deploy to Vercel
git add .
git commit -m "Add Workers AI integration"
git push
```

---

## 📚 Resources

- **Workers AI Docs**: https://developers.cloudflare.com/workers-ai/
- **Available Models**: https://developers.cloudflare.com/workers-ai/models/
- **API Token Setup**: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- **Pricing**: https://developers.cloudflare.com/workers-ai/platform/pricing/

---

## 🎉 You're All Set!

Your chatbot now supports:
1. ✅ Cloudflare Workers AI (FREE!)
2. ✅ OpenAI via AI Gateway (Optimized)
3. ✅ Hybrid mode (Smart selection)
4. ✅ Multiple models
5. ✅ Full analytics

**Happy chatting!** 🚀
