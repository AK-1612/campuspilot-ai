# CampusPilot AI — Acceptance Criteria

## User Story 1: First-Year Student

### Given
- The user is a new student unfamiliar with the campus.
- The user has entered a destination.

### When
- The user requests navigation assistance.

### Then
- The system provides a valid route to the destination.
- The route includes clear step-by-step instructions.
- Estimated travel time is displayed.
- Indoor and outdoor navigation are supported.
- The route is generated within acceptable response time.

---

## User Story 2: Wheelchair User

### Given
- The user's accessibility profile is set to wheelchair user.

### When
- The user requests a route.

### Then
- The system automatically excludes stair-only paths.
- Elevators and ramps are prioritized.
- Accessible entrances are preferred.
- Users are notified about elevator outages or blocked accessible routes.
- The route remains compliant with accessibility constraints.

---

## User Story 3: Visually Impaired Professor

### Given
- The user profile indicates visual impairment.

### When
- The user requests navigation assistance.

### Then
- Navigation instructions are provided through audio output.
- The interface remains compatible with screen readers.
- Landmark-based guidance is included.
- Critical alerts are delivered through audio and haptic feedback.
- Visual interaction is not required to complete navigation.

---

## User Story 4: Campus Administrator

### Given
- The administrator has authorized system access.

### When
- Route information is updated.

### Then
- Changes are reflected in the navigation graph.
- Affected routes are recalculated automatically.
- Users receive updated route recommendations.
- Historical updates are logged for auditing purposes.
- Route modifications become available without requiring application reinstallation.

---

## User Story 5: Emergency User

### Given
- An emergency situation exists.
- Internet connectivity may be unavailable.

### When
- The user activates emergency mode or SOS.

### Then
- The system provides the nearest safe evacuation route.
- Emergency alerts are transmitted through the mesh network.
- Last known location is attached to the alert.
- Emergency routing remains available offline.
- The user receives confirmation that the alert has been transmitted.