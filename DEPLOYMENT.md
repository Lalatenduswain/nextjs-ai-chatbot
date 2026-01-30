# Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /home/ehs/vercel/nextjs-ai-chatbot
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Test Locally

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Login to Vercel
vercel login

# Deploy
cd /home/ehs/vercel/nextjs-ai-chatbot
vercel --prod

# Add environment variable
vercel env add OPENAI_API_KEY production
# Paste your key when prompted

# Redeploy with environment variable
vercel --prod
```

### Option 2: GitHub + Vercel (Recommended for Teams)

```bash
# Initialize git
cd /home/ehs/vercel/nextjs-ai-chatbot
git init
git add .
git commit -m "Initial commit: Next.js AI Chatbot with Cloudflare AI Gateway"

# Create GitHub repo and push
gh repo create nextjs-ai-chatbot --public --source=. --push

# Or manually push to existing repo:
# git remote add origin https://github.com/yourusername/nextjs-ai-chatbot.git
# git branch -M main
# git push -u origin main
```

Then:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-openai-api-key`
5. Click "Deploy"

### Option 3: Vercel Dashboard (Drag & Drop)

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Go to https://vercel.com/new
3. Drag and drop the `nextjs-ai-chatbot` folder
4. Add environment variables in settings
5. Deploy

## Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-3.5-turbo` (optional) | Production, Preview, Development |

## Verify Deployment

After deployment:

1. **Test the chatbot**:
   - Visit your deployed URL
   - Send a test message
   - Verify you get a response

2. **Check AI Gateway analytics**:
   - Go to https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway
   - Verify requests are showing up
   - Check cache hit rate

3. **Monitor performance**:
   - Check Vercel Analytics
   - Monitor response times
   - Track error rates

## Post-Deployment

### Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### API Key Rotation

To rotate your OpenAI API key:

```bash
vercel env rm OPENAI_API_KEY production
vercel env add OPENAI_API_KEY production
# Enter new key
vercel --prod
```

### Monitoring

Set up monitoring:
- Vercel Analytics (automatic)
- Cloudflare AI Gateway Dashboard
- Custom error tracking (Sentry, LogRocket, etc.)

### Scaling

The application automatically scales with Vercel:
- Serverless functions scale to zero
- Edge runtime for optimal performance
- No infrastructure management needed

AI Gateway handles:
- Rate limiting (100 req/min default)
- Caching for cost optimization
- Request logging and analytics

## CI/CD

Auto-deploy on push to GitHub:

1. Connect GitHub repo to Vercel
2. Every push to `main` triggers deployment
3. Preview deployments for PRs
4. Rollback to previous deployment if needed

## Cost Optimization Tips

1. **Use caching**: Set appropriate cache durations in AI Gateway
2. **Choose the right model**: Use `gpt-3.5-turbo` for general use
3. **Implement rate limiting**: Client-side throttling for user requests
4. **Monitor usage**: Regular checks on Cloudflare dashboard
5. **Set budgets**: Configure spending limits in OpenAI dashboard

## Troubleshooting

### Deployment fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
vercel --prod
```

### Environment variables not working

1. Verify in Vercel Dashboard → Settings → Environment Variables
2. Ensure they're enabled for the right environment (Production)
3. Redeploy after adding variables

### API Gateway not receiving requests

1. Check `lib/ai-gateway.ts` configuration
2. Verify account ID and gateway name
3. Test locally first: `npm run dev`

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Cloudflare AI Gateway**: https://developers.cloudflare.com/ai-gateway/
- **Vercel AI SDK**: https://sdk.vercel.ai/docs

---

**Gateway Dashboard**: https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway
