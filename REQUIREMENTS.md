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

#### FR-1.1: Hiển thị tuần
- Hiển thị đầy đủ 7 ngày: Thứ 2 → Chủ Nhật
- Mỗi ngày hiển thị các khung giờ trong ngày
- Khung giờ mặc định: 6:00 AM - 11:00 PM (có thể điều chỉnh)

#### FR-1.2: Thêm/Sửa/Xóa lịch
- Người dùng có thể thêm lịch mới vào bất kỳ ngày/giờ nào
- Chỉnh sửa thông tin lịch đã tạo
- Xóa lịch không còn cần thiết

#### FR-1.3: Thông tin một lịch học/làm việc
Mỗi lịch bao gồm:
- Tên công việc/học phần (bắt buộc)
- Địa điểm (optional)
- Màu sắc tag (phân loại)
- Ghi chú (optional)
- Thời gian bắt đầu
- Thời gian kết thúc

### FR-2: Chế độ xem

#### FR-2.1: Weekly View (Mặc định)
- Hiển thị toàn bộ 7 ngày trong một màn hình
- Dạng lưới (grid) với trục ngang là ngày, trục dọc là giờ
- Có thể scroll để xem đầy đủ các khung giờ

#### FR-2.2: Daily View
- Click vào một ngày để xem chi tiết ngày đó
- Hiển thị danh sách công việc theo thứ tự thời gian

### FR-3: Báo thức & Notification

#### FR-3.1: Browser Notification
- Gửi notification khi đến giờ của một lịch
- Sử dụng Notification API của trình duyệt
- Người dùng cần grant permission lần đầu

#### FR-3.2: Âm thanh báo thức
- Phát âm thanh khi đến giờ
- Có thể tắt/bật tính năng âm thanh
- Chọn bài nhạc báo thức (optional)

#### FR-3.3: Nhắc nhở trước
- Tùy chọn nhắc nhở trước 5 phút, 10 phút, 15 phút
- Cấu hình được trong settings

### FR-4: Quản lý dữ liệu

#### FR-4.1: Lưu trữ IndexedDB
- Tự động lưu khi có thay đổi
- Dữ liệu persist qua các phiên làm việc

#### FR-4.2: Export/Import
- Export dữ liệu ra file JSON
- Import dữ liệu từ file JSON backup
- Phòng trường hợp đổi máy/xóa browser data

#### FR-4.3: Reset dữ liệu
- Nút xóa toàn bộ dữ liệu (có confirm)
- Factory reset về trạng thái ban đầu

### FR-5: Settings & Configuration

#### FR-5.1: Cấu hình hiển thị
- Chọn khung giờ hiển thị (start/end time)
- Chọn bước nhảy thời gian (15min, 30min, 1hour)
- Toggle dark/light mode

#### FR-5.2: Cấu hình notification
- Bật/tắt notification
- Bật/tắt âm thanh
- Thời gian nhắc nhở mặc định

#### FR-5.3: Quản lý màu tag
- Thêm/sửa/xóa các tag màu
- Gán tên cho mỗi màu (ví dụ: Đỏ = Deadline, Xanh = Học, Vàng = Họp)

---

## 🎨 UI/UX Requirements

### Design Principles
- **Minimalist**: Giao diện tối giản, dễ nhìn
- **Clean**: Sắp xếp rõ ràng, không rối mắt
- **Intuitive**: Thao tác tự nhiên, dễ hiểu

### Color Scheme
- Primary: Blue/Timetable friendly
- Support multiple color tags for categorization
- Dark mode support

### Responsive Design
- Desktop first (ưu tiên trải nghiệm desktop)
- Tablet compatible
- Mobile view (có thể hạn chế tính năng)

### Layout Components

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo + Title + Settings Button + Export/Import │
├─────────────────────────────────────────────────────────┤
│  Controls: Week Navigator (< Prev Week | Next Week >)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┬──────────────────────────────────────────┐   │
│  │ Time │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │...   │   │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤   │
│  │ 6AM  │      │ Math │      │      │      │      │   │
│  │ 7AM  │ Gym  │ Math │      │ Code │      │ Sleep│   │
│  │ 8AM  │      │      │ Meet │ Code │      │      │   │
│  │ ...  │      │      │      │      │      │      │   │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FAB Button (+) to add new schedule                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Requirements

### TR-1: Code Quality

#### SOLID Principles (Bắt buộc)
Áp dụng nghiêm ngặt 5 nguyên tắc SOLID:

1. **Single Responsibility Principle (SRP)**
   - Mỗi class/function chỉ làm một việc
   - Ví dụ: `ScheduleService` chỉ xử lý logic schedule, `NotificationService` chỉ xử lý notification

2. **Open/Closed Principle (OCP)**
   - Các entity mở rộng được nhưng không sửa đổi
   - Sử dụng interface/abstract class

3. **Liskov Substitution Principle (LSP)**
   - Các class con có thể thay thế class cha
   - Thiết kế inheritance đúng cách

4. **Interface Segregation Principle (ISP)**
   - Nhiều interface nhỏ thay vì một interface lớn
   - Tránh "fat interface"

