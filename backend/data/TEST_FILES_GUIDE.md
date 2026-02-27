# 📊 Test CSV Files Guide

## 🎯 Available Test Files

### 1. **sampleCSV.csv** (Original)
**Use Case:** General demonstration
**Profile:** Average working professional
- Income: ₹50,000
- Mix of food delivery, shopping, bills
- Moderate spending habits

**Best For:** Initial demo, showing all features

---

### 2. **test_overspending.csv** ⚠️
**Use Case:** Show overspending alerts and nudges
**Profile:** Heavy food delivery user
- Income: ₹50,000
- 10+ Swiggy/Zomato orders
- 5+ Starbucks visits
- Multiple Uber rides
- Heavy shopping

**Expected Behavior:**
- 🚨 High food delivery spending alerts
- ⚠️ Shopping budget warnings
- 💡 Strong nudges: "Your Food budget just called 911!"
- 📊 Financial score: ~60-65/100

**Best For:** Demonstrating the problem statement - overspending on food delivery

---

### 3. **test_good_habits.csv** ✅
**Use Case:** Show positive financial behavior
**Profile:** Budget-conscious person
- Income: ₹45,000
- Mostly groceries and home cooking
- Uses metro instead of cabs
- Minimal food delivery
- Low entertainment spending

**Expected Behavior:**
- 🎉 Positive nudges: "You're a financial ninja!"
- ⭐ High financial score: ~85-90/100
- 🏆 Achievement unlocks
- 💪 Savings streak active

**Best For:** Showing what good financial habits look like

---

### 4. **test_mixed_spending.csv** 📊
**Use Case:** Realistic mixed scenario
**Profile:** Working professional with varied expenses
- Income: ₹75,000 (salary + freelance)
- Rent payment
- Travel expenses (flight, hotel)
- Mix of delivery and groceries
- Multiple subscriptions
- Car expenses

**Expected Behavior:**
- 📊 Balanced financial score: ~70-75/100
- 💡 Some nudges for food delivery
- ⚡ Moderate warnings
- 🎯 Good for showing category breakdown

**Best For:** Realistic demo, showing all analytics features

---

### 5. **test_student_budget.csv** 🎓
**Use Case:** Student/young professional scenario
**Profile:** College student with limited income
- Income: ₹33,000 (scholarship + part-time)
- Hostel and mess fees
- Frequent food delivery (late night orders!)
- Small purchases
- Budget constraints

**Expected Behavior:**
- 🚨 High spending relative to income
- ⚠️ Multiple food delivery warnings
- 💡 Strong nudges to cook/use mess
- 📉 Lower financial score: ~55-60/100

**Best For:** Showing how app helps students manage limited budgets

---

### 6. **test_family_expenses.csv** 👨‍👩‍👧‍👦
**Use Case:** Family with multiple expenses
**Profile:** Dual-income family with kids
- Income: ₹1,50,000 (both salaries)
- Home loan EMI
- School fees (2 kids)
- Family groceries
- Multiple subscriptions
- Kids activities

**Expected Behavior:**
- 📊 Complex category breakdown
- 💰 High absolute spending but manageable
- 🎯 Moderate financial score: ~70-75/100
- 💡 Suggestions for family savings

**Best For:** Showing app works for different user profiles

---

## 🎬 Testing Scenarios

### Scenario 1: Demo the Problem (Use test_overspending.csv)
1. Upload file
2. Show high food delivery spending
3. Point out nudges: "Your Food budget just called 911!"
4. Show smart alternatives: "Cook at home, save ₹18,000/month"
5. Demonstrate predictive warnings

### Scenario 2: Show Success Story (Use test_good_habits.csv)
1. Upload file
2. Show low food delivery spending
3. Point out positive nudges
4. Show high financial score
5. Demonstrate achievements unlocked

### Scenario 3: Realistic Demo (Use test_mixed_spending.csv)
1. Upload file
2. Show comprehensive analytics
3. Demonstrate all chart types
4. Show category-wise breakdown
5. Use chatbot for personalized advice

