# CampusPilot AI — Code Standards

## Purpose

This document defines the coding standards followed throughout the CampusPilot AI project. These standards ensure consistency, maintainability, readability, and production readiness.

---

# 1. Naming Conventions

## Functions

Use snake_case.

Example:

def route_query():
    pass

def profile_detect():
    pass

## Variables

Use descriptive snake_case names.

Good:
current_location
destination_node

Avoid:
x
temp
data1

## Classes

Use PascalCase.

Example:

class NavigationAgent:
    pass

class ShadowMapAgent:
    pass

## Constants

Use UPPER_CASE.

Example:

MAX_ROUTE_LENGTH = 100
DEFAULT_TIMEOUT = 30

---

# 2. Type Hints

All public functions must include type hints.

Example:

def route_query(
    start_location: str,
    destination: str
) -> dict:
    pass

Benefits:
- Better readability
- Easier debugging
- Improved IDE support

---

# 3. Docstrings

Every public function, class, and module must include a docstring.

Example:

def qr_lookup(qr_code: str) -> dict:
    """
    Resolves a QR checkpoint identifier
    into a campus location.
    """
    pass

---

# 4. Error Handling

Avoid silent failures.

Never:

except:
    pass

Always:

except Exception as e:
    logger.error(str(e))
    raise

All API endpoints must return meaningful error messages.

---

# 5. Code Quality Rules

### Allowed

- Clear and descriptive naming
- Modular functions
- Reusable components
- Small focused functions
- Explicit return values

### Not Allowed

- TODO comments in production code
- Dead code
- Unused imports
- Hardcoded credentials
- Magic numbers without explanation

---

# 6. Testing Requirements

Every major feature must include tests.

Required:
- Unit tests
- API tests
- Edge case tests

Critical navigation logic must never be merged without passing tests.

---

# 7. Documentation Requirements

All major modules must document:

- Purpose
- Inputs
- Outputs
- Error cases

README must remain updated with architecture and setup instructions.

---

# 8. Git Standards

Commit messages should be descriptive.

Good:

feat: add qr location lookup
test: add route query unit tests
docs: update user stories

Avoid:

update
changes
fix stuff

---

# 9. Review Checklist

Before merging:

✓ Type hints added

✓ Docstrings added

✓ Tests pass

✓ No linting issues

✓ No dead code

✓ No TODO comments

✓ Error handling present

✓ Documentation updated

---

# 10. Production Principle

Code should be written as if it will be maintained by someone unfamiliar with the project six months from now.

Clarity is preferred over cleverness.
Reliability is preferred over shortcuts.
Accessibility is treated as a core system requirement.