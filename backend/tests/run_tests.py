import sys
from pathlib import Path

# Add project root to sys.path
project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

# Import the test modules
try:
    from backend.tests import test_tools
    from backend.tests import test_agent
    from backend.tests import test_api
    print("Test modules imported successfully.")
except Exception as e:
    print(f"Error importing test modules: {e}")
    sys.exit(1)

def run_tests():
    modules = [test_tools, test_agent, test_api]
    passed = 0
    failed = 0
    
    for module in modules:
        print(f"\nRunning tests in {module.__name__}:")
        # Find all functions starting with "test_"
        test_funcs = [getattr(module, attr) for attr in dir(module) if attr.startswith("test_") and callable(getattr(module, attr))]
        
        for func in test_funcs:
            try:
                func()
                print(f"  ✅ {func.__name__} passed")
                passed += 1
            except AssertionError as e:
                print(f"  ❌ {func.__name__} FAILED (AssertionError)")
                failed += 1
            except Exception as e:
                print(f"  ❌ {func.__name__} ERROR: {e}")
                failed += 1
                
    print(f"\n=====================================")
    print(f"Summary: {passed} passed, {failed} failed")
    print(f"=====================================")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
