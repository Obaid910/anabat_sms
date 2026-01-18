# Deployment Options for Anabat SMS

This project supports multiple deployment platforms. Choose the one that best fits your needs.

## ✅ Recommended: Render.com (100% Free)

**Best for**: Development, testing, and small-scale production

### Pros:
- ✅ **No credit card required**
- ✅ **Truly free** (750 hours/month per service)
- ✅ **Free PostgreSQL** database (90 days, renewable)
- ✅ **One-click deployment** via Blueprint
- ✅ **Auto-deploy** from GitHub
- ✅ **Free SSL** certificates

### Cons:
- ⚠️ Apps sleep after 15 min of inactivity (30s cold start)
- ⚠️ Database expires after 90 days (can migrate to new free DB)

### Quick Start:
See **[DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)** for the fastest way to deploy.

### Full Guide:
See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for comprehensive instructions.

---

## Fly.io (Requires Payment Info)

**Best for**: Production with better performance

### Pros:
- ✅ Free tier available ($5 credit/month)
- ✅ No sleep (apps stay active)
- ✅ Better performance
- ✅ More control

### Cons:
- ⚠️ **Requires credit card** (even for free tier)
- ⚠️ More complex setup

### Guide:
See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Fly.io deployment instructions.

---

## Other Free Options

### 1. Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy to Vercel (unlimited free)
- **Backend**: Deploy to Railway ($5 credit/month)
- **Database**: Railway PostgreSQL included

### 2. Netlify (Frontend) + Supabase (Backend)
- **Frontend**: Deploy to Netlify (free)
- **Backend**: Use Supabase (free PostgreSQL + REST API)
- **Note**: Requires adapting Laravel to use Supabase

### 3. GitHub Pages (Frontend) + Heroku (Backend)
- **Frontend**: GitHub Pages (free static hosting)
- **Backend**: Heroku (minimum $5/month)
- **Database**: Heroku PostgreSQL addon

---

## Comparison Table

| Platform | Cost | Credit Card | Sleep | Database | Setup Difficulty |
|----------|------|-------------|-------|----------|------------------|
| **Render.com** | Free | No | Yes (15min) | 90 days free | ⭐⭐☆☆☆ Easy |
| **Fly.io** | Free* | Yes | No | Included | ⭐⭐⭐☆☆ Medium |
| **Vercel + Railway** | Free* | No (trial) | No | Included | ⭐⭐⭐☆☆ Medium |
| **Netlify + Supabase** | Free | No | No | Unlimited | ⭐⭐⭐⭐☆ Hard |

*Limited free credits/resources

---

## Our Recommendation

### For Development/Testing:
**Use Render.com** - It's the easiest and truly free option.

### For Production:
**Use Fly.io or Railway** - Better performance and no sleep, but requires payment info.

---

## Files Overview

### Render.com Deployment:
- `render.yaml` - Blueprint configuration (one-click deploy)
- `backend/Dockerfile.render` - Backend container config
- `frontend/Dockerfile.render` - Frontend container config
- `RENDER_DEPLOYMENT.md` - Full deployment guide
- `DEPLOY_QUICK_START.md` - Quick reference

### Fly.io Deployment:
- `backend/fly.toml` - Backend configuration
- `frontend/fly.toml` - Frontend configuration
- `backend/Dockerfile` - Backend container
- `frontend/Dockerfile` - Frontend container
- `DEPLOYMENT.md` - Full deployment guide

---

## Need Help?

1. **Quick Start**: See [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
2. **Render Guide**: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
3. **Fly.io Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Project Setup**: See [QUICK_START.md](./QUICK_START.md)

---

**Last Updated**: January 2026
