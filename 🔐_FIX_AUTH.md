# 🔐 Fix Authentication Issue

## The Problem
Login/Signup not working - Supabase credentials mismatch

## The Solution

### Step 1: Update .env File
The `.env` file has been updated with the correct Supabase credentials from your project.

### Step 2: Restart Frontend
**IMPORTANT:** You must restart the frontend for changes to take effect!

```bash
# Stop frontend (Ctrl+C in the terminal)
# Then start again:
npm run dev
```

### Step 3: Clear Browser Cache (Optional)
If still not working:
1. Press F12 (open DevTools)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

### Step 4: Try Login/Signup Again
1. Go to http://localhost:8080/auth
2. Try signing up with a new account
3. Or login if you already have an account

---

## Alternative: Use Without Authentication

If you want to skip authentication for the hackathon demo:

### Option 1: Direct Access
Just go directly to the pages:
- http://localhost:8080/upload - Upload CSV
- http://localhost:8080/analyzer - Transaction Analyzer
- http://localhost:8080/nudge - Budget Nudge
- http://localhost:8080/chatbot - AI Chatbot

### Option 2: Disable Auth Check
Edit `src/pages/TransactionAnalyzer.tsx` and remove auth checks.

---

## For Hackathon Demo

### Quick Demo Flow (No Auth Needed):
1. Go to http://localhost:8080/upload
2. Upload CSV
3. View analytics
4. Click "Budget Nudge"
5. Try chatbot

**Authentication is optional for demo!**

---

## If Still Not Working

### Check Supabase Project:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the correct:
   - Project URL
   - Anon/Public key
5. Update `.env` file
6. Restart frontend

### Get Fresh Credentials:
From the screenshot you showed, copy:
- **Project URL:** https://kofeyyvocsvrrlkicdar.supabase.co
- **Anon Key:** The long key shown in the dialog

Paste them in `.env`:
```env
VITE_SUPABASE_URL=https://kofeyyvocsvrrlkicdar.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

---

## Quick Fix for Demo

If authentication is blocking you, just access pages directly:

```
http://localhost:8080/upload
http://localhost:8080/analyzer  
http://localhost:8080/nudge
http://localhost:8080/chatbot
```

**No login required!** ✅

---

## After Fixing

1. Restart frontend: `npm run dev`
2. Clear browser cache
3. Try login/signup
4. Should work now! ✅
