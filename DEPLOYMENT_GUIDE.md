# SnapSpend Deployment Guide

## Architecture
- **Frontend**: React + Vite → Deploy to Vercel
- **Backend**: Python Flask → Deploy to Render

---

## Step 1: Deploy Backend to Render (Do This First!)

### 1.1 Prepare Backend
```bash
cd backend_python
```

### 1.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 1.3 Connect Repository
1. Connect your GitHub repository
2. Select the repository
3. Configure:
   - **Name**: `snapspend-backend`
   - **Root Directory**: `backend_python`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`

### 1.4 Add Environment Variables
In Render dashboard, add:
- **Key**: `GEMINI_API_KEY`
- **Value**: `AIzaSyDYWUZQL5vAvb9rrK1FQbB9UWz_ffd9O34`
- **Key**: `PORT`
- **Value**: `5000`

### 1.5 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://snapspend-backend.onrender.com`)

### 1.6 Test Backend
```bash
curl https://your-backend-url.onrender.com/api/hello
```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend API URL
Create `.env.production` file in root:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with your actual Render URL from Step 1.5

### 2.2 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### 2.3 Import Repository
1. Select your GitHub repository
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.4 Add Environment Variables
In Vercel project settings → Environment Variables:
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com`
- **Environment**: Production

### 2.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at `https://your-project.vercel.app`

---

## Step 3: Update CORS (Important!)

After deployment, update backend CORS to allow your Vercel domain:

In `backend_python/app.py`, update CORS:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:8080",
    "https://your-project.vercel.app"  # Add your Vercel URL
])
```

Then redeploy backend on Render (it will auto-deploy on git push).

---

## Alternative: Deploy Both on Render

If you prefer everything on Render:

### Backend (Same as above)
Follow Step 1

### Frontend on Render
1. Create new "Static Site" on Render
2. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL`: Your backend URL

---

## Troubleshooting

### Backend Issues
- **500 Error**: Check Render logs for Python errors
- **CORS Error**: Update CORS origins in app.py
- **Gemini API Error**: Verify API key in Render environment variables

### Frontend Issues
- **API Connection Failed**: Check VITE_API_URL is correct
- **Build Failed**: Run `npm run build` locally first
- **Blank Page**: Check browser console for errors

### Free Tier Limitations
- **Render Free**: Backend sleeps after 15 min inactivity (takes 30s to wake up)
- **Vercel Free**: 100GB bandwidth/month
- **Solution**: Upgrade to paid tier ($7/month Render) for always-on backend

---

## Post-Deployment Checklist

✅ Backend is accessible at Render URL
✅ Frontend is accessible at Vercel URL
✅ CSV upload works
✅ AI Chat responds
✅ Transaction analysis displays correctly
✅ Budget Nudge Dashboard works
✅ All charts render properly

---

## Monitoring

### Render Dashboard
- View logs: Render Dashboard → Your Service → Logs
- Check metrics: CPU, Memory usage
- Monitor uptime

### Vercel Dashboard
- View deployments: Vercel Dashboard → Your Project
- Check analytics: Page views, performance
- Monitor build logs

---

## Cost Estimate

### Free Tier (Recommended for Testing)
- Render: Free (with sleep)
- Vercel: Free
- **Total**: $0/month

### Production Tier
- Render: $7/month (always-on)
- Vercel: Free (sufficient for most apps)
- **Total**: $7/month

---

## Quick Deploy Commands

### Push to Deploy
```bash
# Commit changes
git add .
git commit -m "Deploy to production"
git push origin main

# Both Render and Vercel will auto-deploy!
```

### Manual Redeploy
- **Render**: Dashboard → Manual Deploy → Deploy latest commit
- **Vercel**: Dashboard → Deployments → Redeploy

---

## Support

If you face issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Test API endpoints with curl/Postman
4. Verify environment variables are set correctly

Good luck with your deployment! 🚀
