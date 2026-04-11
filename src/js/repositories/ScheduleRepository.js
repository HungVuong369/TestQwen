// Schedule Repository - SRP: Handle all IndexedDB operations for schedules
class ScheduleRepository {
    constructor() {
        this.db = null;
        this.dbName = CONSTANTS.DB_NAME;
        this.dbVersion = CONSTANTS.DB_VERSION;
        this.storeName = CONSTANTS.STORES.SCHEDULES;
    }

    /**
     * Initialize database connection
     * @returns {Promise<void>}
     */
    async init() {
        if (this.db) return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create schedules store
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('dayOfWeek', 'dayOfWeek', { unique: false });
                    store.createIndex('startTime', 'startTime', { unique: false });
                }
            };
        });
    }

    /**
     * Get all schedules
     * @returns {Promise<Array>} Array of schedules
     */
    async getAll() {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get schedules for a specific day
     * @param {string} dayOfWeek - Day name (e.g., 'mon', 'tue')
     * @returns {Promise<Array>} Array of schedules for the day
     */
    async getByDay(dayOfWeek) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('dayOfWeek');
            const request = index.getAll(dayOfWeek);

            request.onsuccess = () => {
                const schedules = request.result.sort((a, b) => a.startTime.localeCompare(b.startTime));
                resolve(schedules);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a single schedule by ID
     * @param {string} id - Schedule ID
     * @returns {Promise<Object|null>} Schedule or null
     */
    async getById(id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Add a new schedule
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<string>} New schedule ID
     */
    async add(scheduleData) {
        await this.init();
        const schedule = new Schedule(scheduleData);
        const validation = schedule.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(schedule.toJSON());

            request.onsuccess = () => resolve(schedule.id);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update an existing schedule
     * @param {Object} scheduleData - Updated schedule data
     * @returns {Promise<void>}
     */
    async update(scheduleData) {
        await this.init();
        const schedule = new Schedule({
            ...scheduleData,
            updatedAt: new Date().toISOString()
        });
        const validation = schedule.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(schedule.toJSON());

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a schedule
     * @param {string} id - Schedule ID
     * @returns {Promise<void>}
     */
    async delete(id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all schedules
     * @returns {Promise<void>}
     */
    async clearAll() {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Export all schedules to JSON
     * @returns {Promise<string>} JSON string
     */
    async export() {
        const schedules = await this.getAll();
        return JSON.stringify(schedules, null, 2);
    }

    /**
     * Import schedules from JSON
     * @param {string} jsonString - JSON string with schedules
     * @returns {Promise<number>} Number of imported schedules
     */
    async import(jsonString) {
        try {
            const schedules = JSON.parse(jsonString);
            if (!Array.isArray(schedules)) {
                throw new Error('Invalid format: expected array');
            }

            let count = 0;
            for (const scheduleData of schedules) {
                try {
                    await this.add(scheduleData);
                    count++;
                } catch (e) {
                    console.warn('Failed to import schedule:', scheduleData, e);
                }
            }
            return count;
        } catch (e) {
            throw new Error(`Import failed: ${e.message}`);
        }
    }
}
