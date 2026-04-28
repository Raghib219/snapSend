from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json
import random
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
try:
    model = genai.GenerativeModel('models/gemini-2.5-flash')
except Exception:
    try:
        model = genai.GenerativeModel('models/gemini-1.5-flash')
    except Exception:
        model = None

# In-memory transaction storage (per serverless instance)
stored_df = None

CATEGORY_RULES = {
    'Income': ['salary', 'income', 'credit', 'reimbursement', 'payment from'],
    'Food': ['food', 'restaurant', 'swiggy', 'zomato', 'cafe', 'starbucks', 'dominos', 'pizza'],
    'Travel': ['uber', 'ola', 'taxi', 'flight', 'train', 'bus', 'irctc', 'indigo', 'metro'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'shopping', 'mall', 'store'],
    'Bills': ['electricity', 'mobile', 'bill', 'netflix', 'hotstar', 'subscription', 'airtel', 'jio'],
    'Health': ['hospital', 'doctor', 'medicine', 'pharmacy', 'pharmeasy', 'health', 'clinic'],
    'Groceries': ['grocery', 'dmart', 'bigbasket', 'supermarket', 'vegetables', 'fruits'],
}

def categorize(description):
    desc = str(description).lower()
    for cat, keywords in CATEGORY_RULES.items():
        if any(k in desc for k in keywords):
            return cat
    return 'Shopping'


@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'SnapSpend backend is live!'})


