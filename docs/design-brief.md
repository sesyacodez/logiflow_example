
# Design Brief: LogiFlow AI

## 1. Project Objective
To create a high-performance, mobile-first interface that allows warehouse staff and dispatchers to manage "chaos" (dynamic demand) with zero friction. The design must communicate **urgency** and **status** at a single glance.

## 2. Target User Personas
* **The Warehouse Operator (Mobile/Tablet):** Working in a loud, fast-paced environment. Needs large touch targets and high-contrast text.
* **The Fleet Dispatcher (Desktop):** Needs a bird's-eye view. Focuses on data density, maps, and "problem spots."

## 3. Visual Strategy & Style
* **Color Palette (Semantic UI):**
    * **Critical (Red):** `#EF4444` — Immediate action required.
    * **Elevated (Amber):** `#F59E0B` — Warning, stock running low.
    * **Stable (Emerald):** `#10B981` — Operations normal.
    * **Primary (Indigo):** `#6366F1` — Brand color for navigation.
* **Typography:** Sans-serif (Inter or Roboto) for maximum readability on small screens. Use **bold weights** for quantities and priority levels.
* **Theme:** **Dark Mode** as default (reduces eye strain in warehouses and saves battery on mobile devices).

---

## 4. Key Wireframe Concepts

### A. The "Urgency Hub" (Dispatcher View)
A split-screen layout.
* **Left Side:** A map with "pulsing" red dots where inventory is critical.
* **Right Side:** An AI-generated "Action List" (e.g., *"Divert Truck #42 from Point B to Point A? [Approve] [Ignore]"*).



### B. The "Fast-Scan" Interface (Warehouse View)
* **Scanning:** A large camera viewport for QR/Barcode scanning.
* **Haptic Feedback:** Vibrations for successful scans or "Critical Change" alerts.
* **Big Buttons:** "Confirm Loading" and "Report Shortage" should be reachable with a thumb.

---

## 5. User Experience (UX) Principles
1.  **Three-Tap Rule:** Any critical action (re-routing a truck or reporting a shortage) must be achievable in 3 taps or fewer.
2.  **Status over Details:** Use icons and colors to show *status* first. Only show *numbers* (e.g., "452 units") when the user taps for more info.
3.  **The "Sync" Indicator:** A clear icon showing if the app is "Live" or "Offline" to build trust during network instability.

---

## 6. Deliverables for the Hackathon
* **High-Fidelity Mockups:** 3 screens (Dashboard, Request Detail, Mobile Scanner).
* **Interactive Prototype:** A clickable flow showing a "Normal" status turning "Critical" and the user fixing it.
* **Logo/Branding:** A simple, geometric logo representing "Flow" or "Connectivity."

---

## 7. Innovation Highlight: "The Ghost Load"
**Concept:** When a shipment is re-routed mid-way, the UI should show a "Ghost" icon at the original destination and a "Redirected" icon at the new one. This visualizes the *change* clearly so the user knows exactly why the plan is different from the morning's schedule.



---
