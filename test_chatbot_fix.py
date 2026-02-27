#!/usr/bin/env python3
"""
Quick test script to verify chatbot data storage is working
"""

import requests
import os

API_URL = "http://localhost:5000"

def test_data_check():
    """Test if data is loaded"""
    print("🧪 Testing data check endpoint...")
    try:
        response = requests.get(f"{API_URL}/api/check-data")
        data = response.json()
        
        print(f"\n📊 Result:")
        print(f"  Loaded: {data['loaded']}")
        print(f"  Message: {data['message']}")
        print(f"  Count: {data['count']}")
        
        if data['loaded']:
            print(f"  Categories: {', '.join(data['categories'])}")
            print("\n✅ Data is loaded! Chatbot should work!")
            return True
        else:
            print("\n⚠️ No data loaded. Please upload CSV in Analyzer first.")
            return False
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure Python backend is running on port 5000")
        return False

def test_chatbot():
    """Test chatbot with a simple question"""
    print("\n🤖 Testing chatbot...")
    try:
        response = requests.post(
            f"{API_URL}/ask-question",
            json={"question": "What's my total spending?"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n💬 Chatbot Response:")
            print(f"  {data['answer']}")
            print("\n✅ Chatbot is working!")
            return True
        else:
            error = response.json()
            print(f"\n❌ Error: {error.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🔧 Chatbot Data Storage Test")
    print("=" * 60)
    
    # Test 1: Check if data is loaded
    data_loaded = test_data_check()
    
    # Test 2: Try chatbot if data is loaded
    if data_loaded:
        test_chatbot()
    else:
        print("\n📝 Steps to fix:")
        print("  1. Go to http://localhost:8080/analyzer")
        print("  2. Upload any CSV from backend/data/")
        print("  3. Run this test again")
    
    print("\n" + "=" * 60)
