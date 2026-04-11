# 📅 Weekly Schedule Manager - Requirement Document

## 🎯 Project Overview

### Project Name
**Weekly Schedule Manager** - Quản lý thời khóa biểu tuần

### Description
Một ứng dụng web đơn giản giúp người dùng tạo và quản lý thời khóa biểu trong tuần (Thứ 2 - Chủ Nhật). Giao diện trực quan cho phép nhìn tổng thể và biết được cần làm gì vào từng khung giờ cụ thể.

### Target User
- Sử dụng cá nhân (single user)
- Không yêu cầu đăng nhập/đăng ký
- Dữ liệu lưu trữ cục bộ trên trình duyệt

### Core Value Proposition
> **"Nhìn một cái là thấy bao quát"** - Toàn bộ thời khóa biểu từ Thứ 2 đến Chủ Nhật, từ 6:00 AM đến 11:00 PM, hiển thị trong một màn hình duy nhất, không cần scroll.

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Giao diện người dùng |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Storage** | IndexedDB | Lưu trữ dữ liệu cục bộ |
| **Deployment** | GitHub Pages | Hosting miễn phí |

### No Backend Required
- Ứng dụng hoàn toàn chạy ở client-side
- Không có server, database tập trung
- Dữ liệu lưu trong IndexedDB của trình duyệt

---

## 📋 Functional Requirements

### FR-1: Thời Khóa Biểu Tuần

#### FR-1.1: Hiển thị tuần - Compact Grid View
- Hiển thị đầy đủ 7 ngày: Thứ 2 → Chủ Nhật
- Khung giờ mặc định: 6:00 AM - 11:00 PM (17 giờ total)
- **KHÔNG SCROLL** - Toàn bộ grid hiển thị trong một viewport
- Sử dụng **Compact Grid Design**:
  - Chiều cao mỗi ô giờ: ~28-30px (tương đương 17 hours × 30px = 510px chiều cao grid)
  - Font size: 10-11px cho labels, 9-10px cho event text
  - Padding minimal: 2-4px
  - Border width: 1px
- Trục dọc (Y): Thời gian (6AM - 11PM)
- Trục ngang (X): 7 ngày trong tuần

#### FR-1.2: Thêm/Sửa/Xóa lịch
- Click vào ô trống để thêm lịch mới
- Click vào lịch đã tồn tại để chỉnh sửa
- Nút xóa trong modal chỉnh sửa
- Drag & drop để di chuyển lịch (optional, Phase 2)

#### FR-1.3: Thông tin một lịch học/làm việc
Mỗi lịch bao gồm:
- **Tên công việc/học phần** (bắt buộc) - Hiển thị trong grid
- **Màu sắc tag** (phân loại) - Background color của event block
- **Ghi chú** (optional) - Hiển thị khi hover hoặc trong detail panel
- **Thời gian bắt đầu** - Xác định vị trí top của event block
- **Thời gian kết thúc** - Xác định chiều cao của event block

### FR-2: Chế độ xem - Hybrid Approach (Compact + Detail)

#### FR-2.1: Weekly Compact Grid (Main View - Mặc định)
**Mục tiêu:** Nhìn một cái là thấy bao quát toàn bộ tuần

**Đặc điểm:**
- Hiển thị toàn bộ 7 ngày × 17 giờ trong một màn hình
- Mỗi event hiển thị dưới dạng colored block với:
  - Tên công việc (truncated nếu quá dài, ví dụ: "Math..." thay vì "Mathematics Class")
  - Background color theo tag
  - Border-left hoặc border-top đậm hơn để phân biệt
- Hover vào event block: Hiển thị tooltip với đầy đủ thông tin (tên, ghi chú, thời gian chi tiết)
- Click vào event block: Mở Detail Panel bên phải (hoặc modal) để xem/chỉnh sửa chi tiết

#### FR-2.2: Detail Panel (Side Panel)
**Mục tiêu:** Xem chi tiết khi cần, không làm mất overview

**Đặc điểm:**
- Slide-in panel từ bên phải màn hình
- Hiển thị thông tin đầy đủ của event được chọn:
  - Tên đầy đủ (không truncate)
  - Tag màu (với picker để thay đổi)
  - Ghi chú đầy đủ
  - Thời gian bắt đầu/kết thúc (với time picker)
  - Nút xóa
- Click ra ngoài hoặc nhấn X để đóng panel
- Không che khuất hoàn toàn grid view (chỉ chiếm 300-350px bề ngang)

#### FR-2.3: Daily View (Optional - Phase 2)
- Click đúp vào một ngày để xem chi tiết ngày đó
- Hiển thị danh sách công việc theo timeline chi tiết hơn
- Có thể expand chiều cao mỗi giờ để xem rõ hơn

### FR-3: Báo thức & Notification

#### FR-3.1: Browser Notification
- Gửi notification khi đến giờ của một lịch
- Sử dụng Notification API của trình duyệt
- Người dùng cần grant permission lần đầu
- Notification hiển thị: Tên công việc + Thời gian bắt đầu

#### FR-3.2: Âm thanh báo thức
- Phát âm thanh khi đến giờ
- Có thể tắt/bật tính năng âm thanh trong Settings
- Âm thanh mặc định: Beep simple (không gây khó chịu)

#### FR-3.3: Nhắc nhở trước
- Tùy chọn nhắc nhở trước: 5 phút, 10 phút, 15 phút
- Cấu hình mặc định trong Settings
- Có thể tùy chỉnh per-event (Phase 2)

