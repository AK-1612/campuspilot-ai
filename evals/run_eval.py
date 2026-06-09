import json
import sys
import os

# Add the parent directory to the path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.agent.intent_classifier import classify_intent
from backend.agent.profile_handler import parse_profile

def run_evals():
    with open(os.path.join(os.path.dirname(__file__), "golden_queries.json"), "r") as f:
        queries = json.load(f)
        
    passed = 0
    total = len(queries)
    
    print("Running Golden Query Evals...\n")
    
    for q in queries:
        intent = classify_intent(q["query"])
        profile = parse_profile(q["profile"]).value
        
        success = (intent == q["expected_intent"])
        status = "✅ PASS" if success else f"❌ FAIL (Got {intent}, expected {q['expected_intent']})"
        
        if success:
            passed += 1
            
        print(f"[{q['id']}] {q['query']} ({profile}) -> {status}")
        
    print(f"\nScore: {passed}/{total} ({passed/total*100:.1f}%)")

if __name__ == "__main__":
    run_evals()
