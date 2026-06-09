# CampusPilot AI Demo Script

## Demo Goal

Demonstrate conversational navigation, accessibility-aware routing, indoor positioning, and real-time adaptability.

---

## Demo Scenario 1: Standard Navigation

### User Query

Take me to the Computer Science Lab.

### Expected Flow

1. User enters query.
2. System identifies navigation intent.
3. QR scan determines current location.
4. Route generated.
5. Route displayed.

### Expected Response

Route from Library to Computer Science Lab optimized for Invisible profile.

---

## Demo Scenario 2: Wheelchair Accessibility

### User Query

I use a wheelchair. Take me to the Admin Block.

### Expected Flow

1. Profile detected.
2. Stairs excluded.
3. Lift-enabled route generated.

### Expected Response

Accessible route from Library to Admin Block optimized for Wheelchair profile.

---

## Demo Scenario 3: Visually Impaired User

### User Query

I am visually impaired. Guide me to Room 301.

### Expected Flow

1. Vision profile detected.
2. Audio-first instructions generated.

### Expected Response

Route from Entrance to Room 301 optimized for Vision-Impaired profile.

---

## Demo Scenario 4: Obstacle Reporting

### User Action

Flag obstacle.

Location: Lift A

Description: Out of service.

### Expected Response

Obstacle flagged at Lift A: Out of service.

---

## Fallback Plan

If the frontend fails:

- Execute tools directly from terminal.
- Show pytest passing results.
- Explain architecture diagram.

If Groq API fails:

- Use mocked responses.
- Demonstrate tool execution manually.

If internet fails:

- Explain Bluetooth mesh design.
- Show offline architecture slide.