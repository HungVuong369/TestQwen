// Settings Service - SRP: Manage application settings
class SettingsService {
    constructor() {
        this.settings = null;
        this.storageKey = CONFIG.storageKeys.SETTINGS;
    }

    /**
     * Load settings from storage or create defaults
     * @returns {Settings} Settings instance
     */
    load() {
        const stored = StorageService.getItem(this.storageKey);
        if (stored) {
            this.settings = new Settings(stored);
        } else {
            this.settings = new Settings();
            this.save();
        }
        return this.settings;
    }

    /**
     * Save current settings to storage
     * @returns {boolean} Success status
     */
    save() {
        return StorageService.setItem(this.storageKey, this.settings.toJSON());
    }

    /**
     * Update settings
     * @param {Object} updates - Settings to update
     * @returns {Settings} Updated settings
     */
    update(updates) {
        Object.assign(this.settings, updates);
        this.save();
        return this.settings;
    }

    /**
     * Get current language
     * @returns {string} Language code
     */
    getLanguage() {
        return this.settings.language;
    }

    /**
     * Set language
     * @param {string} lang - Language code ('en' or 'vi')
     */
    setLanguage(lang) {
        this.update({ language: lang });
    }

    /**
     * Get translations for current language
     * @returns {Object} Translation object
     */
    getTranslations() {
        return this.settings.getTranslations();
    }

    /**
     * Check if dark mode is enabled
     * @returns {boolean} Dark mode status
     */
    isDarkMode() {
        return this.settings.darkMode;
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        this.update({ darkMode: !this.settings.darkMode });
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
        if (this.isDarkMode()) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    /**
     * Reset settings to defaults
     */
    reset() {
        this.settings = new Settings();
        this.save();
    }
}
