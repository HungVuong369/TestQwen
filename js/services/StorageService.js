// Storage Service - SRP: Handle localStorage for settings
class StorageService {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @returns {any|null} Stored value or null
     */
    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Failed to get item from storage:', e);
            return null;
        }
    }

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Failed to set item in storage:', e);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove item from storage:', e);
            return false;
        }
    }

    /**
     * Clear all app data from localStorage
     * @returns {boolean} Success status
     */
    static clearAll() {
        try {
            Object.values(CONFIG.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (e) {
            console.warn('Failed to clear storage:', e);
            return false;
        }
    }
}