5. **Dependency Inversion Principle (DIP)**
   - Phụ thuộc vào abstraction, không phải concrete
   - Sử dụng dependency injection

#### Code Structure
```
src/
├── index.html
├── css/
│   └── styles.css (Tailwind imports + custom)
├── js/
│   ├── app.js (Main entry point)
│   ├── core/
│   │   ├── constants.js
│   │   ├── config.js
│   │   └── utils.js
│   ├── services/
│   │   ├── ScheduleService.js
│   │   ├── NotificationService.js
│   │   ├── StorageService.js
│   │   └── SettingsService.js
│   ├── repositories/
│   │   └── ScheduleRepository.js (IndexedDB operations)
│   ├── models/
│   │   ├── Schedule.js
│   │   ├── Tag.js
│   │   └── Settings.js
│   ├── controllers/
│   │   ├── ScheduleController.js
│   │   └── SettingsController.js
│   ├── views/
│   │   ├── WeeklyView.js
│   │   ├── DailyView.js
│   │   ├── ScheduleModal.js
│   │   └── SettingsModal.js
│   └── utils/
│       ├── DateTimeHelper.js
│       ├── NotificationHelper.js
│       └── ExportImportHelper.js
└── assets/
    └── icons/
```

### TR-2: Performance
- Load time < 2 seconds
- Smooth scrolling (60fps)
- Lazy load components if needed

### TR-3: Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### TR-4: IndexedDB Schema

```javascript
// Database: WeeklyScheduleDB
// Version: 1

const stores = {
  schedules: {
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'dayOfWeek', keyPath: 'dayOfWeek' },
      { name: 'startTime', keyPath: 'startTime' },
      { name: 'endTime', keyPath: 'endTime' }
    ]
  },
  tags: {
    keyPath: 'id',
    autoIncrement: true
  },
  settings: {
    keyPath: 'key'
  }
};
```

---

## 📦 Development Phases

### Phase 1: MVP (Minimum Viable Product)
**Goal:** Core functionality working

- [ ] Setup project structure with Tailwind CSS
- [ ] Implement IndexedDB storage layer
- [ ] Create basic weekly grid view
- [ ] Add/Edit/Delete schedule CRUD operations
- [ ] Basic notification (browser alert)
- [ ] Deploy to GitHub Pages

### Phase 2: Enhanced Features
**Goal:** Better UX and features

- [ ] Improve UI with better design
- [ ] Implement proper browser notifications
- [ ] Add sound alarm feature
- [ ] Dark/Light mode toggle
- [ ] Export/Import functionality
- [ ] Tag/Color management

### Phase 3: Polish & Optimization
**Goal:** Production-ready

- [ ] Advance reminder settings
- [ ] Daily view implementation
- [ ] Week navigation (prev/next week)
- [ ] Performance optimization
- [ ] Error handling & edge cases
- [ ] Documentation & README

---

## ✅ Acceptance Criteria

### AC-1: Weekly View
- [ ] Hiển thị đầy đủ 7 ngày trong tuần
- [ ] Khung giờ từ 6AM đến 11PM
- [ ] Scroll mượt mà
- [ ] Responsive trên desktop/tablet

### AC-2: Schedule Management
- [ ] Thêm được lịch mới
- [ ] Sửa được lịch đã tồn tại
- [ ] Xóa được lịch
- [ ] Dữ liệu được lưu tự động

### AC-3: Notifications
- [ ] Request notification permission
- [ ] Gửi notification đúng giờ
- [ ] Có âm thanh báo thức
- [ ] Tùy chọn nhắc nhở trước

### AC-4: Data Management
- [ ] Export ra file JSON
- [ ] Import từ file JSON
- [ ] Reset dữ liệu an toàn

### AC-5: Code Quality
- [ ] Áp dụng đúng SOLID principles
- [ ] Code được review và refactor
- [ ] Không có console errors
- [ ] Follow coding conventions

---

## 🚀 Deployment

### GitHub Pages Setup
1. Push code lên branch `main` hoặc `gh-pages`
2. Enable GitHub Pages trong repository settings
3. Custom domain (optional)

### Build Process
- Không cần build step (vanilla JS)
- Chỉ cần copy file lên hosting
- Tailwind CSS có thể dùng CDN hoặc build step

---

## 📝 Notes

### Future Enhancements (Out of Scope for now)
- Sync across devices (cần backend)
- Share schedule với người khác
- Integration với Google Calendar
- Recurring events (lặp lại hàng tuần)
- Task completion tracking

### Known Limitations
- Dữ liệu chỉ lưu trên một thiết bị/trình duyệt
- Notification chỉ hoạt động khi tab đang mở
- Không có backup tự động lên cloud

---

## 📚 References

### Libraries & Tools
- **Tailwind CSS**: https://tailwindcss.com/
- **IndexedDB**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Notification API**: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- **GitHub Pages**: https://pages.github.com/

### Design Inspiration
- Google Calendar
- Notion Calendar
- Any.do

---

## 👤 Author
Generated by AI Autonomous Engineer based on user requirements.

## 📅 Version History
- **v1.0** (Initial): First requirement document created

---

*This document serves as the single source of truth for the Weekly Schedule Manager project. All development should align with these requirements.*
