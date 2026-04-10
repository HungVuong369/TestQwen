# Tài liệu Yêu cầu Chi tiết - Ứng dụng Quản lý Lịch & Báo thức (Smart Schedule)

## 1. Tổng quan Dự án
- **Mục tiêu:** Xây dựng ứng dụng web quản lý thời khóa biểu tuần và báo thức thông minh, chạy hoàn toàn trên trình duyệt.
- **Triết lý thiết kế:** "Đơn giản - Tinh tế - Tiện dụng". UI phải đẹp, trực quan, dễ dùng ngay lần đầu tiên.
- **Nguyên tắc cốt lõi:** Tuân thủ nghiêm ngặt SOLID trong kiến trúc code.

## 2. Yêu cầu Chức năng (Functional Requirements)

### 2.1. Quản lý Thời khóa biểu (Schedule Management)
- **FR-01: Hiển thị lịch tuần**
  - Dạng lưới 7 cột (Thứ 2 - Chủ Nhật), trục dọc là khung giờ (00:00 - 23:59).
  - Tự động cuộn đến khung giờ hiện tại khi mở ứng dụng.
  - Hỗ trợ zoom in/out để thay đổi độ chi tiết khung giờ.
  
- **FR-02: Thao tác sự kiện (CRUD)**
  - **Thêm:** Click vào ô giờ → Modal form hiện ra với animation mượt mà.
  - **Sửa:** Click vào sự kiện đang có → Mở form với dữ liệu cũ.
  - **Xóa:** Click chuột phải hoặc icon xóa → Xác nhận trước khi xóa.
  - **Kéo thả (Drag & Drop):** Di chuyển sự kiện sang khung giờ/ngày khác.
  
- **FR-03: Chi tiết sự kiện**
  - Trường dữ liệu: Tiêu đề, Mô tả, Màu sắc (chọn từ palette), Thời gian bắt đầu/kết thúc.
  - Tùy chọn lặp lại: Không lặp, Hàng ngày, Hàng tuần, Theo ngày cụ thể (ví dụ: mỗi Thứ 2 & Thứ 4).
  - Tùy chọn báo thức: Bật/tắt, chọn âm thanh, thời gian nhắc trước (5p, 10p, 15p).

### 2.2. Hệ thống Báo thức & Thông báo (Alarm System)
- **FR-04: Kích hoạt tự động**
  - Quét dữ liệu mỗi giây để kiểm tra sự kiện đến giờ.
  - Phát âm thanh (có thể tùy chọn file âm thanh).
  - Hiển thị Popup trung tâm màn hình với hiệu ứng nổi bật.
  - Gửi Browser Notification (nếu người dùng đã cấp quyền).
  
- **FR-05: Quản lý trạng thái báo thức**
  - Nút "Tắt chuông" và "Nhắc lại sau 5 phút".
  - Đánh dấu sự kiện đã báo thức trong ngày (tránh báo trùng).
  - Hoạt động ngay cả khi tab bị ẩn (sử dụng Web Workers).

### 2.3. Giao diện & Trải nghiệm (UI/UX)
- **FR-06: Responsive Design**
  - Desktop: Hiển thị dạng lưới tuần đầy đủ.
  - Tablet/Mobile: Tự động chuyển sang dạng danh sách ngày hoặc lịch ngày đơn.
  
- **FR-07: Chế độ giao diện**
  - Dark/Light Mode: Chuyển đổi mượt mà, lưu lựa chọn người dùng.
  - Màu sắc sự kiện: Palette màu pastel tinh tế, dễ phân biệt nhưng không chói mắt.
  
- **FR-08: Phản hồi trực quan**
  - Toast message khi thêm/sửa/xóa thành công.
  - Loading state khi thao tác với dữ liệu lớn.
  - Hiệu ứng hover, focus rõ ràng cho các phần tử tương tác.

## 3. Yêu cầu Phi chức năng (Non-Functional Requirements)

### 3.1. Kiến trúc & Code Quality
- **NFR-01: Nguyên tắc SOLID**
  - **SRP (Single Responsibility Principle):** Mỗi class/module chỉ đảm nhận một trách nhiệm duy nhất.
    - *Ví dụ:* `DatabaseService` chỉ lo việc đọc/ghi IndexedDB, không biết về UI. `AlarmService` chỉ lo logic báo thức, không biết cách lưu trữ.
  - **OCP (Open/Closed Principle):** Mở rộng được tính năng mới mà không cần sửa code cũ.
    - *Ví dụ:* Muốn thêm loại báo thức mới (rung, email) thì chỉ cần tạo class mới implement interface `IAlarmHandler`, không sửa class `AlarmService`.
  - **LSP (Liskov Substitution Principle):** Các class con có thể thay thế class cha mà không làm lỗi chương trình.
    - *Ví dụ:* `LocalStorageAdapter` và `IndexedDBAdapter` đều implement `IStorageAdapter`, có thể thay thế cho nhau mà không ảnh hưởng logic chính.
  - **ISP (Interface Segregation Principle):** Interface nhỏ, chuyên biệt.
    - *Ví dụ:* Tách `IReadable` và `IWritable` thay vì một interface `IStorage` quá lớn.
  - **DIP (Dependency Inversion Principle):** Phụ thuộc vào abstraction, không phải concrete class.
    - *Ví dụ:* `ScheduleController` nhận `IStorageAdapter` qua constructor (Dependency Injection), không trực tiếp khởi tạo `IndexedDBAdapter`.

