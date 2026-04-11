# 📅 Weekly Schedule Manager - Requirement Document

## 🎯 Project Overview

### Project Name
**Weekly Schedule Manager**

### Description
A simple web application that helps users create and manage weekly schedules (Monday to Sunday). The intuitive interface provides an at-a-glance overview of what needs to be done at specific time slots.

### Target User
- Single user (personal use)
- No login/registration required
- Data stored locally in browser

### Core Value Proposition
> **"At-a-glance overview"** - The entire weekly schedule from Monday to Sunday, 6:00 AM to 11:00 PM, displayed in a single screen without scrolling.

### Language Support
- **Default Language**: English
- **Supported Languages**: English, Vietnamese
- Language toggle in Settings panel
- All UI labels, buttons, and messages should be translatable

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | User interface |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **i18n** | Vanilla JS i18n or lightweight library | Multi-language support |
| **Storage** | IndexedDB | Local data persistence |
| **Deployment** | GitHub Pages | Free hosting |

### No Backend Required
- Pure client-side application
- No server or centralized database
- Data stored in browser's IndexedDB

---

## 📋 Functional Requirements

### FR-1: Weekly Schedule

#### FR-1.1: Weekly Display - Compact Grid View
- Display full 7 days: Monday → Sunday
- Default time slots: 6:00 AM - 11:00 PM (17 hours total)
- **NO SCROLL** - Entire grid fits in one viewport
- Use **Compact Grid Design**:
  - Each hour slot height: ~28-30px (17 hours × 30px = 510px grid height)
  - Font size: 10-11px for labels, 9-10px for event text
  - Minimal padding: 2-4px
  - Border width: 1px
- Vertical axis (Y): Time (6AM - 11PM)
- Horizontal axis (X): 7 days of the week

#### FR-1.2: Add/Edit/Delete Schedule
- Click empty slot to add new schedule
- Click existing schedule to edit
- Delete button in edit modal
- Drag & drop to move schedules (optional, Phase 2)

#### FR-1.3: Schedule Information
Each schedule includes:
- **Event/Task Name** (required) - Displayed in grid
- **Tag Color** (category) - Background color of event block
- **Notes** (optional) - Displayed on hover or in detail panel
- **Start Time** - Determines top position of event block
- **End Time** - Determines height of event block

### FR-2: View Modes - Hybrid Approach (Compact + Detail)

#### FR-2.1: Weekly Compact Grid (Main View - Default)
**Goal:** At-a-glance overview of the entire week

**Features:**
- Display entire 7 days × 17 hours in one screen
- Each event shown as colored block with:
  - Event name (truncated if too long, e.g., "Math..." instead of "Mathematics Class")
  - Background color by tag
  - Darker border-left or border-top for distinction
- Hover on event block: Show tooltip with full details (name, notes, detailed time)
- Click on event block: Open Detail Panel on right (or modal) for view/edit details

#### FR-2.2: Detail Panel (Side Panel)
**Goal:** View details when needed without losing overview

**Features:**
- Slide-in panel from right side
- Display full information of selected event:
  - Full name (no truncation)
  - Color tag (with picker to change)
  - Full notes
  - Start/end time (with time picker)
  - Delete button
- Click outside or press X to close panel
- Does not completely obscure grid view (only 300-350px width)

#### FR-2.3: Daily View (Optional - Phase 2)
- Double-click a day to view that day's details
- Display tasks in more detailed timeline
- Can expand hour height for better visibility

### FR-3: Alarm & Notification

#### FR-3.1: Browser Notification
- Send notification when schedule time arrives
- Use browser Notification API
- User needs to grant permission on first use
- Notification displays: Event name + Start time

#### FR-3.2: Alarm Sound
- Play sound when time arrives
- Toggle sound on/off in Settings
- Default sound: Simple beep (not annoying)

#### FR-3.3: Advance Reminder
- Reminder options: 5 minutes, 10 minutes, 15 minutes before
- Configure default in Settings
- Per-event customization (Phase 2)

### FR-4: Data Management

#### FR-4.1: IndexedDB Storage
- Auto-save immediately on changes
- Data persists across sessions
- No manual "Save" button needed

#### FR-4.2: Export/Import
- Export data to JSON file (download to device)
- Import data from JSON backup
- For device change/browser data deletion scenarios