### Scenario 4: Student Use Case (Use test_student_budget.csv)
1. Upload file
2. Show budget constraints
3. Demonstrate how app helps students
4. Show specific student-friendly alternatives
5. Highlight savings potential

### Scenario 5: Family Use Case (Use test_family_expenses.csv)
1. Upload file
2. Show complex expense management
3. Demonstrate family budget tracking
4. Show how to optimize family spending
5. Highlight EMI and education expenses

---

## 🧪 Quick Test Checklist

### Test 1: Upload & Analysis
- [ ] File uploads successfully
- [ ] Transactions are categorized
- [ ] Charts render correctly
- [ ] Financial score calculated

### Test 2: Budget Nudge Page
- [ ] Navigate to /nudge
- [ ] Progress bars show correctly
- [ ] Nudges are humorous and relevant
- [ ] Achievements display
- [ ] Smart alternatives shown

### Test 3: AI Chatbot
- [ ] Navigate to /chatbot
- [ ] Ask: "How can I reduce my spending?"
- [ ] AI provides personalized advice
- [ ] Response is context-aware

### Test 4: Predictive Analytics
- [ ] Check if warnings are shown
- [ ] Verify spending projections
- [ ] Test category-wise predictions

---

## 💡 Pro Tips for Demo

### For Judges:
1. **Start with test_overspending.csv** - Shows the problem clearly
2. **Switch to test_good_habits.csv** - Shows the solution works
3. **Use chatbot** - Demonstrate AI intelligence

### For Testing:
1. **Use different files** - Test all scenarios
2. **Check all pages** - Analyzer, Nudge, Chatbot
3. **Verify calculations** - Ensure numbers are correct

### For Presentation:
1. **Have multiple files ready** - Show versatility
2. **Know the numbers** - Memorize key metrics from each file
3. **Tell a story** - "This person overspends, here's how we help"

---

## 📊 Expected Results Summary

| File | Income | Expenses | Score | Key Feature |
|------|--------|----------|-------|-------------|
| sampleCSV.csv | ₹50,000 | ~₹38,000 | 75/100 | Balanced |
| test_overspending.csv | ₹50,000 | ~₹42,000 | 60/100 | High alerts |
| test_good_habits.csv | ₹45,000 | ~₹15,000 | 88/100 | Achievements |
| test_mixed_spending.csv | ₹75,000 | ~₹55,000 | 72/100 | Realistic |
| test_student_budget.csv | ₹33,000 | ~₹28,000 | 58/100 | Budget help |
| test_family_expenses.csv | ₹1,50,000 | ~₹1,20,000 | 73/100 | Complex |

---

## 🎯 Which File to Use When

**For Hackathon Demo:**
- Primary: **test_overspending.csv** (shows problem + solution)
- Backup: **test_mixed_spending.csv** (realistic scenario)

**For Testing Features:**
- Nudges: **test_overspending.csv**
- Achievements: **test_good_habits.csv**
- Analytics: **test_mixed_spending.csv**

**For Different Audiences:**
- Students: **test_student_budget.csv**
- Families: **test_family_expenses.csv**
- Professionals: **test_mixed_spending.csv**

---

## 🚀 Quick Start

```bash
# Start servers
cd backend && npm start
npm run dev

# Test each file:
1. Go to http://localhost:5173/analyzer
2. Upload any CSV from backend/data/
3. View analytics
4. Click "💡 Budget Nudge"
5. Try chatbot
```

---

## ✅ All Files Location

```
backend/data/
├── sampleCSV.csv (original)
├── test_overspending.csv (heavy spender)
├── test_good_habits.csv (budget conscious)
├── test_mixed_spending.csv (realistic)
├── test_student_budget.csv (student)
└── test_family_expenses.csv (family)
```

---

## 🏆 Ready to Test!

You now have 6 different CSV files covering all scenarios. Test them all to ensure everything works perfectly!

**Good luck! 🚀**