- **NFR-02: Modular Architecture**
  - Cấu trúc thư mục rõ ràng: `models`, `services`, `ui`, `utils`, `workers`.
  - Sử dụng ES6 Modules (`import`/`export`) cho tất cả các file JS.

### 3.2. Công nghệ & Thư viện
- **Ngôn ngữ:** HTML5, CSS3, JavaScript (ES6+).
- **Styling:** TailwindCSS (qua CDN) + Custom CSS cho animation phức tạp.
- **Lưu trữ:** IndexedDB (sử dụng thư viện `idb` để đơn giản hóa API).
- **Xử lý thời gian:** `dayjs` (nhẹ hơn moment.js).
- **Thông báo:** `Toastify-js` cho toast messages.
- **Icon:** `Phosphor Icons` hoặc `Heroicons` (dạng SVG, nhẹ, đẹp).

### 3.3. Hiệu năng & Bảo mật
- **Hiệu năng:** Tải trang dưới 2 giây, thao tác CRUD phản hồi dưới 100ms.
- **Bảo mật:** Không lưu dữ liệu nhạy cảm, toàn bộ dữ liệu nằm ở client-side.
- **Offline:** Hoạt động hoàn toàn khi không có mạng (PWA ready).

## 4. Thiết kế UI/UX Chi tiết

### 4.1. Phong cách thiết kế (Design System)
- **Màu sắc chủ đạo:** 
  - Primary: Indigo/Purple dịu mắt (#6366f1).
  - Background: Trắng kem (Light mode) / Xám xanh đậm (Dark mode).
  - Sự kiện: Palette màu pastel (Hồng, Xanh lá, Xanh dương, Vàng, Cam nhạt).
- **Font chữ:** 'Inter' hoặc 'Plus Jakarta Sans' (hiện đại, dễ đọc).
- **Bo góc:** Rounded-xl (12px) cho cards, buttons.
- **Shadow:** Shadow-md nhẹ nhàng, tạo chiều sâu tinh tế.

### 4.2. Bố cục màn hình chính
- **Header:** Logo, nút chuyển chế độ Dark/Light, nút "Hôm nay", nút "Thêm sự kiện nhanh".
- **Main Content:** Lưới lịch tuần chiếm toàn bộ không gian còn lại.
  - Cột bên trái: Khung giờ.
  - 7 cột còn lại: Ngày trong tuần.
- **Sidebar (Mobile - Bottom Nav):** Chuyển ngày, xem danh sách, cài đặt.

### 4.3. Tương tác đặc biệt
- **Modal Form:** Hiện ra từ giữa màn hình với backdrop blur, animation fade-in + scale-up.
- **Drag & Drop:** Sự kiện nổi lên khi kéo, có vạch hướng dẫn vị trí thả.
- **Alarm Popup:** Rung lắc nhẹ, nền tối đi, nút hành động lớn rõ ràng.

## 5. Kế hoạch Triển khai

### Giai đoạn 1: Khởi tạo & Core Architecture
- Setup project structure, tích hợp Tailwind, dayjs, idb.
- Xây dựng các Interface trừu tượng (IStorage, IAlarm, ISchedule).
- Implement `IndexedDBService` tuân thủ DIP.

### Giai đoạn 2: Chức năng Lịch (Schedule)
- Xây dựng UI lưới lịch tuần.
- Implement CRUD sự kiện.
- Tích hợp Drag & Drop.

### Giai đoạn 3: Hệ thống Báo thức (Alarm)
- Xây dựng `AlarmService` với Web Worker.
- Implement âm thanh, popup, notification.
- Logic xử lý lặp lại sự kiện.

### Giai đoạn 4: UI Polish & Testing
- Hoàn thiện Dark/Light mode.
- Tối ưu responsive mobile.
- Test các trường hợp biên (midnight, múi giờ, dữ liệu lớn).

## 6. Tiêu chí Chấp nhận (Acceptance Criteria)
- [ ] Code review đạt chuẩn SOLID, không vi phạm nguyên tắc nào.
- [ ] UI đẹp, mượt mà, không có độ trễ khi thao tác.
- [ ] Báo thức hoạt động chính xác kể cả khi tab bị ẩn.
- [ ] Dữ liệu được lưu persist qua IndexedDB, không mất khi refresh.
- [ ] Chạy tốt trên Chrome, Firefox, Safari (desktop & mobile).
