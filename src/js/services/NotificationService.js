// Notification Service - SRP: Handle browser notifications and alarms
class NotificationService {
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.permission = Notification.permission;
        this.checkInterval = null;
    }

    /**
     * Request notification permission
     * @returns {Promise<string>} Permission status
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return 'denied';
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission;
    }

    /**
     * Check if notifications are enabled
     * @returns {boolean} Whether notifications can be shown
     */
    isEnabled() {
        const settings = this.settingsService.settings;
        return settings && settings.notificationEnabled && this.permission === 'granted';
    }

    /**
     * Show a notification
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     */
    show(title, options = {}) {
        if (!this.isEnabled()) return;

        const defaultOptions = {
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/badge-72.png',
            vibrate: [200, 100, 200],
            ...options
        };

        new Notification(title, defaultOptions);
    }

    /**
     * Play alarm sound
     */
    playAlarm() {
        const settings = this.settingsService.settings;
        if (!settings || !settings.soundEnabled) return;

        // Simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            setTimeout(() => oscillator.stop(), 500);
        } catch (e) {
            console.warn('Failed to play alarm:', e);
        }
    }

    /**
     * Start checking for upcoming schedules
     * @param {ScheduleService} scheduleService - Schedule service instance
     */
    startMonitoring(scheduleService) {
        this.stopMonitoring();

        this.checkInterval = setInterval(async () => {
            await this.checkSchedules(scheduleService);
        }, 60000); // Check every minute

        // Initial check
        this.checkSchedules(scheduleService);
    }

    /**
     * Stop monitoring schedules
     */
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Check schedules for notifications
     * @param {ScheduleService} scheduleService - Schedule service instance
     */
    async checkSchedules(scheduleService) {
        try {
            const now = new Date();
            const currentDay = DateTimeHelper.getDayName(now.getDay() - 1 || 6); // Convert to our format
            const currentTime = DateTimeHelper.minutesToTime(now.getHours() * 60 + now.getMinutes());
            const settings = this.settingsService.settings;
            const reminderMinutes = settings ? settings.reminderMinutes : 0;

            const schedulesByDay = await scheduleService.getSchedulesByDay();
            const todaySchedules = schedulesByDay[currentDay] || [];

            todaySchedules.forEach(schedule => {
                // Check if it's time for the event
                if (schedule.startTime === currentTime) {
                    this.show(this.translate('notifications.eventStarted', { name: schedule.name }));
                    this.playAlarm();
                }

                // Check for reminder
                if (reminderMinutes > 0) {
                    const reminderTime = this.addMinutes(schedule.startTime, -reminderMinutes);
                    if (reminderTime === currentTime) {
                        this.show(this.translate('notifications.upcomingEvent', { name: schedule.name }), {
                            body: `Starts in ${reminderMinutes} minutes`
                        });
                    }
                }
            });
        } catch (e) {
            console.warn('Error checking schedules:', e);
        }
    }

    /**
     * Add minutes to a time string
     * @param {string} timeStr - Time string (HH:MM)
     * @param {number} minutes - Minutes to add
     * @returns {string} New time string
     */
    addMinutes(timeStr, minutes) {
        const totalMinutes = DateTimeHelper.timeToMinutes(timeStr) + minutes;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours < 0 || hours >= 24) return null;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Get translation for current language
     * @param {string} key - Translation key
     * @param {Object} params - Translation parameters
     * @returns {string} Translated string
     */
    translate(key, params = {}) {
        const translations = this.settingsService.getTranslations();
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            value = value?.[k];
        }

        if (typeof value !== 'string') return key;

        // Replace parameters
        return value.replace(/{(\w+)}/g, (match, param) => params[param] || match);
    }
}
