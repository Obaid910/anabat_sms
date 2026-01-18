# Quick Deploy to Render.com - TL;DR

**100% Free - No Credit Card Required!**

## Method 1: One-Click Blueprint (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to https://dashboard.render.com
   - Sign up (no credit card needed)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repo
   - Select `anabat_sms` repository
   - Click **"Apply"**
   - Wait 10 minutes ☕

3. **Access Your App**
   - Frontend: `https://anabat-sms-frontend.onrender.com`
   - Login: `admin@anabatsms.com` / `password`

## Method 2: Manual Setup

1. **Sign up at Render.com** (no credit card)

2. **Create PostgreSQL Database**
   - New + → PostgreSQL
   - Name: `anabat-sms-db`
   - Plan: Free
   - Create

3. **Deploy Backend**
   - New + → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Dockerfile: `backend/Dockerfile.render`
   - Add environment variables (see RENDER_DEPLOYMENT.md)
   - Create

4. **Deploy Frontend**
   - New + → Web Service
   - Connect GitHub repo
   - Root Directory: `frontend`
   - Dockerfile: `frontend/Dockerfile.render`
   - Add env: `VITE_API_URL=https://anabat-sms-backend.onrender.com/api`
   - Create

## Default Login
- Email: `admin@anabatsms.com`
- Password: `password`

## Important Notes

⚠️ **Free tier apps sleep after 15 min of inactivity**
- First request takes ~30 seconds (cold start)
- Use UptimeRobot.com to ping every 14 min to keep awake

⚠️ **Free database expires after 90 days**
- You'll get email reminders
- Can migrate to new free database

---

**See RENDER_DEPLOYMENT.md for detailed instructions and troubleshooting.**
