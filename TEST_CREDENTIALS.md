# 🔐 Test Credentials for Authentication

## Quick Test Account

### Sign Up:
1. Go to: http://localhost:8080/auth?mode=signup
2. Use these details:
   - **Email:** demo@snapspend.com
   - **Password:** Demo123456!
   - **Full Name:** Demo User
3. Click "Create Account"

### Login:
1. Go to: http://localhost:8080/auth?mode=login
2. Use:
   - **Email:** demo@snapspend.com
   - **Password:** Demo123456!
3. Click "Sign In"

---

## Steps to Fix Authentication

### 1. Restart Frontend
```bash
# Stop frontend (Ctrl+C)
npm run dev
```

### 2. Clear Browser Cache
- Press **F12**
- Go to **Application** tab
- Click **Clear storage**
- Click **Clear site data**
- Close DevTools
- Refresh page (F5)

### 3. Try Signup
- Go to: http://localhost:8080/auth?mode=signup
- Fill in the form
- Click "Create Account"

### 4. Check Email (If Required)
Some Supabase projects require email verification:
- Check your email inbox
- Click verification link
- Then try login

---

## If Still Not Working

### Check Browser Console:
1. Press **F12**
2. Go to **Console** tab
3. Try to sign up/login
4. Look for error messages
5. Share the error with me

### Common Errors:

#### "Invalid API key"
- Wrong Supabase credentials
- Need to update .env file

#### "Email not confirmed"
- Check email for verification link
- Or disable email confirmation in Supabase

#### "Network error"
- Supabase project might be paused
- Check Supabase dashboard

---

## Alternative: Disable Auth Requirement

If you want to skip authentication entirely:

### Edit: src/App.tsx
Remove auth checks from routes

### Or Use Direct URLs:
```
http://localhost:8080/upload
http://localhost:8080/analyzer
http://localhost:8080/nudge
http://localhost:8080/chatbot
```

These work without login!

---

## For Hackathon Demo

### Option 1: Use Authentication
- Create account before demo
- Login during presentation
- Show personalized features

### Option 2: Skip Authentication
- Use direct URLs
- Focus on core features
- Faster demo

**Both are valid approaches!**

---

## Current .env Configuration

```env
VITE_SUPABASE_URL=https://kofeyyvocsvrrlkicdar.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:5000
```

This should be correct now!

---

## Next Steps

1. ✅ .env file updated
2. ⏳ Restart frontend: `npm run dev`
3. ⏳ Clear browser cache
4. ⏳ Try signup/login

**Should work now!** 🎉
