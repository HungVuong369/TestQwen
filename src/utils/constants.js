/**
 * Application Constants
 * Single source of truth for configuration values
 * Follows SRP - Only responsible for providing constants
 */

export const CONSTANTS = {
    // Database Configuration
    DB: {
        NAME: 'ScheduleManagerDB',
        VERSION: 1,
        STORE_NAME: 'events'
    },
    
    // Time Configuration
    TIME: {
        HOURS_IN_DAY: 24,
        START_HOUR: 0,
        END_HOUR: 23,
        MINUTES_IN_HOUR: 60,
        CHECK_INTERVAL: 30000 // Check alarms every 30 seconds
    },
    
    // Day Mapping (JavaScript Date: 0 = Sunday, 1 = Monday, etc.)
    DAYS: {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6
    },
    
    // Day Names for Display
    DAY_NAMES: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    DAY_NAMES_FULL: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    
    // Color Palette
    COLORS: [
        '#6366f1', // Indigo
        '#ec4899', // Pink
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#3b82f6'  // Blue
    ],
    
    // UI Configuration
    UI: {
        MODAL_ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        CONFIRMATION_REQUIRED: true
    },
    
    // Alarm Configuration
    ALARM: {
        SOUND_FILE: './assets/audio/alarm.mp3',
        SNOOZE_MINUTES: 5,
        MAX_REPEAT_COUNT: 3
    }
};

export default CONSTANTS;
