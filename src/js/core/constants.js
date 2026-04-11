// Application constants
const CONSTANTS = {
    // Time configuration
    DEFAULT_START_HOUR: 6,  // 6 AM
    DEFAULT_END_HOUR: 23,   // 11 PM
    HOURS_PER_DAY: 17,      // From 6 AM to 11 PM
    
    // Days of week (Monday = 0, Sunday = 6)
    DAYS_OF_WEEK: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    
    // Database configuration
    DB_NAME: 'WeeklyScheduleDB',
    DB_VERSION: 1,
    STORES: {
        SCHEDULES: 'schedules',
        SETTINGS: 'settings'
    },
    
    // Tag colors
    TAG_COLORS: {
        blue: '#3B82F6',
        green: '#10B981',
        red: '#EF4444',
        yellow: '#F59E0B',
        purple: '#8B5CF6',
        orange: '#F97316'
    },
    
    // UI configuration
    COMPACT_GRID: {
        ROW_HEIGHT: 28,  // pixels per hour slot
        FONT_SIZE: 10,   // base font size in px
        CELL_PADDING: 2  // padding in px
    },
    
    // Notification settings
    NOTIFICATION: {
        DEFAULT_REMINDER_MINUTES: 0,  // No advance reminder by default
        SOUND_ENABLED: true
    },
    
    // Default settings
    DEFAULT_SETTINGS: {
        language: 'en',
        darkMode: false,
        startHour: 6,
        endHour: 23,
        notificationEnabled: true,
        soundEnabled: true,
        reminderMinutes: 0
    }
};