### FR-4: Quản lý dữ liệu

#### FR-4.1: Lưu trữ IndexedDB
- Tự động lưu ngay khi có thay đổi (auto-save)
- Dữ liệu persist qua các phiên làm việc
- Không cần nút "Save" thủ công

#### FR-4.2: Export/Import
- Export dữ liệu ra file JSON (download về máy)
- Import dữ liệu từ file JSON backup
- Phòng trường hợp đổi máy/xóa browser data

#### FR-4.3: Reset dữ liệu
- Nút "Xóa toàn bộ dữ liệu" trong Settings
- Có confirm dialog: "Bạn có chắc chắn muốn xóa toàn bộ thời khóa biểu? Hành động này không thể hoàn tác."
- Factory reset về trạng thái ban đầu

### FR-5: Settings & Configuration

#### FR-5.1: Cấu hình hiển thị
- Khung giờ bắt đầu (default: 6AM)
- Khung giờ kết thúc (default: 11PM)
- Toggle Dark/Light mode
- Toggle Show/Hide weekend (Thứ 7, CN)

#### FR-5.2: Cấu hình notification
- Bật/tắt browser notification
- Bật/tắt âm thanh báo thức
- Thời gian nhắc nhở mặc định (5/10/15 phút)

#### FR-5.3: Quản lý màu tag
- 5-7 màu cơ bản: Đỏ, Cam, Vàng, Lục, Lam, Tím, Hồng
- Đặt tên cho mỗi màu (ví dụ: "Học", "Làm việc", "Thể thao", "Giải trí")
- Thêm màu custom (color picker) - Phase 2

---

## 🎨 UI/UX Requirements

### Design Principles
1. **Overview First**: Ưu tiên hiển thị tổng quan, chi tiết khi cần
2. **Minimalist**: Giao diện tối giản, loại bỏ yếu tố không cần thiết
3. **Clean**: Sắp xếp rõ ràng, không rối mắt
4. **Intuitive**: Thao tác tự nhiên, dễ hiểu
5. **Compact**: Tối ưu không gian, không scroll

### Color Scheme

#### Light Mode (Default)
- Background: White (#FFFFFF)
- Grid lines: Light gray (#E5E7EB)
- Time labels: Gray (#6B7280)
- Day headers: Blue (#3B82F6) hoặc gradient nhẹ
- Events: Multiple colors theo tag

#### Dark Mode
- Background: Dark gray (#1F2937)
- Grid lines: Darker gray (#374151)
- Time labels: Light gray (#9CA3AF)
- Day headers: Blue đậm (#2563EB)
- Events: Multiple colors (adjusted for dark bg)

### Typography
- Font family: Inter hoặc System UI font
- Base size: 14px
- Time labels: 10px, uppercase, bold
- Day headers: 12px, bold
- Event text: 9-10px, truncated với ellipsis

### Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│  📅 Weekly Schedule Manager          ⚙️ Settings  💾 Export  📥 Import│
├──────────────────────────────────────────────────────────────────────┤
│  ← Week 24, 2025 →    [Today]                                        │
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

### Responsive Strategy
- **Desktop (≥1280px)**: Full grid + Detail panel side-by-side
- **Tablet (768-1279px)**: Full grid, Detail panel overlay (modal-style)
- **Mobile (<768px)**: Chuyển sang Daily View mặc định, swipe để đổi ngày

---

## 🔧 Technical Requirements

### TR-1: Code Quality - SOLID Principles (Bắt buộc)

Áp dụng nghiêm ngặt 5 nguyên tắc SOLID:

#### 1. Single Responsibility Principle (SRP)
- Mỗi class/function chỉ làm một việc
- Ví dụ: `ScheduleService` chỉ xử lý business logic của schedule, `NotificationService` chỉ xử lý notification

#### 2. Open/Closed Principle (OCP)
- Các entity mở rộng được nhưng không sửa đổi
- Sử dụng interface/abstract class

#### 3. Liskov Substitution Principle (LSP)
- Các class con có thể thay thế class cha
- Thiết kế inheritance đúng cách

#### 4. Interface Segregation Principle (ISP)
- Nhiều interface nhỏ thay vì một interface lớn
- Tránh "fat interface"

#### 5. Dependency Inversion Principle (DIP)
- Phụ thuộc vào abstraction, không phải concrete
- Sử dụng dependency injection

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
│   │   └── AlarmService.js
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
- **No scroll required**: Toàn bộ grid fit trong viewport

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

### Phase 3: Polish & Optimization
- Performance optimization
- Accessibility
- Documentation

---

## ✅ Acceptance Criteria

### AC-1: Weekly Compact Grid View
- [ ] Hiển thị 7 ngày × 17 giờ không scroll
- [ ] Responsive desktop/tablet

### AC-2: Schedule Management
- [ ] Thêm/sửa/xóa lịch
- [ ] Auto-save IndexedDB

### AC-3: Detail Panel
- [ ] Slide-in panel
- [ ] Hiển thị & chỉnh sửa chi tiết

### AC-4: Notifications
- [ ] Browser notification
- [ ] Âm thanh
- [ ] Reminder 5/10/15 phút

### AC-5: Data Management
- [ ] Export/Import JSON
- [ ] Reset an toàn

### AC-6: Code Quality
- [ ] SOLID principles
- [ ] No console errors

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

---

*This document serves as the single source of truth for the Weekly Schedule Manager project.*
