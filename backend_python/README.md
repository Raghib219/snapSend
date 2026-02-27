# Python Backend for SnapSpend

## Tech Stack (Hackathon Requirements)
- **Python** - Core language
- **Pandas** - Data analysis and manipulation
- **Flask** - Web framework
- **LLM (Gemini)** - AI-powered categorization and insights

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend_python
pip install -r requirements.txt
```

Or using virtual environment (recommended):

```bash
cd backend_python
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```

### 3. Run the Server

```bash
python app.py
```

You should see:
```
🚀 Python Flask server starting on port 5000
📡 API endpoints:
   - GET  http://localhost:5000/api/hello
   - POST http://localhost:5000/analyze-transactions
   - POST http://localhost:5000/ask-question

✅ CORS enabled for all origins
🔑 Gemini API Key: ✓ Configured
```

## Features

### Pandas-Powered Analytics
- Fast CSV parsing and data manipulation
- Category-wise spending analysis
- Time-series analysis (first half vs second half)
- Statistical insights (top spends, one-time expenses)

### LLM Integration
- AI-powered transaction categorization
- Context-aware financial advice
- Personalized spending insights
- Fallback to rule-based categorization if API fails

### API Endpoints

#### 1. Health Check
```bash
GET http://localhost:5000/api/hello
```

#### 2. Analyze Transactions
```bash
POST http://localhost:5000/analyze-transactions
Content-Type: multipart/form-data

Body: csvFile (file upload)
```

#### 3. Ask Financial Question
```bash
POST http://localhost:5000/ask-question
Content-Type: application/json

Body: {"question": "How can I save more money?"}
```

## Testing

Test the API:
```bash
curl http://localhost:5000/api/hello
```

## Troubleshooting

**Import Error:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Port Already in Use:**
Change PORT in `.env` file to 5001 or another available port.

**Gemini API Error:**
Verify your API key at: https://makersuite.google.com/app/apikey
