"""
Test script for Python backend
Run this to verify all endpoints are working
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/hello")
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_upload_csv():
    """Test CSV upload and analysis"""
    print("\n2. Testing CSV Upload & Analysis...")
    try:
        with open('backend/data/sampleCSV.csv', 'rb') as f:
            files = {'csvFile': f}
            response = requests.post(f"{BASE_URL}/analyze-transactions", files=files)
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Transactions: {len(data['categorized'])}")
        print(f"✅ Total Income: ₹{data['analytics']['totalInflow']}")
        print(f"✅ Total Expenses: ₹{data['analytics']['totalOutflow']}")
        print(f"✅ Financial Score: {data['analytics']['score']}/100")
        print(f"✅ AI Tip: {data['analytics']['aiTip'][:50]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chatbot():
    """Test AI chatbot"""
    print("\n3. Testing AI Chatbot...")
    try:
        payload = {"question": "How can I reduce my spending?"}
        response = requests.post(
            f"{BASE_URL}/ask-question",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Answer: {data['answer'][:100]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_predictions():
    """Test predictive analytics"""
    print("\n4. Testing Predictive Analytics...")
    try:
        response = requests.post(f"{BASE_URL}/predict-overspending")
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Current Day: {data['currentDay']}")
        print(f"✅ Daily Average: ₹{data['dailyAverage']}")
        print(f"✅ Projected Monthly: ₹{data['projectedMonthlySpend']}")
        if data['warnings']:
            print(f"✅ Warning: {data['warnings'][0]['message']}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_alternatives():
    """Test smart alternatives"""
    print("\n5. Testing Smart Alternatives...")
    try:
        response = requests.post(f"{BASE_URL}/suggest-alternatives")
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Total Monthly Savings: ₹{data['totalMonthlySavings']:,}")
        print(f"✅ Yearly Projection: ₹{data['yearlyProjection']:,}")
        print(f"✅ Alternatives: {len(data['alternatives'])}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_achievements():
    """Test gamification"""
    print("\n6. Testing Achievements...")
    try:
        response = requests.get(f"{BASE_URL}/check-achievements")
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Unlocked: {data['unlockedCount']}/{data['totalAchievements']}")
        print(f"✅ Total Points: {data['totalPoints']}")
        print(f"✅ Level: {data['level']}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_nudges():
    """Test nudge generation"""
    print("\n7. Testing Nudge Generation...")
    try:
        payload = {
            "budgets": [
                {"category": "Food", "limit": 5000, "spent": 4250},
                {"category": "Shopping", "limit": 10000, "spent": 8500}
            ]
        }
        response = requests.post(
            f"{BASE_URL}/generate-nudges",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"✅ Nudges Generated: {len(data['nudges'])}")
        for nudge in data['nudges']:
            print(f"   - {nudge['category']}: {nudge['message'][:60]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("  Python Backend Test Suite")
    print("=" * 60)
    print("\nMake sure Python backend is running on port 5000!")
    print("Run: cd backend_python && python app.py")
    input("\nPress Enter to start tests...")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health_check()))
    results.append(("CSV Upload", test_upload_csv()))
    results.append(("AI Chatbot", test_chatbot()))
    results.append(("Predictions", test_predictions()))
    results.append(("Alternatives", test_alternatives()))
    results.append(("Achievements", test_achievements()))
    results.append(("Nudges", test_nudges()))
    
    # Summary
    print("\n" + "=" * 60)
    print("  Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your backend is working perfectly!")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