#### FR-4.3: Reset Data
- "Delete All Data" button in Settings
- Confirm dialog: "Are you sure you want to delete all schedules? This action cannot be undone."
- Factory reset to initial state

### FR-5: Settings & Configuration

#### FR-5.1: Display Settings
- Start time (default: 6AM)
- End time (default: 11PM)
- Dark/Light mode toggle
- Show/Hide weekend toggle (Sat, Sun)
- **Language toggle: English/Vietnamese**

#### FR-5.2: Notification Settings
- Enable/disable browser notifications
- Enable/disable alarm sound
- Default reminder time (5/10/15 minutes)

#### FR-5.3: Tag Color Management
- 5-7 basic colors: Red, Orange, Yellow, Green, Blue, Purple, Pink
- Name each color (e.g., "Study", "Work", "Sports", "Entertainment")
- Custom color picker (Phase 2)

---

## 🎨 UI/UX Requirements

### Design Principles
1. **Overview First**: Prioritize at-a-glance overview, details on demand
2. **Minimalist**: Clean interface, remove unnecessary elements
3. **Clean**: Clear layout, not cluttered
4. **Intuitive**: Natural, easy-to-understand interactions
5. **Compact**: Optimize space, no scrolling required

### Color Scheme

#### Light Mode (Default)
- Background: White (#FFFFFF)
- Grid lines: Light gray (#E5E7EB)
- Time labels: Gray (#6B7280)
- Day headers: Blue (#3B82F6) or subtle gradient
- Events: Multiple colors by tag

#### Dark Mode
- Background: Dark gray (#1F2937)
- Grid lines: Darker gray (#374151)
- Time labels: Light gray (#9CA3AF)
- Day headers: Darker blue (#2563EB)
- Events: Multiple colors (adjusted for dark bg)

### Typography
- Font family: Inter or System UI font
- Base size: 14px
- Time labels: 10px, uppercase, bold
- Day headers: 12px, bold
- Event text: 9-10px, truncated with ellipsis

### Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│  📅 Weekly Schedule Manager          ⚙️ Settings  💾 Export  📥 Import│
├──────────────────────────────────────────────────────────────────────┤
│  Week 24, 2025    [Today]                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐           │
│  │Time │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │           │
│  ├─────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤           │
│  │ 6AM │      │      │      │      │      │      │      │           │
│  │ 7AM │      │[Math]│      │      │      │Sleep │      │           │
│  │ 8AM │[Gym] │[Math]│[Meet]│[Code]│      │Sleep │      │           │
│  │ 9AM │[Gym] │      │[Meet]│[Code]│[Shop]│      │      │           │
│  │ ... │      │      │      │      │      │      │      │           │
│  │10PM │      │      │      │      │      │      │      │           │
│  │11PM │      │      │      │      │      │      │      │           │
│  └─────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘           │
│                                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  [+ Add Event]                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Note:** No ← → navigation buttons. The schedule always displays the current week based on today's date.

### Responsive Strategy
- **Desktop (≥1280px)**: Full grid + Detail panel side-by-side
- **Tablet (768-1279px)**: Full grid, Detail panel overlay (modal-style)
- **Mobile (<768px)**: Switch to Daily View by default, swipe to change days

### Multi-Language Support (i18n)
- All UI text stored in translation files
- Default language: English
- Vietnamese translation provided
- Language selection persists in Settings
- Example structure:
```javascript
const translations = {
  en: {
    title: 'Weekly Schedule Manager',
    settings: 'Settings',
    export: 'Export',
    import: 'Import',
    addEvent: 'Add Event',
    today: 'Today',
    // ... more translations
  },
  vi: {
    title: 'Quản lý Thời khóa Biểu Tuần',
    settings: 'Cài đặt',
    export: 'Xuất dữ liệu',
    import: 'Nhập dữ liệu',
    addEvent: 'Thêm Lịch',
    today: 'Hôm nay',
    // ... more translations
  }
};
```

---

## 🔧 Technical Requirements

### TR-1: Code Quality - SOLID Principles (Mandatory)

Strictly apply 5 SOLID principles:

#### 1. Single Responsibility Principle (SRP)
- Each class/function does one thing only
- Example: `ScheduleService` handles only schedule business logic, `NotificationService` handles only notifications

#### 2. Open/Closed Principle (OCP)
- Entities open for extension, closed for modification
- Use interface/abstract class

#### 3. Liskov Substitution Principle (LSP)
- Child classes can replace parent classes
- Proper inheritance design

#### 4. Interface Segregation Principle (ISP)
- Many small interfaces instead of one large interface
- Avoid "fat interface"

#### 5. Dependency Inversion Principle (DIP)
- Depend on abstraction, not concrete implementations
- Use dependency injection

#### Code Structure
```
src/
├── index.html
├── css/
│   └── styles.css (Tailwind imports + custom styles)
├── js/
│   ├── main.js (Bootstrap & initialization)
│   ├── core/
│   │   ├── constants.js
│   │   ├── config.js
│   │   └── types.js
│   ├── services/
│   │   ├── ScheduleService.js
│   │   ├── NotificationService.js
│   │   ├── StorageService.js
│   │   ├── SettingsService.js
│   │   ├── AlarmService.js
│   │   └── I18nService.js (Multi-language support)
│   ├── repositories/
│   │   └── ScheduleRepository.js
│   ├── models/
│   │   ├── Schedule.js
│   │   ├── Tag.js
│   │   └── Settings.js
│   ├── controllers/
│   │   ├── ScheduleController.js
│   │   └── SettingsController.js
│   ├── views/
│   │   ├── IView.js
│   │   ├── WeeklyGridView.js
│   │   ├── DetailPanel.js
│   │   ├── ScheduleModal.js
│   │   └── SettingsModal.js
│   ├── i18n/
│   │   ├── en.js (English translations)
│   │   └── vi.js (Vietnamese translations)
│   └── utils/
│       ├── DateTimeHelper.js
│       ├── NotificationHelper.js
│       ├── ExportImportHelper.js
│       └── DOMHelper.js
└── assets/
    ├── icons/
    └── sounds/
```

### TR-2: Performance
- **Load time**: < 2 seconds
- **Initial render**: < 500ms
- **Smooth interactions**: 60fps
- **No scroll required**: Entire grid fits in viewport

### TR-3: Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Not supported: IE11

### TR-4: IndexedDB Schema
```javascript
// Database: WeeklyScheduleDB
// Stores: schedules, tags, settings
```

---

## 📦 Development Phases

### Phase 1: MVP
- Setup project, Tailwind CSS, IndexedDB
- Compact grid view (no scroll)
- CRUD operations
- Basic notifications
- Deploy GitHub Pages

### Phase 2: Enhanced Features
- Detail Panel slide-in
- Export/Import
- Tag management
- UI improvements
- Multi-language support (EN/VI)

### Phase 3: Polish & Optimization
- Performance optimization
- Accessibility
- Documentation

---

## ✅ Acceptance Criteria

### AC-1: Weekly Compact Grid View
- [ ] Display 7 days × 17 hours without scroll
- [ ] Responsive desktop/tablet

### AC-2: Schedule Management
- [ ] Add/edit/delete schedules
- [ ] Auto-save to IndexedDB

### AC-3: Detail Panel
- [ ] Slide-in panel
- [ ] View & edit details

### AC-4: Notifications
- [ ] Browser notification
- [ ] Alarm sound
- [ ] 5/10/15 minute reminders

### AC-5: Data Management
- [ ] Export/Import JSON
- [ ] Safe reset

### AC-6: Code Quality
- [ ] SOLID principles
- [ ] No console errors

### AC-7: Multi-Language Support
- [ ] English (default)
- [ ] Vietnamese
- [ ] Language toggle in Settings
- [ ] All UI text translatable

---

## 🚀 Deployment
- GitHub Pages
- HTTPS enabled

---

## 📝 Notes

### Future Enhancements
- Sync across devices
- Google Calendar integration
- Recurring events
- PWA support

### Known Limitations
- Data local only
- Notification requires tab open
- No cloud backup

---

## 👤 Author
Generated by AI Autonomous Engineer based on user requirements.

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| **v1.0** | Initial | First requirement document |
| **v1.1** | Updated | Simplified schedule info (removed location), implemented Hybrid Compact Grid + Detail Panel for "overview at a glance" |
| **v1.2** | Updated | Converted to English, added multi-language support (EN/VI), removed week navigation buttons (always shows current week) |

---

*This document serves as the single source of truth for the Weekly Schedule Manager project.*
