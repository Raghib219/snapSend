# Render Deployment Fix

## Problem
Render was using Python 3.14 which is incompatible with pandas 2.1.4

## Solution
Updated to Python 3.11 and pandas 2.2.0

---

## Manual Render Setup (Recommended)

### Step 1: Create Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Settings
```
Name: snapspend-backend
Region: Choose closest to you
Branch: main
Root Directory: backend_python
Runtime: Python 3
```

### Step 3: Build & Start Commands
```
Build Command: pip install --upgrade pip && pip install -r requirements.txt
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
```

### Step 4: Environment Variables
Add these in Render dashboard:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `PORT` | `5000` |
| `GEMINI_API_KEY` | `AIzaSyDYWUZQL5vAvb9rrK1FQbB9UWz_ffd9O34` |

### Step 5: Advanced Settings (Optional)
```
Instance Type: Free
Auto-Deploy: Yes
Health Check Path: /api/hello
```

### Step 6: Deploy
Click "Create Web Service" and wait 5-10 minutes

---

## Alternative: Use render.yaml

If you prefer infrastructure as code:

1. Push the updated `render.yaml` to GitHub
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect repository
4. Select `backend_python/render.yaml`
5. Add `GEMINI_API_KEY` environment variable
6. Deploy

---

## Verify Deployment

Once deployed, test your backend:

```bash
# Replace with your actual Render URL
curl https://your-app.onrender.com/api/hello
```

Expected response:
```json
{"message": "Hello from Python Flask server! 🐍"}
```

---

## Troubleshooting

### Build Still Failing?

**Option 1: Use Python 3.10**
Change `runtime.txt` to:
```
python-3.10.13
```

**Option 2: Use Latest Pandas**
Update `requirements.txt`:
```
pandas==2.2.3
numpy==1.26.4
```

**Option 3: Minimal Dependencies**
Try this minimal `requirements.txt`:
```
flask==3.1.0
flask-cors==5.0.0
pandas>=2.0.0
python-dotenv==1.0.0
google-generativeai>=0.3.0
gunicorn==22.0.0
```

### Check Render Logs
1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. Look for error messages

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'pandas'`
**Fix**: Check build logs, ensure pip install succeeded

**Issue**: `Port already in use`
**Fix**: Use `$PORT` environment variable in start command

**Issue**: `Gemini API error`
**Fix**: Verify API key is set correctly in environment variables

---

## Files Created/Updated

✅ `runtime.txt` - Specifies Python 3.11.0
✅ `requirements.txt` - Updated pandas to 2.2.0
✅ `render.yaml` - Updated build command
✅ This guide - Manual setup instructions

---

## Next Steps

After backend is deployed:
1. Copy your Render backend URL
2. Update `.env.production` in frontend
3. Deploy frontend to Vercel
4. Test the full application

Good luck! 🚀
