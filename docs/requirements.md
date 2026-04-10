# Project Requirements: Smart Weekly Scheduler & Alarm System

## 1. Project Overview
A client-side web application designed to help users manage their weekly schedule (Monday to Sunday) with an integrated intelligent alarm system. The application runs entirely in the browser, requiring no backend server, and focuses on a minimalist, elegant, and highly usable user interface.

## 2. Target Audience
International users seeking a simple, fast, and privacy-focused tool for time management and task reminders without the complexity of heavy calendar suites.

## 3. Technology Stack
- **Core:** HTML5, CSS3, JavaScript (ES6+ Modules).
- **Styling:** TailwindCSS (via CDN) for rapid, utility-first styling.
- **Database:** IndexedDB (via `idb` library) for robust client-side data persistence.
- **Utilities:** 
  - `dayjs`: Lightweight date manipulation.
  - `Toastify-js`: Elegant notification toasts.
  - `Phosphor Icons` or `Heroicons`: Clean, modern iconography.
- **Architecture:** Strict Object-Oriented Programming (OOP) adhering to SOLID principles.

## 4. Functional Requirements

### 4.1. Weekly Schedule Management
- **Visual Layout:** A clean, responsive grid view displaying Monday through Sunday. The vertical axis represents time slots (e.g., 00:00 - 23:59).
- **CRUD Operations:**
  - **Create:** Click any time slot to open a modal for adding an event (Title, Description, Color, Start/End Time, Repeat Options).
  - **Read:** Display events as colored blocks within the grid. Hovering shows details.
  - **Update:** Drag-and-drop to reschedule events. Click to edit details.
  - **Delete:** Right-click or use a delete button to remove events.
- **Recurrence:** Support for repeating events (Daily, Weekly, Specific Days).

### 4.2. Intelligent Alarm System
- **Real-time Monitoring:** A background process (using `requestAnimationFrame` or optimized `setInterval`) checks for upcoming events every second.
- **Triggers:**
  - **Visual:** A prominent, non-intrusive modal overlay with the event details.
  - **Audio:** A pleasant, customizable alarm sound.
  - **System Notification:** Uses the Browser Notification API for alerts when the tab is inactive.
- **Controls:** "Snooze" (5 mins), "Dismiss", or "Stop Alarm".

### 4.3. User Interface & Experience (UI/UX)
- **Design Philosophy:** "Less is More." The UI must be beautiful, intuitive, simple, refined, and convenient.
- **Responsiveness:** Fully adaptive layout. Desktop shows the full week grid; Mobile switches to a day-by-day list view or a simplified horizontal scroll.
- **Theme:** Built-in Dark/Light mode toggle with smooth transitions.
- **Feedback:** Instant visual feedback (toasts, animations) for all user actions.
- **Performance:** Zero layout shift, instant interactions, < 100ms response time for UI updates.

## 5. Strict SOLID Compliance
**CRITICAL:** This project must strictly adhere to the SOLID principles. Code reviews will reject any violation of these principles.

### 5.1. Single Responsibility Principle (SRP)
- **Rule:** A class/module must have one, and only one, reason to change.
- **Implementation:**
  - `DatabaseService`: ONLY handles IndexedDB transactions (open, add, update, delete). It knows nothing about UI or Alarms.
  - `AlarmService`: ONLY handles time checking, audio playback, and notifications. It does not render UI or save data directly.
  - `UIService`: ONLY handles DOM manipulation and rendering. It requests data but does not process business logic.
  - `EventManager`: Orchestrates the flow but delegates specific tasks to the above services.

### 5.2. Open/Closed Principle (OCP)
- **Rule:** Software entities should be open for extension but closed for modification.
- **Implementation:**
  - Use interfaces/abstract classes for core logic.
  - To add a new notification type (e.g., Email), create a new class `EmailNotifier` implementing `INotifier` without changing the existing `AlarmService`.
  - Configuration objects should be used instead of hard-coded values to allow behavior changes without code modification.

### 5.3. Liskov Substitution Principle (LSP)
- **Rule:** Objects of a superclass shall be replaceable with objects of its subclasses without breaking the application.
- **Implementation:**
  - If `LocalStorageService` and `IndexedDBService` both implement `IDataStore`, they must be interchangeable. The rest of the app should work regardless of which one is injected, ensuring consistent method signatures and return types.

### 5.4. Interface Segregation Principle (ISP)
- **Rule:** Clients should not be forced to depend upon interfaces that they do not use.
- **Implementation:**
  - Instead of one giant `IManager` interface, split into small, specific interfaces: `ICreatable`, `IEditable`, `IDeletable`, `IAlarmTrigger`.
  - A read-only view component only implements `IReadable`, preventing it from having unused `delete()` or `save()` methods.

### 5.5. Dependency Inversion Principle (DIP)
- **Rule:** High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Implementation:**
  - **Dependency Injection (DI):** The `App` class initializes the container. Services are injected via constructors.
  - Example: `AlarmService` depends on `INotificationStrategy` (abstraction), not `ToastNotification` (concrete class). This allows swapping notification styles easily for testing or feature updates.

## 6. Design System Guidelines
- **Color Palette:** Soft pastels for events (Blue, Green, Purple, Orange) against a neutral background (Slate/Gray).
- **Typography:** 'Inter' or 'Roboto' font family for maximum readability.
- **Spacing:** Consistent 8px grid system.
- **Radius:** Rounded corners (12px for cards, 8px for buttons) for a friendly feel.
- **Shadows:** Soft, diffused shadows (`shadow-lg`, `shadow-xl`) to create depth without clutter.

## 7. Deliverables & Milestones
1.  **Phase 1: Architecture Setup:** Define interfaces, folder structure, and DI container.
2.  **Phase 2: Core Logic:** Implement Database Service and Event Manager (Headless).
3.  **Phase 3: UI Implementation:** Build the Grid, Modals, and connect to Core Logic.
4.  **Phase 4: Alarm System & Polish:** Integrate alarms, notifications, and refine animations.
5.  **Phase 5: Testing & Optimization:** Verify SOLID compliance, performance, and cross-browser compatibility.

## 8. Success Criteria
- Code passes a static analysis check for SOLID violations.
- UI loads in under 1 second.
- Alarms trigger accurately within ±1 second of the scheduled time.
- No external server dependency; works offline after initial load.
