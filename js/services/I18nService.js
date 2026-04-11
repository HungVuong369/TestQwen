/**
 * I18nService - Internationalization Service
 * Handles multi-language support for English and Vietnamese
 */
class I18nService {
    constructor(currentLang = 'en') {
        this.currentLanguage = currentLang;
        this.translations = {
            en: {
                // Days
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday',
                'sunday': 'Sunday',
                'mon': 'Mon',
                'tue': 'Tue',
                'wed': 'Wed',
                'thu': 'Thu',
                'fri': 'Fri',
                'sat': 'Sat',
                'sun': 'Sun',
                
                // Months
                'january': 'January',
                'february': 'February',
                'march': 'March',
                'april': 'April',
                'may': 'May',
                'june': 'June',
                'july': 'July',
                'august': 'August',
                'september': 'September',
                'october': 'October',
                'november': 'November',
                'december': 'December',
                
                // UI Elements
                'weekly_schedule': 'Weekly Schedule',
                'settings': 'Settings',
                'export': 'Export',
                'import': 'Import',
                'add_event': 'Add Event',
                'edit_event': 'Edit Event',
                'delete_event': 'Delete Event',
                'save': 'Save',
                'cancel': 'Cancel',
                'close': 'Close',
                'confirm': 'Confirm',
                'yes': 'Yes',
                'no': 'No',
                
                // Form Labels
                'event_name': 'Event Name',
                'start_time': 'Start Time',
                'end_time': 'End Time',
                'color': 'Color',
                'description': 'Description',
                'location': 'Location',
                'notes': 'Notes',
                
                // Settings
                'language': 'Language',
                'dark_mode': 'Dark Mode',
                'notifications': 'Notifications',
                'enable_notifications': 'Enable Notifications',
                'notification_sound': 'Notification Sound',
                'reminder_before': 'Remind me before (minutes)',
                
                // Messages
                'event_saved': 'Event saved successfully',
                'event_deleted': 'Event deleted successfully',
                'event_created': 'Event created successfully',
                'error_saving': 'Error saving event',
                'error_deleting': 'Error deleting event',
                'confirm_delete': 'Are you sure you want to delete this event?',
                'required_field': 'This field is required',
                'invalid_time': 'End time must be after start time',
                'export_success': 'Data exported successfully',
                'import_success': 'Data imported successfully',
                'import_error': 'Error importing data',
                
                // Time
                'am': 'AM',
                'pm': 'PM',
                'today': 'Today',
                'tomorrow': 'Tomorrow',
                'yesterday': 'Yesterday',
                'now': 'Now',
                
                // Errors
                'error': 'Error',
                'warning': 'Warning',
                'info': 'Information',
                'success': 'Success'
            },
            vi: {
                // Days
                'monday': 'Thứ Hai',
                'tuesday': 'Thứ Ba',
                'wednesday': 'Thứ Tư',
                'thursday': 'Thứ Năm',
                'friday': 'Thứ Sáu',
                'saturday': 'Thứ Bảy',
                'sunday': 'Chủ Nhật',
                'mon': 'T2',
                'tue': 'T3',
                'wed': 'T4',
                'thu': 'T5',
                'fri': 'T6',
                'sat': 'T7',
                'sun': 'CN',
                
                // Months
                'january': 'Tháng 1',
                'february': 'Tháng 2',
                'march': 'Tháng 3',
                'april': 'Tháng 4',
                'may': 'Tháng 5',
                'june': 'Tháng 6',
                'july': 'Tháng 7',
                'august': 'Tháng 8',
                'september': 'Tháng 9',
                'october': 'Tháng 10',
                'november': 'Tháng 11',
                'december': 'Tháng 12',
                
                // UI Elements
                'weekly_schedule': 'Thời Khóa Biểu',
                'settings': 'Cài Đặt',
                'export': 'Xuất Dữ Liệu',
                'import': 'Nhập Dữ Liệu',
                'add_event': 'Thêm Sự Kiện',
                'edit_event': 'Chỉnh Sửa',
                'delete_event': 'Xóa Sự Kiện',
                'save': 'Lưu',
                'cancel': 'Hủy',
                'close': 'Đóng',
                'confirm': 'Xác Nhận',
                'yes': 'Có',
                'no': 'Không',
                
                // Form Labels
                'event_name': 'Tên Sự Kiện',
                'start_time': 'Giờ Bắt Đầu',
                'end_time': 'Giờ Kết Thúc',
                'color': 'Màu Sắc',
                'description': 'Mô Tả',
                'location': 'Địa Điểm',
                'notes': 'Ghi Chú',
                
                // Settings
                'language': 'Ngôn Ngữ',
                'dark_mode': 'Chế Độ Tối',
                'notifications': 'Thông Báo',
                'enable_notifications': 'Bật Thông Báo',
                'notification_sound': 'Âm Thanh Thông Báo',
                'reminder_before': 'Nhắc trước (phút)',
                
                // Messages
                'event_saved': 'Sự kiện đã được lưu thành công',
                'event_deleted': 'Sự kiện đã được xóa thành công',
                'event_created': 'Sự kiện đã được tạo thành công',
                'error_saving': 'Lỗi khi lưu sự kiện',
                'error_deleting': 'Lỗi khi xóa sự kiện',
                'confirm_delete': 'Bạn có chắc chắn muốn xóa sự kiện này?',
                'required_field': 'Trường này là bắt buộc',
                'invalid_time': 'Giờ kết thúc phải sau giờ bắt đầu',
                'export_success': 'Dữ liệu đã được xuất thành công',
                'import_success': 'Dữ liệu đã được nhập thành công',
                'import_error': 'Lỗi khi nhập dữ liệu',
                
                // Time
                'am': 'SA',
                'pm': 'CH',
                'today': 'Hôm nay',
                'tomorrow': 'Ngày mai',
                'yesterday': 'Hôm qua',
                'now': 'Bây giờ',
                
                // Errors
                'error': 'Lỗi',
                'warning': 'Cảnh báo',
                'info': 'Thông tin',
                'success': 'Thành công'
            }
        };
    }

    /**
     * Translate a key to the current language
     * @param {string} key - Translation key
     * @returns {string} Translated text or original key if not found
     */
    translate(key) {
        if (!key) return '';
        
        const translation = this.translations[this.currentLanguage]?.[key.toLowerCase()];
        return translation || this.translations['en'][key.toLowerCase()] || key;
    }

    /**
     * Set the current language
     * @param {string} lang - Language code ('en' or 'vi')
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
        }
    }

    /**
     * Get the current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get day name based on day index (0-6)
     * @param {number} dayIndex - Day index (0 = Sunday, 1 = Monday, etc.)
     * @param {boolean} short - Whether to return short form
     * @returns {string} Day name
     */
    getDayName(dayIndex, short = false) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const key = short && dayIndex >= 0 && dayIndex <= 6 
            ? ['sun','mon','tue','wed','thu','fri','sat'][dayIndex]
            : days[dayIndex];
        return this.translate(key);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nService;
}
