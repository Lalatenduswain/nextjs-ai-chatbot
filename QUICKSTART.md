# 🚀 Quick Start Guide

## Your Next.js AI Chatbot is Ready!

Location: `/home/ehs/vercel/nextjs-ai-chatbot/`

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd /home/ehs/vercel/nextjs-ai-chatbot
npm install
```

### Step 2: Add Your API Key

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Step 3: Run It!

```bash
npm run dev
```

Open http://localhost:3000 🎉

## 🚢 Deploy to Vercel

### Quick Deploy (2 minutes):

```bash
vercel login
vercel --prod
vercel env add OPENAI_API_KEY production
# Paste your OpenAI key
vercel --prod
```

### Or via GitHub:

```bash
gh repo create nextjs-ai-chatbot --public --source=. --push
```

Then import to Vercel: https://vercel.com/new

## ✨ What's Included

✅ **Next.js 14** with App Router
✅ **Cloudflare AI Gateway** integrated
✅ **Vercel AI SDK** for streaming
✅ **Beautiful UI** with Tailwind CSS
✅ **TypeScript** for type safety
✅ **Cost Optimization** through caching
✅ **Analytics** via Cloudflare

## 🎯 Key Features

### AI Gateway Benefits:
- **💰 Cost Savings**: Up to 80% reduction through caching
- **⚡ Fast Responses**: Cached responses return instantly
- **📊 Analytics**: Full observability dashboard
- **🛡️ Rate Limiting**: 100 requests/minute
- **🔍 Monitoring**: Request/response logging

### Architecture:
```
User → Next.js → Cloudflare AI Gateway → OpenAI
                        ↓
                 Cache + Analytics
```

## 📁 Project Structure

```
nextjs-ai-chatbot/
├── app/
│   ├── api/chat/route.ts      # API with AI Gateway
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   └── Chat.tsx               # Chat component
├── lib/
│   └── ai-gateway.ts          # AI Gateway config
└── package.json
```

## 🔧 Configuration

### Environment Variables:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |
| `OPENAI_MODEL` | Model to use (default: gpt-3.5-turbo) |

### AI Gateway Settings:

Pre-configured in `lib/ai-gateway.ts`:
- Account ID: `fe867c47829b4a3be82e1ad1401e724f`
- Gateway: `main-ai-gateway`
- Rate Limit: 100 req/min
- Cache: 1 hour

## 📊 View Analytics

Gateway Dashboard:
https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway

Track:
- Request count
- Cache hit rate
- Cost savings
- Response times
- Error rates

## 🎨 Customization

### Change AI Model

Edit `.env`:
```env
OPENAI_MODEL=gpt-4
```

### Modify Gateway Settings

Edit `lib/ai-gateway.ts` or update via Cloudflare API

### Custom Styling

Edit `app/globals.css` and Tailwind config

## 📚 Documentation

- **Full README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **AI Gateway Docs**: https://developers.cloudflare.com/ai-gateway/

## 🆘 Troubleshooting

### "npm install" fails
```bash
rm -rf node_modules package-lock.json
npm install
```

### "API key not configured"
Add `OPENAI_API_KEY` to `.env` file

### Build errors
```bash
npm run build
```

## 💡 Next Steps

1. ✅ Install dependencies
2. ✅ Add API key
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. ✅ Monitor analytics
6. ✅ Customize as needed

## 🎉 You're All Set!

Your AI chatbot is ready to deploy. It includes:
- Cloudflare AI Gateway for cost optimization
- Streaming responses for better UX
- Beautiful, responsive UI
- Full TypeScript support
- Production-ready configuration

**Happy coding! 🚀**

---

Need help? Check `README.md` or `DEPLOYMENT.md`
