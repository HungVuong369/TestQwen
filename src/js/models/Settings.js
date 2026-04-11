// Settings Model - SRP: Define settings data structure
class Settings {
    constructor(data = {}) {
        this.language = data.language || CONSTANTS.DEFAULT_SETTINGS.language;
        this.darkMode = data.darkMode !== undefined ? data.darkMode : CONSTANTS.DEFAULT_SETTINGS.darkMode;
        this.startHour = data.startHour || CONSTANTS.DEFAULT_SETTINGS.startHour;
        this.endHour = data.endHour || CONSTANTS.DEFAULT_SETTINGS.endHour;
        this.notificationEnabled = data.notificationEnabled !== undefined ? data.notificationEnabled : CONSTANTS.DEFAULT_SETTINGS.notificationEnabled;
        this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : CONSTANTS.DEFAULT_SETTINGS.soundEnabled;
        this.reminderMinutes = data.reminderMinutes !== undefined ? data.reminderMinutes : CONSTANTS.DEFAULT_SETTINGS.reminderMinutes;
    }

    /**
     * Validate settings
     * @returns {Object} Validation result
     */
    validate() {
        const errors = [];

        if (!['en', 'vi'].includes(this.language)) {
            errors.push('Invalid language');
        }

        if (this.startHour < 0 || this.startHour > 23) {
            errors.push('Invalid start hour');
        }

        if (this.endHour < 1 || this.endHour > 24) {
            errors.push('Invalid end hour');
        }

        if (this.startHour >= this.endHour) {
            errors.push('Start hour must be before end hour');
        }

        if (this.reminderMinutes < 0 || this.reminderMinutes > 60) {
            errors.push('Invalid reminder minutes');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get current i18n translations based on language
     * @returns {Object} Translation object
     */
    getTranslations() {
        return this.language === 'vi' ? i18n_vi : i18n_en;
    }

    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            language: this.language,
            darkMode: this.darkMode,
            startHour: this.startHour,
            endHour: this.endHour,
            notificationEnabled: this.notificationEnabled,
            soundEnabled: this.soundEnabled,
            reminderMinutes: this.reminderMinutes
        };
    }
}
