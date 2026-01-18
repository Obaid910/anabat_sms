# Render.com Deployment Guide - Anabat SMS

**100% Free Deployment** - No credit card required!

## Why Render.com?

✅ **Truly Free** - No credit card needed  
✅ **750 hours/month** per service (enough for 24/7 operation)  
✅ **Free PostgreSQL** database (90 days, renewable)  
✅ **Auto-deploy** from GitHub  
✅ **Free SSL** certificates  
⚠️ **Note**: Free tier apps sleep after 15 minutes of inactivity (30 second cold start)

## Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at https://render.com (no credit card needed)

## Deployment Methods

### Method 1: Blueprint (Automated - Recommended)

This method deploys everything with one click using the `render.yaml` file.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment config"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to https://dashboard.render.com
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Select the repository: `anabat_sms`
   - Render will detect `render.yaml` and show all services
   - Click **"Apply"**

3. **Wait for deployment** (~5-10 minutes)
   - Database will be created first
   - Backend will build and deploy
   - Frontend will build and deploy

4. **Access your application**
   - Frontend: `https://anabat-sms-frontend.onrender.com`
   - Backend: `https://anabat-sms-backend.onrender.com/api`

### Method 2: Manual Setup (Step-by-Step)

If you prefer manual control or the blueprint doesn't work:

#### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `anabat-sms-db`
   - **Database**: `anabat_sms`
   - **User**: `anabat_user`
   - **Region**: Oregon (US West) - fastest free region
   - **Plan**: Free
4. Click **"Create Database"**
5. **Save the connection details** (Internal Database URL)

#### Step 2: Deploy Backend (Laravel)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `anabat-sms-backend`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/Dockerfile.render`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   APP_ENV=production
   APP_DEBUG=false
   LOG_CHANNEL=stderr
   DB_CONNECTION=pgsql
   DB_HOST=<from database internal URL>
   DB_PORT=5432
   DB_DATABASE=anabat_sms
   DB_USERNAME=anabat_user
   DB_PASSWORD=<from database internal URL>
   APP_KEY=<generate with: php artisan key:generate --show>
   APP_URL=https://anabat-sms-backend.onrender.com
   FRONTEND_URL=https://anabat-sms-frontend.onrender.com
   ```

5. **Health Check Path**: `/api/health`

6. Click **"Create Web Service"**

#### Step 3: Deploy Frontend (React)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `anabat-sms-frontend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: Docker
   - **Dockerfile Path**: `frontend/Dockerfile.render`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://anabat-sms-backend.onrender.com/api
   ```

5. **Health Check Path**: `/health`

6. Click **"Create Web Service"**

## Post-Deployment

### 1. Run Database Migrations

The backend Dockerfile automatically runs migrations on startup, but you can verify:

1. Go to your backend service in Render dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   php artisan migrate:status
   ```

### 2. Test the Application

1. Open frontend URL: `https://anabat-sms-frontend.onrender.com`
2. Login with default credentials:
   - Email: `admin@anabatsms.com`
   - Password: `password`

### 3. Monitor Logs

- Backend logs: Dashboard → anabat-sms-backend → Logs
- Frontend logs: Dashboard → anabat-sms-frontend → Logs
- Database logs: Dashboard → anabat-sms-db → Logs

## Important Notes

### Free Tier Limitations

1. **Sleep after inactivity**: Apps sleep after 15 minutes of no requests
   - First request after sleep takes ~30 seconds (cold start)
   - Subsequent requests are instant
   
2. **Database expiration**: Free PostgreSQL expires after 90 days
   - You'll receive email reminders
   - Can export/import data to new free database
   - Or upgrade to paid plan ($7/month)

3. **750 hours/month**: Each service gets 750 hours
   - Enough for one app running 24/7
   - Multiple apps share the 750 hours

### Keeping Apps Awake

To prevent sleep, you can:

1. **Use a ping service** (free):
   - https://uptimerobot.com (free tier: 50 monitors)
   - Ping your frontend every 14 minutes
   
2. **Upgrade to paid plan** ($7/month per service)
   - No sleep
   - More resources

## Configuration Files

### render.yaml (Blueprint)
Located at project root. Defines all services and their configuration.

### Dockerfiles
- `backend/Dockerfile.render` - Laravel with Apache on port 10000
- `frontend/Dockerfile.render` - React with Nginx on port 10000

## Useful Commands

### Update Environment Variables

1. Go to service in dashboard
2. Click **"Environment"** tab
3. Add/edit variables
4. Service will automatically redeploy

### Manual Redeploy

1. Go to service in dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### View Shell Access

1. Go to service in dashboard
2. Click **"Shell"** tab
3. Run commands directly in container

### Database Backup

1. Go to database in dashboard
2. Click **"Backups"** tab
3. Click **"Create Backup"**
4. Download backup file

## Troubleshooting

### Backend won't start

**Check logs for errors:**
```
Dashboard → anabat-sms-backend → Logs
```

**Common issues:**
1. **Missing APP_KEY**: Generate with `php artisan key:generate --show`
2. **Database connection failed**: Verify DB credentials in environment variables
3. **Migrations failed**: Check database is running and accessible

### Frontend shows API errors

**Verify environment variable:**
```
VITE_API_URL=https://anabat-sms-backend.onrender.com/api
```

**Check CORS settings** in Laravel backend:
- `config/cors.php` should allow your frontend domain

### Database connection issues

1. Verify database is running (green status in dashboard)
2. Check internal database URL is correct
3. Ensure backend is in same region as database

### Slow first request (Cold Start)

This is normal for free tier:
- Apps sleep after 15 minutes of inactivity
- First request wakes up the app (~30 seconds)
- Use UptimeRobot to ping every 14 minutes to prevent sleep

## Updating Your Application

### Auto-Deploy (Recommended)

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically.

### Manual Deploy

1. Go to service in dashboard
2. Click **"Manual Deploy"**
3. Select branch/commit
4. Click **"Deploy"**

## Custom Domain (Optional)

1. Go to service in dashboard
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain
4. Update DNS records as shown
5. SSL certificate is automatically provisioned

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Web Service | 750 hrs/mo | $7/mo (always on) |
| PostgreSQL | 90 days (3GB) | $7/mo (unlimited) |
| Bandwidth | 100GB/mo | Unlimited |
| SSL | Free | Free |

**Total for this project: $0/month** (with limitations)

## Migration from Render Free to Paid

When you're ready to upgrade:

1. Go to service settings
2. Change plan from "Free" to "Starter" ($7/mo)
3. Add payment method
4. Benefits:
   - No sleep
   - More resources
   - Faster response times
   - Priority support

## Alternatives if Free Tier Doesn't Work

1. **Vercel (Frontend) + Railway (Backend)**: Railway gives $5 credit/month
2. **Netlify (Frontend) + Supabase (Backend + DB)**: Both free
3. **GitHub Pages (Frontend) + Heroku (Backend)**: Heroku $5/month minimum

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com

---

**Last Updated**: January 2026  
**Deployment Time**: ~10-15 minutes  
**Difficulty**: Easy ⭐⭐☆☆☆
