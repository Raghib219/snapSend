# 🚀 Start Python Backend - Quick Fix

## The Error
"Upload failed: Failed to fetch" means the Python backend is NOT running on port 5000.

## Solution (3 Steps)

### Step 1: Open New Terminal
Open a NEW terminal/command prompt (don't close the frontend terminal)

### Step 2: Navigate to Python Backend
```bash
cd backend_python
```

### Step 3: Start Python Server
```bash
python app.py
```

**You should see:**
```
🚀 Python Flask server starting on port 5000
📡 API endpoints:
   - GET  http://localhost:5000/api/hello
   - POST http://localhost:5000/analyze-transactions
   ...
✅ CORS enabled for all origins
🔑 Gemini API Key: ✓ Configured

 * Running on http://0.0.0.0:5000
```

### Step 4: Test Upload Again
Go back to http://localhost:8080/upload and try uploading CSV again.

---

## If Python is Not Installed

### Install Python:
1. Go to https://www.python.org/downloads/
2. Download Python 3.8 or higher
3. Install (check "Add Python to PATH")

### Install Dependencies:
```bash
cd backend_python
pip install -r requirements.txt
```

### Then Start:
```bash
python app.py
```

---

## Quick Test

Open browser and go to:
```
http://localhost:5000/api/hello
```

Should show:
```json
{"message": "Hello from Python Flask server! 🐍"}
```

If you see this, backend is working!

---

## Common Issues

### "python: command not found"
- Python not installed or not in PATH
- Try `python3 app.py` instead

### "Port 5000 already in use"
- Another app is using port 5000
- Stop it or change port in .env

### "Module not found"
- Dependencies not installed
- Run: `pip install -r requirements.txt`

---

## Windows Quick Start

Double-click: `start-python-backend.bat`

This will automatically:
1. Check Python
2. Install dependencies
3. Start server

---

**After backend starts, refresh the upload page and try again!**