@app.route('/api/analyze-transactions', methods=['POST'])
def analyze_transactions():
    global stored_df
    try:
        if 'csvFile' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['csvFile']
        df = pd.read_csv(file)
        df.columns = df.columns.str.strip()

        # Flexible column detection
        desc_col = next((c for c in df.columns if c.lower() in ['description', 'transaction description', 'narration']), None)
        amt_col  = next((c for c in df.columns if c.lower() in ['amount', 'transaction amount', 'debit']), None)
        date_col = next((c for c in df.columns if c.lower() in ['date', 'transaction date', 'value date']), None)

        if not desc_col or not amt_col:
            return jsonify({'error': 'CSV must have Description and Amount columns'}), 400

        df['description'] = df[desc_col]
        df['amount'] = pd.to_numeric(df[amt_col], errors='coerce').abs()
        df['date'] = df[date_col].astype(str) if date_col else 'Unknown'
        df['drcr'] = df['DR/CR'] if 'DR/CR' in df.columns else 'DR'
        df = df.dropna(subset=['amount'])

        # AI categorization with fallback
        using_fallback = False
        if model:
            try:
                sample = df.head(50)
                txns_text = "\n".join(
                    f"{i+1}. {r['description']} | ₹{r['amount']} | {r['date']}"
                    for i, r in sample.iterrows()
                )
                prompt = (
                    "Categorize these transactions into: Food, Travel, Shopping, Bills, Health, Groceries, Income.\n"
                    "Return ONLY a JSON array: [{\"description\": \"...\", \"category\": \"...\"}]\n\n"
                    f"Transactions:\n{txns_text}"
                )
                resp = model.generate_content(prompt)
                text = resp.text.strip()
                js = text[text.find('['):text.rfind(']')+1]
                cat_map = {item['description']: item['category'] for item in json.loads(js)}
                df['category'] = df['description'].map(cat_map).fillna('Shopping')
            except Exception:
                using_fallback = True
                df['category'] = df['description'].apply(categorize)
        else:
            using_fallback = True
            df['category'] = df['description'].apply(categorize)

        stored_df = df.copy()

        income_df  = df[df['drcr'] == 'CR']
        expense_df = df[df['drcr'] == 'DR']
        total_in   = float(income_df['amount'].sum())
        total_out  = float(expense_df['amount'].sum())

        cat_totals = expense_df.groupby('category')['amount'].sum()
        reduce_advice = [
            f"Try reducing {cat} spend of ₹{amt:.0f} to ₹{amt*0.7:.0f}."
            for cat, amt in cat_totals.items() if amt > 1000
        ]

        try:
            df['day'] = pd.to_datetime(df['date'], errors='coerce').dt.day
            exp_day = df[df['drcr'] == 'DR']
            first_half  = float(exp_day[exp_day['day'] <= 15]['amount'].sum())
            second_half = float(exp_day[exp_day['day'] > 15]['amount'].sum())
        except Exception:
            first_half = second_half = total_out / 2

        top3 = [float(x) for x in expense_df.nlargest(3, 'amount')['amount'].tolist()] or [0, 0, 0]
        score = 100
        if total_out > total_in: score -= 20
        if len(reduce_advice) >= 3: score -= 10
        if first_half > second_half * 1.5: score -= 15

        ai_tip = "Track your expenses regularly and look for areas to reduce spending."
        if model and not using_fallback:
            try:
                tip = model.generate_content(
                    f"Income: ₹{total_in:.0f}, Expenses: ₹{total_out:.0f}, "
                    f"Top categories: {', '.join(cat_totals.nlargest(3).index.tolist())}. "
                    "Give ONE short actionable financial tip (max 2 sentences)."
                )
                ai_tip = tip.text.strip()
            except Exception:
                pass

        return jsonify({
            'categorized': df[['description', 'category', 'amount', 'date']].to_dict('records'),
            'analytics': {
                'totalInflow': total_in,
                'totalOutflow': total_out,
                'oneTimeExpenses': [],
                'billCalendar': [],
                'reduceAdvice': reduce_advice,
                'halfMonthComparison': {'firstHalf': first_half, 'secondHalf': second_half},
                'top3Spends': top3,
                'score': int(score),
                'simulatedSavedAmount': f"{sum(top3) * 1.07:.2f}",
                'aiTip': ai_tip,
            },
            'warning': 'Using rule-based categorization.' if using_fallback else None,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ask-question', methods=['POST'])
def ask_question():
    global stored_df
    try:
        data = request.get_json()
        question = data.get('question', '')
        has_data = stored_df is not None and len(stored_df) > 0

        if model:
            if has_data:
                exp = stored_df[stored_df['category'] != 'Income']
                inc = stored_df[stored_df['category'] == 'Income']['amount'].sum()
                out = exp['amount'].sum()
                breakdown = "\n".join(f"- {c}: ₹{a:.0f}" for c, a in exp.groupby('category')['amount'].sum().items())
                prompt = (
                    f"Financial data — Income: ₹{inc:.0f}, Expenses: ₹{out:.0f}\n"
                    f"Breakdown:\n{breakdown}\n\n"
                    f"User question: {question}\n"
                    "Answer in 2-4 sentences, plain text, no formatting."
                )
            else:
                prompt = f"Financial advice question: {question}\nAnswer in 2-4 sentences, plain text."
            try:
                answer = model.generate_content(prompt).text.strip()
            except Exception as e:
                answer = f"AI unavailable: {str(e)}"
        else:
            answer = "AI service not configured. Please set GEMINI_API_KEY."

        return jsonify({'answer': answer, 'hasData': has_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/check-data', methods=['GET'])
def check_data():
    global stored_df
    loaded = stored_df is not None and len(stored_df) > 0
    return jsonify({'loaded': loaded, 'count': len(stored_df) if loaded else 0})


@app.route('/api/generate-nudges', methods=['POST'])
def generate_nudges():
    try:
        budgets = request.get_json().get('budgets', [])
        msgs = {
            'high':   ["🚨 {category} budget just called 911!", "🔥 {category} at {percentage}%! Wallet is crying!", "💸 {category} is in the danger zone!"],
            'medium': ["⚡ {category} at {percentage}%. Pump the brakes!", "🎯 {category} halfway gone. Stay strategic!"],
            'low':    ["🎉 {category} looking good! Financial ninja!", "💪 {category} under control. Keep it up!"],
        }
        nudges = []
        for b in budgets:
            pct = (b['spent'] / b['limit'] * 100) if b['limit'] > 0 else 0
            t = 'high' if pct >= 90 else 'medium' if pct >= 50 else 'low'
            msg = random.choice(msgs[t]).replace('{category}', b['category']).replace('{percentage}', str(int(pct)))
            nudges.append({
                'category': b['category'], 'message': msg,
                'type': 'danger' if pct >= 90 else 'warning' if pct >= 75 else 'success',
                'percentage': int(pct), 'remaining': b['limit'] - b['spent'],
            })
        return jsonify({'nudges': nudges})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/check-achievements', methods=['GET'])
def check_achievements():
    global stored_df
    savings = 0
    food_count = 0
    if stored_df is not None and len(stored_df) > 0:
        inc = stored_df[stored_df['drcr'] == 'CR']['amount'].sum()
        out = stored_df[stored_df['drcr'] == 'DR']['amount'].sum()
        savings = float(inc - out)
        food_count = int(stored_df[stored_df['description'].str.lower().str.contains('swiggy|zomato', na=False)].shape[0])

    achievements = [
        {'id': 'budget_saver',      'title': 'Budget Saver',      'description': 'Save over ₹5,000',          'icon': '🏆', 'unlocked': savings > 5000,      'progress': min(100, int(savings / 50)),   'reward': 'Financial Ninja Badge'},
        {'id': 'no_delivery',       'title': 'No-Delivery Streak', 'description': '0 food delivery orders',    'icon': '🔥', 'unlocked': food_count == 0,     'progress': max(0, 100 - food_count * 14), 'reward': 'Home Chef Badge'},
        {'id': 'savings_champion',  'title': 'Savings Champion',   'description': 'Save ₹5,000 in a month',   'icon': '💎', 'unlocked': savings >= 5000,     'progress': min(100, int(savings / 50)),   'reward': 'Money Master Badge'},
        {'id': 'financial_levelup', 'title': 'Financial Level Up', 'description': 'Improve financial score',  'icon': '⭐', 'unlocked': True,                 'progress': 100,                           'reward': 'Level Up Badge'},
    ]
    return jsonify({'achievements': achievements, 'level': sum(1 for a in achievements if a['unlocked'])})


@app.route('/api/suggest-alternatives', methods=['POST'])
def suggest_alternatives():
    global stored_df
    food_count   = int(stored_df[stored_df['description'].str.lower().str.contains('swiggy|zomato', na=False)].shape[0]) if stored_df is not None else 0
    coffee_count = int(stored_df[stored_df['description'].str.lower().str.contains('starbucks|cafe|coffee', na=False)].shape[0]) if stored_df is not None else 0
    cab_count    = int(stored_df[stored_df['description'].str.lower().str.contains('uber|ola|taxi', na=False)].shape[0]) if stored_df is not None else 0

    alternatives = [
        {'category': 'Food',     'current': 'Food Delivery',           'currentCost': 800,  'alternative': 'Cook at Home',      'alternativeCost': 200, 'savings': 600,  'monthlySavings': 18000, 'icon': '🍳', 'tip': f"You ordered {food_count} times! Meal prep on Sundays saves time and money."},
        {'category': 'Travel',   'current': 'Uber/Ola',                'currentCost': 250,  'alternative': 'Metro/Bus',         'alternativeCost': 40,  'savings': 210,  'monthlySavings': 6300,  'icon': '🚇', 'tip': f"You took {cab_count} cab rides! Public transport is faster during rush hour."},
        {'category': 'Food',     'current': 'Daily Starbucks',         'currentCost': 300,  'alternative': 'Home Coffee',       'alternativeCost': 30,  'savings': 270,  'monthlySavings': 8100,  'icon': '☕', 'tip': f"You bought coffee {coffee_count} times! A coffee maker pays for itself in 2 weeks."},
        {'category': 'Bills',    'current': 'Multiple Streaming Apps', 'currentCost': 1500, 'alternative': 'Share Family Plans','alternativeCost': 500, 'savings': 1000, 'monthlySavings': 1000,  'icon': '📺', 'tip': 'Split Netflix, Prime, Hotstar with friends!'},
        {'category': 'Shopping', 'current': 'Impulse Online Shopping', 'currentCost': 2000, 'alternative': '24-Hour Wait Rule', 'alternativeCost': 500, 'savings': 1500, 'monthlySavings': 1500,  'icon': '🛍️', 'tip': 'Add to cart, wait 24 hours. Still want it? Then buy!'},
    ]
    total = sum(a['monthlySavings'] for a in alternatives)
    return jsonify({'alternatives': alternatives, 'totalMonthlySavings': total, 'yearlyProjection': total * 12})


@app.route('/api/predict-overspending', methods=['POST'])
def predict_overspending():
    global stored_df
    if stored_df is None or len(stored_df) == 0:
        return jsonify({'error': 'No transactions available. Upload CSV first.'}), 400
    try:
        df = stored_df.copy()
        df['day'] = pd.to_datetime(df['date'], errors='coerce').dt.day
        exp = df[df['drcr'] == 'DR']
        current_day = int(df['day'].dropna().max()) if not df['day'].dropna().empty else 15
        total_spent = float(exp['amount'].sum())
        daily_avg   = total_spent / current_day if current_day > 0 else 0
        projected   = daily_avg * 30

        predictions = []
        for cat in exp['category'].unique():
            cat_df  = exp[exp['category'] == cat]
            cat_amt = float(cat_df['amount'].sum())
            cat_avg = cat_amt / current_day if current_day > 0 else 0
            predictions.append({'category': cat, 'currentSpent': cat_amt, 'projectedSpend': int(cat_avg * 30), 'dailyAverage': int(cat_avg)})

        return jsonify({
            'currentDay': current_day, 'daysInMonth': 30,
            'totalSpent': int(total_spent), 'dailyAverage': int(daily_avg),
            'projectedMonthlySpend': int(projected), 'predictions': predictions, 'warnings': [],
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recent-transactions', methods=['GET'])
def recent_transactions():
    global stored_df
    if stored_df is None or len(stored_df) == 0:
        return jsonify({'transactions': []})
    txns = stored_df[['description', 'category', 'amount', 'date']].tail(10).to_dict('records')
    return jsonify({'transactions': txns})


@app.route('/api/category-totals', methods=['GET'])
def category_totals():
    global stored_df
    if stored_df is None or len(stored_df) == 0:
        return jsonify({'categories': []})
    exp = stored_df[stored_df['category'] != 'Income']
    totals = exp.groupby('category')['amount'].sum()
    grand  = totals.sum()
    colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6']
    cats = [
        {'category': c, 'total': float(a), 'percentage': round(float(a) / grand * 100, 1) if grand > 0 else 0, 'color': colors[i % len(colors)]}
        for i, (c, a) in enumerate(totals.items())
    ]
    return jsonify({'categories': cats})
