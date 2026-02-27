import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('backend_python/.env')

api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key: {api_key[:10]}..." if api_key else "No API key found")

genai.configure(api_key=api_key)

print("\nTesting available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✓ {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

print("\nTesting model initialization...")
model_names = ['gemini-pro', 'models/gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash']

for name in model_names:
    try:
        model = genai.GenerativeModel(name)
        response = model.generate_content("Say hello")
        print(f"✓ {name} - WORKS! Response: {response.text[:50]}")
        break
    except Exception as e:
        print(f"✗ {name} - Failed: {str(e)[:80]}")
