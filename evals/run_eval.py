"""
CampusPilot AI — Evaluation Runner
====================================
Runs the 20 golden queries against the intent classifier and profile handler,
reporting pass/fail for each query and a final accuracy score.

Usage:
    python3 evals/run_eval.py

Note:
    This script validates the heuristic classification layer only. Full LLM
    end-to-end evaluation requires a live GROQ_API_KEY and a running
    Neo4j instance (see evals/e2e_results.md for those results).
"""

import json
import os
import sys

# Ensure the project root is on the path for module resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent.intent_classifier import classify_intent
from backend.agent.profile_handler import parse_profile


def run_evals(queries_path: str = None) -> dict:
    """
    Loads the golden query dataset and evaluates intent classification accuracy.

    Args:
        queries_path (str): Path to the golden_queries.json file. Defaults to
                            the file co-located with this script.

    Returns:
        dict: A summary containing 'passed', 'total', and 'accuracy' keys.
    """
    if queries_path is None:
        queries_path = os.path.join(os.path.dirname(__file__), "golden_queries.json")

    with open(queries_path, "r", encoding="utf-8") as f:
        queries = json.load(f)

    passed = 0
    total = len(queries)

    print("=" * 65)
    print("  CampusPilot AI — Intent Classification Evaluation")
    print("=" * 65)

    for q in queries:
        predicted_intent = classify_intent(q["query"])
        profile = parse_profile(q["profile"]).value
        expected = q["expected_intent"]

        success = predicted_intent == expected
        if success:
            passed += 1
            status = "✅ PASS"
        else:
            status = f"❌ FAIL  (got='{predicted_intent}', expected='{expected}')"

        print(f"[{q['id']:>3}] ({profile:<18}) {status}")
        print(f"       Query: \"{q['query']}\"")

    accuracy = passed / total * 100
    print("=" * 65)
    print(f"  Result: {passed}/{total} passed  |  Accuracy: {accuracy:.1f}%")
    print("=" * 65)

    return {"passed": passed, "total": total, "accuracy": accuracy}


if __name__ == "__main__":
    results = run_evals()
    # Exit with a non-zero code if accuracy drops below 80% (CI gate)
    sys.exit(0 if results["accuracy"] >= 80.0 else 1)
